import { getStatusBadge } from '../utils/helpers';

export default function SatgasDashboard({ reportsList, handleUpdateStatus, handleDeleteReport }) {
    return (
        <div className="space-y-8">
            <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-lg flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-2xl font-black">Dashboard Satgas Darurat</h2>
                    <p className="text-slate-400 mt-1 text-base">Atur status penanganan dan kerahkan regu pemadam.</p>
                </div>
                <span className="text-sm bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-4 py-2 rounded-xl font-mono font-bold">Verifikasi Aktif</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="card-panel !p-6 border-slate-200">
                    <p className="text-sm font-bold text-slate-400 uppercase">Total Masuk</p>
                    <p className="text-4xl font-black text-slate-800 mt-2">{reportsList.length}</p>
                </div>
                <div className="card-panel !p-6 border-amber-200 bg-amber-50/30">
                    <p className="text-sm font-bold text-amber-600 uppercase">Menunggu</p>
                    <p className="text-4xl font-black text-amber-700 mt-2">{reportsList.filter(r => r.status_penanganan === 'Menunggu Verifikasi').length}</p>
                </div>
                <div className="card-panel !p-6 border-orange-200 bg-orange-50/30">
                    <p className="text-sm font-bold text-orange-600 uppercase">Proses</p>
                    <p className="text-4xl font-black text-orange-700 mt-2">{reportsList.filter(r => r.status_penanganan === 'Proses Pemadaman').length}</p>
                </div>
                <div className="card-panel !p-6 border-emerald-200 bg-emerald-50/30">
                    <p className="text-sm font-bold text-emerald-600 uppercase">Selesai</p>
                    <p className="text-4xl font-black text-emerald-700 mt-2">{reportsList.filter(r => r.status_penanganan === 'Padam').length}</p>
                </div>
            </div>

            <section className="card-panel">
                <h2 className="section-title"><span>⚡</span> Tindak Lanjut Laporan</h2>
                <div className="space-y-4">
                    {reportsList.length === 0 ? (
                        <p className="text-slate-500 text-center py-8 text-lg font-bold">Semua laporan telah ditangani.</p>
                    ) : (
                        reportsList.map((r) => (
                            <div key={r.report_id} className="p-5 border-2 rounded-2xl bg-white hover:bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-5 transition-colors">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-black bg-slate-200 text-slate-700 px-3 py-1 rounded-lg">ID #{r.report_id}</span>
                                        <span className={getStatusBadge(r.status_penanganan)}>{r.status_penanganan}</span>
                                    </div>
                                    <p className="font-bold text-slate-800 text-lg leading-snug">{r.lokasi_deskripsi}</p>
                                    <p className="text-sm text-slate-500">
                                        Dari: <span className="font-bold text-slate-700">{r.nama_pelapor}</span> | Asap: <span className="font-black text-red-600">{r.kepekatan_asap}</span>
                                    </p>
                                </div>
                                <div className="flex items-center gap-3 w-full md:w-auto">
                                    <select
                                        value={r.status_penanganan}
                                        onChange={(e) => handleUpdateStatus(r.report_id, e.target.value)}
                                        className="w-full md:w-auto text-sm font-bold p-3 border-2 border-slate-200 rounded-xl bg-white text-slate-800 focus:ring-4 focus:ring-slate-200 outline-none cursor-pointer"
                                    >
                                        <option value="Menunggu Verifikasi">⏳ Menunggu</option>
                                        <option value="Diverifikasi">🔍 Diverifikasi</option>
                                        <option value="Proses Pemadaman">🔥 Proses Pemadaman</option>
                                        <option value="Padam">✅ Padam</option>
                                        <option value="Laporan Palsu">❌ Laporan Palsu</option>
                                    </select>
                                    <button onClick={() => handleDeleteReport(r.report_id)} className="text-sm font-bold bg-rose-100 text-rose-700 px-4 py-3 rounded-xl hover:bg-rose-200 transition">Hapus</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
}