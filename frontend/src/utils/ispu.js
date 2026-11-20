import { CircleCheck, Info, TriangleAlert, OctagonAlert, ShieldAlert, CircleHelp } from 'lucide-react';

// Kategori mengikuti nama dari backend (getKategoriUdara). Warna: biru/hijau/kuning/merah/hitam
// sesuai konvensi ISPU; setiap kategori juga punya ikon dan label teks.
export const ISPU_LEVELS = [
    { key: 'Baik', label: 'Baik', range: '0–50', max: 50, Icon: CircleCheck, badge: 'bg-[#E3F4EA] text-[#14532D]', bar: 'bg-[#2E9E5B]' },
    { key: 'Sedang', label: 'Sedang', range: '51–100', max: 100, Icon: Info, badge: 'bg-[#E3EEFB] text-[#123F7A]', bar: 'bg-[#2F6FC4]' },
    { key: 'Tidak Sehat', label: 'Tidak sehat', range: '101–200', max: 200, Icon: TriangleAlert, badge: 'bg-[#FFEFB8] text-[#5C4100]', bar: 'bg-[#E9B400]' },
    { key: 'Sangat Tidak Sehat', label: 'Sangat tidak sehat', range: '201–300', max: 300, Icon: OctagonAlert, badge: 'bg-[#FBE0E0] text-[#8A1212]', bar: 'bg-[#D32F2F]' },
    { key: 'Berbahaya (Hitam)', label: 'Berbahaya', range: '301+', max: 500, Icon: ShieldAlert, badge: 'bg-ink text-white', bar: 'bg-ink' },
];

const UNKNOWN = { key: '?', label: 'Tidak diketahui', range: '', Icon: CircleHelp, badge: 'bg-slate-100 text-slate-700', bar: 'bg-slate-300' };

export const ispuMeta = (kategori) => ISPU_LEVELS.find((l) => l.key === kategori) || UNKNOWN;

// Posisi penanda pada skala 5 segmen (0–100%)
export const scalePosition = (value) => {
    const bounds = [0, 50, 100, 200, 300, 500];
    const v = Math.max(0, Math.min(Number(value) || 0, 500));
    let i = bounds.findIndex((b, n) => n < 5 && v <= bounds[n + 1]);
    if (i < 0) i = 4;
    const frac = (v - bounds[i]) / (bounds[i + 1] - bounds[i]);
    return ((i + Math.min(Math.max(frac, 0), 1)) / 5) * 100;
};

export const titleCase = (s = '') =>
    s.toLowerCase().replace(/(^|[\s(])([a-zà-ÿ])/g, (m, p, c) => p + c.toUpperCase()).replace('(gps)', '(GPS)');
