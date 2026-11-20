import test from 'node:test';
import assert from 'node:assert/strict';
import { getHospitals, normalizeHospital } from '../controllers/hospitalController.mjs';

const makeResponse = () => ({
    statusCode: 200,
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; }
});

test('normalizes a Nominatim hospital result and its contact details', () => {
    const hospital = normalizeHospital({
        osm_type: 'way',
        osm_id: 123,
        lat: '-6.2',
        lon: '106.8',
        category: 'amenity',
        type: 'hospital',
        name: 'RS Contoh',
        address: { road: 'Jalan Sehat', house_number: '10', city: 'Kota Contoh' },
        extratags: { phone: '+62 21 1234', healthcare: 'hospital' }
    });

    assert.deepEqual(hospital, {
        type: 'hospital',
        hospital_id: 'way-123',
        nama: 'RS Contoh',
        alamat: '10 Jalan Sehat, Kota Contoh',
        kontak: '+62 21 1234',
        latitude: -6.2,
        longitude: 106.8,
        osm_type: 'way',
        osm_id: 123
    });
});

test('ignores malformed and non-hospital Nominatim results', () => {
    assert.equal(normalizeHospital({ osm_type: 'way', osm_id: 1, lat: 'invalid', lon: 106, type: 'hospital' }), null);
    assert.equal(normalizeHospital({ osm_type: 'node', osm_id: 2, lat: -6, lon: 106, type: 'pharmacy' }), null);
});

test('queries hospitals in a bounded area, filters to 20 km, sorts, and caches', async () => {
    const originalFetch = globalThis.fetch;
    let requestCount = 0;
    globalThis.fetch = async (url, options) => {
        requestCount += 1;
        const requestUrl = new URL(url);
        assert.equal(requestUrl.origin, 'https://nominatim.openstreetmap.org');
        assert.equal(requestUrl.pathname, '/search');
        assert.equal(requestUrl.searchParams.get('amenity'), 'hospital');
        assert.equal(requestUrl.searchParams.get('bounded'), '1');
        assert.equal(requestUrl.searchParams.get('limit'), '40');
        assert.match(options.headers['User-Agent'], /SiagAsap/);
        return {
            ok: true,
            json: async () => [
                { osm_type: 'node', osm_id: 987, lat: -7.12345, lon: 107.76543, type: 'hospital', name: 'RS Dekat' },
                { osm_type: 'way', osm_id: 988, lat: -7.33, lon: 107.76543, type: 'hospital', name: 'RS Terlalu Jauh' },
                { osm_type: 'node', osm_id: 989, lat: -7.12345, lon: 107.76543, type: 'pharmacy', name: 'Apotek' }
            ]
        };
    };

    try {
        const req = { query: { lat: '-7.12345', lng: '107.76543' } };
        const firstResponse = makeResponse();
        await getHospitals(req, firstResponse);
        const cachedResponse = makeResponse();
        await getHospitals(req, cachedResponse);

        assert.deepEqual(firstResponse.body.data.map(hospital => hospital.nama), ['RS Dekat']);
        assert.equal(cachedResponse.body.data[0].hospital_id, 'node-987');
        assert.equal(requestCount, 1);
    } finally {
        globalThis.fetch = originalFetch;
    }
});

test('queues uncached searches at no more than one request per second', async () => {
    const originalFetch = globalThis.fetch;
    const requestTimes = [];
    globalThis.fetch = async () => {
        requestTimes.push(Date.now());
        return { ok: true, json: async () => [] };
    };

    try {
        await Promise.all([
            getHospitals({ query: { lat: '1.12345', lng: '1.12345' } }, makeResponse()),
            getHospitals({ query: { lat: '2.12345', lng: '2.12345' } }, makeResponse())
        ]);
        assert.equal(requestTimes.length, 2);
        assert.ok(requestTimes[1] - requestTimes[0] >= 950);
    } finally {
        globalThis.fetch = originalFetch;
    }
});

test('rejects invalid coordinates without querying Nominatim', async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () => {
        throw new Error('Fetch must not run for invalid coordinates');
    };
    const response = makeResponse();

    try {
        await getHospitals({ query: { lat: '91', lng: '107' } }, response);
        assert.equal(response.statusCode, 400);
        assert.equal(response.body.success, false);
    } finally {
        globalThis.fetch = originalFetch;
    }
});

test('returns a useful error when Nominatim is unavailable', async () => {
    const originalFetch = globalThis.fetch;
    const originalConsoleError = console.error;
    globalThis.fetch = async () => ({ ok: false, status: 503 });
    console.error = () => {};
    const response = makeResponse();

    try {
        await getHospitals({ query: { lat: '-8.12345', lng: '114.12345' } }, response);
        assert.equal(response.statusCode, 502);
        assert.match(response.body.error, /posko manual tetap tersedia/);
        assert.match(response.body.details, /HTTP 503/);
    } finally {
        globalThis.fetch = originalFetch;
        console.error = originalConsoleError;
    }
});
