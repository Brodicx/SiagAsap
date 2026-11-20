const NOMINATIM_DEFAULT_URL = 'https://nominatim.openstreetmap.org/search';
const SEARCH_RADIUS_METERS = 20000;
const REQUEST_TIMEOUT_MS = 15000;
const CACHE_TTL_MS = 15 * 60 * 1000;
const CACHE_LIMIT = 100;
const hospitalCache = new Map();
let nominatimQueue = Promise.resolve();
let lastNominatimRequestAt = 0;

const distanceMeters = (lat1, lon1, lat2, lon2) => {
    const toRadians = (degrees) => degrees * Math.PI / 180;
    const latDelta = toRadians(lat2 - lat1);
    const lonDelta = toRadians(lon2 - lon1);
    const a = Math.sin(latDelta / 2) ** 2 +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(lonDelta / 2) ** 2;
    return 12742000 * Math.asin(Math.sqrt(a));
};

export const normalizeHospital = (item) => {
    const latitude = Number(item.lat);
    const longitude = Number(item.lon);
    const id = Number(item.osm_id);
    const osmType = item.osm_type;
    const tags = item.extratags ?? {};

    if (!['node', 'way', 'relation'].includes(osmType) || !Number.isInteger(id) || id < 1 ||
        !Number.isFinite(latitude) || latitude < -90 || latitude > 90 ||
        !Number.isFinite(longitude) || longitude < -180 || longitude > 180 ||
        (item.type !== 'hospital' && tags.amenity !== 'hospital' && tags.healthcare !== 'hospital')) {
        return null;
    }

    const address = item.address ?? {};
    const street = [address.house_number, address.road].filter(Boolean).join(' ');
    const addressText = [
        street,
        address.neighbourhood,
        address.suburb,
        address.city || address.town || address.village || address.municipality,
        address.state
    ].filter(Boolean).join(', ');

    return {
        type: 'hospital',
        hospital_id: `${osmType}-${id}`,
        nama: item.name || tags.name || 'Rumah sakit tanpa nama',
        alamat: addressText || item.display_name || 'Alamat tidak tercantum di OpenStreetMap',
        kontak: tags.phone || tags['contact:phone'] || '',
        latitude,
        longitude,
        osm_type: osmType,
        osm_id: id
    };
};

const parseCoordinate = (value, min, max) => {
    if (typeof value !== 'string' || value.trim() === '') return null;
    const coordinate = Number(value);
    return Number.isFinite(coordinate) && coordinate >= min && coordinate <= max ? coordinate : null;
};

const searchNominatim = (url) => {
    const request = nominatimQueue.then(async () => {
        const delay = Math.max(0, 1000 - (Date.now() - lastNominatimRequestAt));
        if (delay > 0) await new Promise(resolve => setTimeout(resolve, delay));
        lastNominatimRequestAt = Date.now();

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
        try {
            const response = await fetch(url, {
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'SiagAsap/1.0'
                },
                signal: controller.signal
            });
            if (!response.ok) throw new Error(`Nominatim returned HTTP ${response.status}`);

            const results = await response.json();
            if (!Array.isArray(results)) throw new Error('Nominatim returned an invalid hospital list');
            return results;
        } finally {
            clearTimeout(timeout);
        }
    });

    nominatimQueue = request.then(() => undefined, () => undefined);
    return request;
};

export const getHospitals = async (req, res) => {
    const latitude = parseCoordinate(req.query.lat, -90, 90);
    const longitude = parseCoordinate(req.query.lng, -180, 180);

    if (latitude === null || longitude === null) {
        return res.status(400).json({ success: false, error: 'Koordinat latitude dan longitude wajib valid.' });
    }

    const cacheKey = `${latitude.toFixed(5)},${longitude.toFixed(5)}`;
    const cached = hospitalCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
        return res.json({ success: true, data: cached.data });
    }
    hospitalCache.delete(cacheKey);

    const latitudeDelta = SEARCH_RADIUS_METERS / 111320;
    const longitudeDelta = Math.min(
        180,
        SEARCH_RADIUS_METERS / (111320 * Math.max(0.01, Math.cos(latitude * Math.PI / 180)))
    );
    const left = Math.max(-180, longitude - longitudeDelta);
    const right = Math.min(180, longitude + longitudeDelta);
    const top = Math.min(90, latitude + latitudeDelta);
    const bottom = Math.max(-90, latitude - latitudeDelta);
    const url = new URL(process.env.NOMINATIM_URL || NOMINATIM_DEFAULT_URL);
    url.search = new URLSearchParams({
        format: 'jsonv2',
        amenity: 'hospital',
        viewbox: `${left},${top},${right},${bottom}`,
        bounded: '1',
        limit: '40',
        addressdetails: '1',
        extratags: '1'
    }).toString();

    try {
        const results = await searchNominatim(url);
        const data = results
            .map(normalizeHospital)
            .filter(hospital => hospital &&
                distanceMeters(latitude, longitude, hospital.latitude, hospital.longitude) <= SEARCH_RADIUS_METERS)
            .sort((a, b) => distanceMeters(latitude, longitude, a.latitude, a.longitude) -
                distanceMeters(latitude, longitude, b.latitude, b.longitude));

        if (hospitalCache.size >= CACHE_LIMIT) {
            hospitalCache.delete(hospitalCache.keys().next().value);
        }
        hospitalCache.set(cacheKey, { data, expiresAt: Date.now() + CACHE_TTL_MS });

        return res.json({ success: true, data });
    } catch (error) {
        console.error('Gagal mengambil rumah sakit dari OpenStreetMap Nominatim:', error);
        return res.status(502).json({
            success: false,
            error: 'Layanan pencarian rumah sakit sementara tidak merespons. Coba lagi nanti; posko manual tetap tersedia.',
            details: error.message
        });
    }
};
