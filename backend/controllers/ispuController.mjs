import { fetchOpenMeteoCalculated, calculateIspu, getKategoriUdara } from '../utils/ispuHelper.mjs';

export const getIspu = async (req, res) => {
    try {
        const { city, lat, lng } = req.query;
        const ispuRealTime = [];

        if (lat && lng) {
            const result = await fetchOpenMeteoCalculated(lat, lng, 'LOKASI ANDA (GPS)');
            if (result) ispuRealTime.push(result);
        } else if (city) {
            const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=id`;
            const geoRes = await fetch(geoUrl);
            const geoData = await geoRes.json();
            if (geoData.results && geoData.results.length > 0) {
                const lokasi = geoData.results[0];
                const result = await fetchOpenMeteoCalculated(lokasi.latitude, lokasi.longitude, lokasi.name.toUpperCase());
                if (result) ispuRealTime.push(result);
            }
        } else {
            const cityPool = [
                { name: 'PALANGKARAYA', lat: -2.2161, lon: 113.9150 },
                { name: 'PONTIANAK', lat: -0.0227, lon: 109.3323 },
                { name: 'PEKANBARU', lat: 0.5071, lon: 101.4451 },
                { name: 'BANJARBARU', lat: -3.4402, lon: 114.8296 },
                { name: 'JAMBI', lat: -1.6101, lon: 103.6141 },
                { name: 'PALEMBANG', lat: -2.9909, lon: 104.7566 },
                { name: 'BANJARMASIN', lat: -3.3194, lon: 114.5908 },
                { name: 'SAMARINDA', lat: -0.5022, lon: 117.1536 },
                { name: 'TARAKAN', lat: 3.3036, lon: 117.6322 },
                { name: 'SINTANG', lat: -0.0683, lon: 111.4984 }
            ];

            const shuffledCities = cityPool.sort(() => 0.5 - Math.random()).slice(0, 4);
            for (const c of shuffledCities) {
                const result = await fetchOpenMeteoCalculated(c.lat, c.lon, c.name);
                if (result) ispuRealTime.push(result);
            }
        }
        res.json({ success: true, data: ispuRealTime });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

export const getTopIspu = async (req, res) => {
    try {
        const cityPool = [
            { name: 'PALANGKARAYA', lat: -2.2161, lon: 113.9150 },
            { name: 'PONTIANAK', lat: -0.0227, lon: 109.3323 },
            { name: 'PEKANBARU', lat: 0.5071, lon: 101.4451 },
            { name: 'BANJARBARU', lat: -3.4402, lon: 114.8296 },
            { name: 'JAMBI', lat: -1.6101, lon: 103.6141 },
            { name: 'PALEMBANG', lat: -2.9909, lon: 104.7566 },
            { name: 'BANJARMASIN', lat: -3.3194, lon: 114.5908 },
            { name: 'JAKARTA', lat: -6.2088, lon: 106.8456 },
            { name: 'BANDUNG', lat: -6.9147, lon: 107.6098 },
            { name: 'SURABAYA', lat: -7.2504, lon: 112.7688 },
            { name: 'MEDAN', lat: 3.5952, lon: 98.6722 },
            { name: 'MAKASSAR', lat: -5.1477, lon: 119.4327 },
            { name: 'SINTANG', lat: -0.0683, lon: 111.4984 },
            { name: 'SAMPIT', lat: -2.5323, lon: 112.9515 },
            { name: 'DUMAI', lat: 1.6671, lon: 101.4482 }
        ];

        const promises = cityPool.map(async (c) => {
            const response = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${c.lat}&longitude=${c.lon}&current=pm2_5`);
            const data = await response.json();
            if (data.current && data.current.pm2_5 !== null) {
                const ispuVal = calculateIspu(data.current.pm2_5);
                return {
                    nama_stasiun: c.name,
                    ispu_index: ispuVal,
                    kategori_udara: getKategoriUdara(ispuVal)
                };
            }
            return null;
        });

        let results = await Promise.all(promises);
        results = results.filter(r => r !== null);
        results.sort((a, b) => b.ispu_index - a.ispu_index);

        res.json({ success: true, data: results.slice(0, 10) });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};