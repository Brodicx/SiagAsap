export const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
};

export const getIspuColor = (kategori) => {
    let colors = '';
    switch (kategori) {
        case 'Baik': colors = 'bg-green-100 text-green-800 border-green-300'; break;
        case 'Sedang': colors = 'bg-blue-100 text-blue-800 border-blue-300'; break;
        case 'Tidak Sehat': colors = 'bg-yellow-100 text-yellow-800 border-yellow-300'; break;
        case 'Sangat Tidak Sehat': colors = 'bg-red-100 text-red-800 border-red-300'; break;
        case 'Berbahaya (Hitam)': colors = 'bg-slate-900 text-white border-slate-700 animate-pulse shadow-lg'; break;
        default: colors = 'bg-gray-100 text-gray-800 border-gray-300';
    }
    return `badge-base ${colors}`;
};

export const getStatusBadge = (status) => {
    let colors = '';
    switch (status) {
        case 'Menunggu Verifikasi': colors = 'bg-amber-100 text-amber-800 border-amber-300'; break;
        case 'Diverifikasi': colors = 'bg-blue-100 text-blue-800 border-blue-300'; break;
        case 'Proses Pemadaman': colors = 'bg-orange-100 text-orange-800 border-orange-300 animate-pulse'; break;
        case 'Padam': colors = 'bg-emerald-100 text-emerald-800 border-emerald-300'; break;
        case 'Laporan Palsu': colors = 'bg-rose-100 text-rose-800 border-rose-300'; break;
        default: colors = 'bg-gray-100 text-gray-800 border-gray-300';
    }
    return `badge-base ${colors}`;
};