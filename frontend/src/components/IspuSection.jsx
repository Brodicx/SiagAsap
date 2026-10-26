import { getIspuColor } from '../utils/helpers';
import { getWorstIspu, getHealthRecommendations } from '../utils/healthAdvice.js';

export default function IspuSection({ ispuList, topIspuList, searchIspu, setSearchIspu, handleSearchIspu, handleMyLocation, isSearching }) {
    const currentWorstAir = getWorstIspu(ispuList);
    const recommendations = getHealthRecommendations(currentWorstAir.kategori);

    return (
        <section id="kualitas-udara" className="card-panel">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
                <h2 className="section-title !mb-0 border-none"><span>💨</span> Kualitas Udara (ISPU)</h2>
                <form onSubmit={handleSearchIspu} className="flex gap-3 w-full lg:w-auto">
                    <input
                        type="text"
                        value={searchIspu}
                        onChange={(e) => setSearchIspu(e.target.value)}
                        placeholder="Cari Kota/Kabupaten..."
                        className="input-field py-3"
                    />
                    <button type="submit" className="btn-secondary py-3">Cari</button>
                    <button type="button" onClick={handleMyLocation} className="btn-outline py-3" title="Gunakan Lokasi GPS">📍 GPS</button>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {ispuList.length === 0 ? (
                    <div className="col-span-full p-6 text-center text-lg text-rose-500 bg-rose-50 rounded-2xl font-bold border border-rose-200">
                        {isSearching ? '⏳ Mengambil data satelit...' : 'Data udara tidak ditemukan.'}
                    </div>
                ) : (
                    ispuList.map((item, idx) => (
                        <div key={idx} className="p-6 border-2 rounded-2xl bg-orange-50/40 border-orange-100 flex flex-col justify-between hover:border-orange-300 transition-colors">
                            <div>
                                <h3 className="font-bold text-slate-800 text-lg">{item.nama_stasiun}</h3>
                                <p className="text-sm text-slate-500 mt-1">{item.lokasi_wilayah}</p>
                            </div>
                            <div className="mt-5 flex justify-between items-end border-t border-orange-200/60 pt-4">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Skor ISPU</p>
                                    <span className="text-4xl font-black text-slate-800">{item.ispu_index}</span>
                                </div>
                                <span className={getIspuColor(item.kategori_udara)}>{item.kategori_udara}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* REKOMENDASI KESEHATAN */}
            <div className="mt-8 bg-[#0B0F19] rounded-3xl overflow-hidden shadow-lg border border-slate-800">
                <div className="flex flex-col lg:flex-row">
                    <div className="p-8 lg:p-10 lg:w-1/2 flex flex-col justify-center">
                        <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-4 leading-tight">
                            Rekomendasi Kesehatan untuk Wilayah Anda
                        </h3>
                        <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-8">
                            Polusi udara dan kabut asap memengaruhi setiap orang secara berbeda. Anak-anak, lansia, dan orang dengan asma atau kondisi jantung mungkin lebih sensitif terhadap tingkat polusi yang meningkat.
                        </p>
                        <div className="bg-slate-800/80 rounded-2xl overflow-hidden flex flex-col sm:flex-row items-center border border-slate-700">
                            <div className={`p-4 sm:p-6 flex flex-col items-center justify-center min-w-[120px] sm:min-w-[140px] text-center shrink-0 ${
                                currentWorstAir.kategori === 'Baik' ? 'bg-green-500' :
                                    currentWorstAir.kategori === 'Sedang' ? 'bg-blue-500' :
                                        currentWorstAir.kategori === 'Tidak Sehat' ? 'bg-yellow-500' :
                                            currentWorstAir.kategori === 'Sangat Tidak Sehat' ? 'bg-red-500' :
                                                currentWorstAir.kategori === 'Berbahaya (Hitam)' ? 'bg-slate-950 border-r border-slate-700' : 'bg-slate-600'
                            }`}>
                                <span className="text-white font-black text-xl mb-1">{currentWorstAir.index}</span>
                                <span className="text-white font-bold text-xs uppercase tracking-wider">{currentWorstAir.kategori}</span>
                            </div>
                            <div className="p-4 sm:p-6">
                                <p className="text-white font-bold text-sm">Saat kualitas udara "{currentWorstAir.kategori}"</p>
                                <p className="text-slate-400 text-xs mt-1">Panduan perlindungan aktif diterapkan.</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 lg:p-10 lg:w-1/2 bg-white/5 flex items-center justify-center">
                        <div className="bg-white w-full rounded-2xl p-6 md:p-8 shadow-md">
                            <h4 className="font-extrabold text-slate-800 text-lg mb-6 border-b border-slate-100 pb-4">
                                Tindakan Pencegahan
                            </h4>
                            <div className="space-y-5">
                                {recommendations.map((rec, idx) => (
                                    <div key={idx} className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-xl shrink-0 border border-red-100">
                                            {rec.icon}
                                        </div>
                                        <div className="flex-1 pt-1">
                                            <p className="text-slate-700 text-sm font-semibold leading-relaxed">{rec.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* TABEL TOP 10 */}
            <div className="mt-10 pt-8 border-t border-slate-200">
                <h3 className="text-lg font-bold text-slate-700 mb-5 flex items-center gap-2">
                    <span>🔥</span> Top 10 Wilayah Udara Paling Berbahaya
                </h3>
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                            <thead>
                            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                                <th className="p-4 font-bold border-b border-slate-200 w-20 text-center">No</th>
                                <th className="p-4 font-bold border-b border-slate-200">Kota / Wilayah</th>
                                <th className="p-4 font-bold border-b border-slate-200 w-32">Skor ISPU</th>
                                <th className="p-4 font-bold border-b border-slate-200">Kategori</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                            {topIspuList.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="p-6 text-center text-sm text-slate-500">Memuat klasemen udara...</td>
                                </tr>
                            ) : (
                                topIspuList.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4 text-center font-black text-slate-400">#{idx + 1}</td>
                                        <td className="p-4 font-bold text-slate-800">{item.nama_stasiun}</td>
                                        <td className="p-4 font-black text-slate-700">{item.ispu_index}</td>
                                        <td className="p-4">
                                            <span className={getIspuColor(item.kategori_udara)}>{item.kategori_udara}</span>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    );
}