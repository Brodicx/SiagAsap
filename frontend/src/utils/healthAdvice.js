export const getWorstIspu = (ispuList) => {
    if (!ispuList || ispuList.length === 0) return null;
    const worst = ispuList.reduce((prev, current) => (prev.ispu_index > current.ispu_index ? prev : current));
    return { index: worst.ispu_index, kategori: worst.kategori_udara, nama: worst.nama_stasiun };
};

// Saran umum per kategori; bukan pengganti arahan BPBD atau tenaga kesehatan.
export const getHealthRecommendations = (kategori) => {
    switch (kategori) {
        case 'Baik':
            return [
                { type: 'activity', text: 'Aman untuk aktivitas di luar ruangan, termasuk olahraga.' },
                { type: 'windows', text: 'Ventilasi rumah boleh dibuka.' },
            ];
        case 'Sedang':
            return [
                { type: 'activity', text: 'Kelompok sensitif (anak, lansia, penderita asma atau penyakit jantung) sebaiknya mengurangi aktivitas berat di luar.' },
                { type: 'windows', text: 'Jendela masih boleh dibuka.' },
            ];
        case 'Tidak Sehat':
            return [
                { type: 'activity', text: 'Hindari olahraga di luar ruangan.' },
                { type: 'windows', text: 'Tutup jendela.' },
                { type: 'purifier', text: 'Nyalakan penyaring udara bila ada.' },
                { type: 'mask', text: 'Pakai masker N95 bila harus keluar.' },
            ];
        case 'Sangat Tidak Sehat':
            return [
                { type: 'home', text: 'Tetap di dalam ruangan dengan pintu dan jendela tertutup.' },
                { type: 'mask', text: 'Pakai masker N95 bila terpaksa keluar.' },
                { type: 'medical', text: 'Kelompok sensitif yang sesak atau batuk berat perlu ke posko medis.' },
            ];
        case 'Berbahaya (Hitam)':
            return [
                { type: 'activity', text: 'Jangan beraktivitas di luar ruangan.' },
                { type: 'windows', text: 'Tutup celah pintu dan jendela.' },
                { type: 'purifier', text: 'Nyalakan penyaring udara bila ada.' },
                { type: 'medical', text: 'Segera ke posko medis bila sesak napas.' },
            ];
        default:
            return [{ type: 'home', text: 'Saran akan muncul setelah data kualitas udara dimuat.' }];
    }
};
