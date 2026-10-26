export const calculateIspu = (pm25) => {
    if (!pm25) return 0;
    if (pm25 <= 15.5) return Math.round((50 / 15.5) * pm25);
    if (pm25 <= 55.4) return Math.round(51 + ((49 / 39.9) * (pm25 - 15.6)));
    if (pm25 <= 150.4) return Math.round(101 + ((99 / 95) * (pm25 - 55.5)));
    if (pm25 <= 250.4) return Math.round(201 + ((99 / 100) * (pm25 - 150.5)));
    return Math.round(301 + (pm25 - 250.5));
};

export const getKategoriUdara = (aqi) => {
    if (aqi === null || aqi === undefined) return 'Tidak Diketahui';
    if (aqi <= 50) return 'Baik';
    if (aqi <= 100) return 'Sedang';
    if (aqi <= 199) return 'Tidak Sehat';
    if (aqi <= 299) return 'Sangat Tidak Sehat';
    return 'Berbahaya (Hitam)';
};

export const fetchOpenMeteoCalculated = async (latitude, longitude, namaLokasi) => {
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=pm2_5`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.current && data.current.pm2_5 !== null) {
        const pm25 = data.current.pm2_5;
        const ispuVal = calculateIspu(pm25);

        return {
            nama_stasiun: namaLokasi,
            lokasi_wilayah: `Satelit Pemantau (Open-Meteo)`,
            pm25_val: pm25,
            ispu_index: ispuVal,
            kategori_udara: getKategoriUdara(ispuVal)
        };
    }
    return null;
};