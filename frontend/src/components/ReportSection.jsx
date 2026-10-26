export default function ReportSection({
                                          nama, setNama, lokasi, setLokasi, kepekatan, setKepekatan,
                                          reportLat, reportLng, handleGetReportLocation, isFetchingLocation, handleSubmitReport
                                      }) {
    return (
        <section id="lapor" className="card-panel border-red-200 shadow-red-100 shadow-xl">
            <h2 className="section-title text-red-700 border-red-100"><span>🚨</span> Lapor Titik Api & Asap</h2>
            <form onSubmit={handleSubmitReport} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="input-label">Nama Lengkap</label>
                        <input type="text" required value={nama} onChange={(e) => setNama(e.target.value)} className="input-field" placeholder="Ketik nama Anda..." />
                    </div>
                    <div>
                        <label className="input-label">Kondisi Asap</label>
                        <select value={kepekatan} onChange={(e) => setKepekatan(e.target.value)} className="input-field">
                            <option value="Ringan">Mulai Berasap (Ringan)</option>
                            <option value="Sedang">Jarak Pandang Terganggu (Sedang)</option>
                            <option value="Pekat">Gelap & Sesak (Pekat)</option>
                            <option value="Sangat Pekat">Kebakaran Hebat (Sangat Pekat)</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label className="input-label">Alamat / Patokan Lokasi</label>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <input type="text" required value={lokasi} onChange={(e) => setLokasi(e.target.value)} className="input-field flex-1" placeholder="Contoh: Dekat SPBU Jl. Rajawali" />
                        <button type="button" onClick={handleGetReportLocation} className="btn-outline sm:w-auto h-auto">
                            {isFetchingLocation ? '⏳...' : '📍 Titik GPS'}
                        </button>
                    </div>
                    {(reportLat && reportLng) && (
                        <p className="text-sm text-emerald-600 font-bold mt-2 flex items-center gap-1.5">
                            ✅ Titik GPS Tersimpan ({reportLat.toFixed(4)}, {reportLng.toFixed(4)})
                        </p>
                    )}
                </div>
                <button type="submit" className="btn-primary mt-4">Kirim Laporan Darurat</button>
            </form>
        </section>
    );
}