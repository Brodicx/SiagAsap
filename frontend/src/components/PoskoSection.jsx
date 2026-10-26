export default function PoskoSection({ sortedPosko, showAllPosko, setShowAllPosko, userCoords, headerLocation }) {
    const displayedPosko = showAllPosko ? sortedPosko : sortedPosko.slice(0, 3);

    return (
        <section id="posko" className="card-panel">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-3">
                <h2 className="section-title !mb-0 border-none"><span>🏥</span> Posko Medis & Oksigen</h2>
                {userCoords && (
                    <span className="text-sm bg-emerald-100 text-emerald-800 font-bold px-4 py-2 rounded-full border border-emerald-200">
                        📍 Terdekat dari {headerLocation === 'LOKASI ANDA (GPS)' ? 'Lokasi Anda' : headerLocation}
                    </span>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {displayedPosko.map((p, idx) => (
                    <div key={idx} className="p-6 border-2 rounded-2xl bg-blue-50/40 border-blue-100 relative hover:border-blue-300 transition-colors">
                        <div className="flex justify-between items-start gap-4">
                            <h3 className="font-bold text-slate-800 text-lg leading-snug">{p.nama_posko}</h3>
                            {p.distance && (
                                <span className="text-sm font-black bg-blue-600 text-white px-3 py-1.5 rounded-xl shrink-0">
                                    {p.distance} km
                                </span>
                            )}
                        </div>
                        <p className="text-base text-slate-600 mt-2">{p.lokasi}</p>
                        <div className="mt-4 pt-4 border-t border-blue-200 flex justify-between items-center">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase">Bantuan Tersedia</p>
                                <p className="font-bold text-slate-700 text-base mt-0.5">{p.nama_barang}</p>
                            </div>
                            <span className="text-blue-800 font-black bg-blue-200 px-3 py-1.5 rounded-lg border border-blue-300 text-sm">
                                {p.jumlah_stok} {p.satuan}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {sortedPosko.length > 3 && (
                <div className="mt-6 flex justify-center">
                    <button
                        onClick={() => setShowAllPosko(!showAllPosko)}
                        className="px-6 py-2.5 bg-white border-2 border-blue-200 text-blue-700 font-bold rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all text-sm"
                    >
                        {showAllPosko ? 'Tutup Sebagian 🔼' : `Lihat Selengkapnya (${sortedPosko.length - 3} Posko Lainnya) 🔽`}
                    </button>
                </div>
            )}
        </section>
    );
}