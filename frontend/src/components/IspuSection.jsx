import { AirVent, Bike, HeartPulse, House, LocateFixed, Loader2, PanelsTopLeft, Search, ShieldCheck } from 'lucide-react';
import { getWorstIspu, getHealthRecommendations } from '../utils/healthAdvice.js';
import { ISPU_LEVELS, ispuMeta, titleCase } from '../utils/ispu';
import { StatusBadge, AqiScale, SourceMeta, StateMessage } from './ui';

const RECOMMENDATION_ICONS = {
    activity: Bike,
    home: House,
    windows: PanelsTopLeft,
    mask: ShieldCheck,
    medical: HeartPulse,
    purifier: AirVent,
};

export default function IspuSection({
    ispuList, topIspuList, searchIspu, setSearchIspu, handleSearchIspu, handleMyLocation,
    isSearching, isLoading, loadError, onRetry, fetchedAt, geoError, lastQuery, isDefaultView,
}) {
    const worst = getWorstIspu(ispuList);
    const advice = getHealthRecommendations(worst?.kategori);
    const worstMeta = worst ? ispuMeta(worst.kategori) : null;

    return (
        <section id="kualitas-udara" aria-labelledby="h-udara" className="panel scroll-mt-24">
            <div className="border-b border-line p-5 md:p-6">
                <h2 id="h-udara" className="text-2xl font-semibold">Kualitas udara</h2>
                <SourceMeta fetchedAt={fetchedAt} className="mt-1.5 max-w-3xl" />

                <form onSubmit={handleSearchIspu} className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end" role="search">
                    <div className="flex-1">
                        <label htmlFor="cari-wilayah" className="field-label">Kota atau kabupaten</label>
                        <input id="cari-wilayah" type="search" value={searchIspu} onChange={(e) => setSearchIspu(e.target.value)} placeholder="Contoh: Pontianak" className="field" autoComplete="off" />
                    </div>
                    <button type="submit" className="btn-ink" disabled={isSearching}>
                        {isSearching ? <Loader2 size={18} className="animate-spin" aria-hidden="true" /> : <Search size={18} aria-hidden="true" />}
                        {isSearching ? 'Mencari' : 'Cari'}
                    </button>
                    <button type="button" onClick={handleMyLocation} className="btn-line" disabled={isSearching}>
                        <LocateFixed size={18} aria-hidden="true" />Gunakan lokasi saya
                    </button>
                </form>
                <p className="field-hint">Browser akan meminta izin lokasi saat tombol ditekan. Izin ditolak? Cari dengan nama kota.</p>
                {geoError && <p role="alert" className="mt-2 text-sm font-medium text-danger">{geoError}</p>}
            </div>

            <div className="grid lg:grid-cols-[minmax(0,1fr)_340px]">
                <div className="lg:border-r border-line">
                    <div className="flex items-baseline justify-between gap-3 px-5 pt-4 md:px-6">
                        <h3 className="text-base font-semibold">{isDefaultView ? 'Kota pantauan Karhutla' : 'Hasil pencarian'}</h3>
                        {isDefaultView && <p className="text-sm text-muted">4 dari 10 kota, dipilih acak tiap dimuat</p>}
                    </div>

                    {isLoading || isSearching ? (
                        <StateMessage kind="loading" title="Mengambil data kualitas udara" />
                    ) : loadError ? (
                        <StateMessage kind="error" title="Data kualitas udara belum dapat dimuat" action={<button onClick={onRetry} className="btn-line">Coba lagi</button>}>
                            Periksa koneksi Anda. Tidak ada data lama yang ditampilkan sebagai pengganti.
                        </StateMessage>
                    ) : ispuList.length === 0 ? (
                        <StateMessage kind="empty" title={lastQuery ? `Wilayah “${lastQuery}” tidak ditemukan` : 'Data kualitas udara tidak tersedia'}>
                            Periksa ejaan, atau coba nama kota atau kabupaten yang lebih umum.
                        </StateMessage>
                    ) : (
                        <ul className="mt-2 divide-y divide-line">
                            {ispuList.map((item) => (
                                <li key={item.nama_stasiun} className="grid gap-x-6 gap-y-3 px-5 py-4 md:grid-cols-[minmax(0,1fr)_minmax(200px,1.1fr)_150px] md:items-center md:px-6">
                                    <div>
                                        <p className="text-lg font-semibold leading-tight">{titleCase(item.nama_stasiun)}</p>
                                        {item.pm25_val != null && <p className="text-sm text-muted">PM2.5 {Number(item.pm25_val).toFixed(1)} µg/m³</p>}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <p className="w-16 shrink-0 text-right text-3xl font-bold tabular-nums leading-none" aria-label={`Estimasi ISPU ${item.ispu_index}`}>{item.ispu_index}</p>
                                        <AqiScale value={item.ispu_index} kategori={item.kategori_udara} />
                                    </div>
                                    <div><StatusBadge kategori={item.kategori_udara} /></div>
                                </li>
                            ))}
                        </ul>
                    )}

                    <dl className="flex flex-wrap gap-x-5 gap-y-2 border-t border-line px-5 py-4 text-sm md:px-6" aria-label="Legenda kategori">
                        {ISPU_LEVELS.map((l) => (
                            <div key={l.key} className="flex items-center gap-2">
                                <dt className={`h-3 w-3 rounded-[3px] ${l.bar}`} aria-hidden="true" />
                                <dd><span className="font-medium">{l.label}</span> <span className="text-muted">{l.range}</span></dd>
                            </div>
                        ))}
                    </dl>
                </div>

                <aside className="p-5 md:p-6" aria-labelledby="h-saran">
                    <h3 id="h-saran" className="text-base font-semibold">
                        {worst ? <>Saat udara {worstMeta.label.toLowerCase()}</> : 'Saran kesehatan'}
                    </h3>
                    {worst && <p className="mt-0.5 text-sm text-muted">Berdasarkan nilai tertinggi di daftar: {titleCase(worst.nama)}, {worst.index}.</p>}
                    <ul className="mt-4 divide-y divide-line">
                        {advice.map(({ type, text }) => {
                            const Icon = RECOMMENDATION_ICONS[type];
                            return (
                                <li key={`${type}-${text}`} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-control bg-[#FFF5D9] text-[#A15300]" aria-hidden="true">
                                        <Icon size={22} strokeWidth={1.7} />
                                    </span>
                                    <p className="text-[15px] leading-snug">{text}</p>
                                </li>
                            );
                        })}
                    </ul>
                    <p className="mt-4 border-t border-line pt-3 text-sm text-muted">Saran umum. Ikuti arahan BPBD setempat dan tenaga kesehatan.</p>
                </aside>
            </div>

            <div className="border-t border-line p-5 md:p-6">
                <h3 className="text-base font-semibold">10 kota dengan estimasi tertinggi dari 15 kota pantauan</h3>
                <div className="mt-3 overflow-x-auto rounded-control border border-line">
                    <table className="w-full min-w-[520px] text-left text-[15px]">
                        <caption className="sr-only">Sepuluh kota dengan estimasi ISPU tertinggi</caption>
                        <thead className="bg-canvas text-sm text-muted">
                            <tr><th scope="col" className="px-4 py-2.5 font-medium w-16">Urutan</th><th scope="col" className="px-4 py-2.5 font-medium">Kota</th><th scope="col" className="px-4 py-2.5 font-medium w-28">Estimasi</th><th scope="col" className="px-4 py-2.5 font-medium">Kategori</th></tr>
                        </thead>
                        <tbody className="divide-y divide-line">
                            {topIspuList.length === 0 ? (
                                <tr><td colSpan="4" className="px-4 py-4 text-muted">{isLoading ? 'Memuat peringkat…' : 'Peringkat belum tersedia.'}</td></tr>
                            ) : topIspuList.map((it, i) => (
                                <tr key={it.nama_stasiun}>
                                    <td className="px-4 py-2.5 tabular-nums text-muted">{i + 1}</td>
                                    <td className="px-4 py-2.5 font-medium">{titleCase(it.nama_stasiun)}</td>
                                    <td className="px-4 py-2.5 font-semibold tabular-nums">{it.ispu_index}</td>
                                    <td className="px-4 py-2.5"><StatusBadge kategori={it.kategori_udara} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}
