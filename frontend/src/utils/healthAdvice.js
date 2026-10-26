export const getWorstIspu = (ispuList) => {
    if (!ispuList || ispuList.length === 0) return { index: 0, kategori: 'Baik' };
    const worst = ispuList.reduce((prev, current) => (prev.ispu_index > current.ispu_index) ? prev : current);
    return { index: worst.ispu_index, kategori: worst.kategori_udara };
};

export const getHealthRecommendations = (kategori) => {
    switch (kategori) {
        case 'Baik':
            return [
                { icon: '🏃', text: 'Sangat baik untuk aktivitas luar ruangan.' },
                { icon: '🪟', text: 'Buka jendela untuk ventilasi udara segar.' },
                { icon: '🚴', text: 'Aman untuk olahraga berat.' }
            ];
        case 'Sedang':
            return [
                { icon: '🚶', text: 'Kelompok sensitif sebaiknya kurangi aktivitas fisik berat di luar.' },
                { icon: '🪟', text: 'Masih aman membuka jendela.' },
                { icon: '😷', text: 'Gunakan masker jika Anda mudah alergi.' }
            ];
        case 'Tidak Sehat':
            return [
                { icon: '🏃', text: 'Hindari olahraga luar ruangan.' },
                { icon: '🚪', text: 'Tutup jendela untuk mencegah masuknya udara kotor.' },
                { icon: '😷', text: 'Gunakan masker (tipe N95 disarankan) jika harus keluar.' },
                { icon: '💨', text: 'Nyalakan air purifier jika tersedia.' }
            ];
        case 'Sangat Tidak Sehat':
            return [
                { icon: '🏠', text: 'Tetap berada di dalam ruangan.' },
                { icon: '🚪', text: 'Tutup rapat semua jendela dan pintu.' },
                { icon: '😷', text: 'Wajib gunakan masker N95 jika sangat mendesak untuk keluar.' },
                { icon: '💨', text: 'Nyalakan air purifier secara terus-menerus.' }
            ];
        case 'Berbahaya (Hitam)':
            return [
                { icon: '🚨', text: 'BAHAYA! Jangan keluar rumah sama sekali.' },
                { icon: '🚪', text: 'Tutup dan segel celah jendela/pintu.' },
                { icon: '😷', text: 'Gunakan masker N95 bahkan di dalam ruangan jika asap terasa.' },
                { icon: '💨', text: 'Gunakan air purifier pada kecepatan maksimal.' }
            ];
        default:
            return [{ icon: 'ℹ️', text: 'Menunggu data kualitas udara...' }];
    }
};