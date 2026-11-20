import { LocateFixed, Loader2, CircleCheck, CircleAlert, Send } from 'lucide-react';

export default function ReportSection({
    nama, setNama, whatsapp, setWhatsapp, lokasi, setLokasi, kepekatan, setKepekatan, reportLat, reportLng,
    handleGetReportLocation, isFetchingLocation, handleSubmitReport, isSubmitting, reportStatus,
}) {
    const hasGps = reportLat != null && reportLng != null;
    return (
        <section id="lapor" aria-labelledby="h-lapor" className="panel scroll-mt-24 border-t-4 border-t-brand p-5 md:p-6">
            <h1 id="h-lapor" className="text-2xl font-semibold">Lapor titik api</h1>
            <p className="mt-1 text-[15px] text-muted">Laporan diteruskan ke petugas untuk diverifikasi. Semua kolom wajib diisi.</p>

            <form onSubmit={handleSubmitReport} className="mt-5 space-y-4" noValidate={false}>
                <div>
                    <label htmlFor="lap-nama" className="field-label">Nama pelapor</label>
                    <input id="lap-nama" type="text" required value={nama} onChange={(e) => setNama(e.target.value)} className="field" autoComplete="name" />
                </div>
                <div>
                    <label htmlFor="lap-whatsapp" className="field-label">Nomor WhatsApp atau telepon</label>
                    <input
                        id="lap-whatsapp"
                        type="tel"
                        required
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        className="field"
                        autoComplete="tel"
                        inputMode="tel"
                        maxLength={24}
                        pattern={'(?=(?:\\D*\\d){8,})\\+?(?:\\d| |\\.|\\(|\\)|-){7,23}'}
                        aria-describedby="lap-whatsapp-hint"
                    />
                    <p id="lap-whatsapp-hint" className="field-hint">Petugas menggunakan nomor ini untuk mengonfirmasi laporan. Masukkan minimal 8 angka; spasi dan tanda hubung boleh.</p>
                </div>
                <div>
                    <label htmlFor="lap-asap" className="field-label">Kondisi asap</label>
                    <select id="lap-asap" value={kepekatan} onChange={(e) => setKepekatan(e.target.value)} className="field">
                        <option value="Ringan">Mulai berasap (ringan)</option>
                        <option value="Sedang">Jarak pandang terganggu (sedang)</option>
                        <option value="Pekat">Gelap dan sesak (pekat)</option>
                        <option value="Sangat Pekat">Kebakaran hebat (sangat pekat)</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="lap-lokasi" className="field-label">Lokasi kejadian</label>
                    <input id="lap-lokasi" type="text" required value={lokasi} onChange={(e) => setLokasi(e.target.value)} className="field" placeholder="Alamat atau patokan, mis. dekat SPBU Jl. Rajawali" aria-describedby="lap-lokasi-hint" />
                    <button type="button" onClick={handleGetReportLocation} className="btn-line mt-2" disabled={isFetchingLocation}>
                        {isFetchingLocation ? <Loader2 size={18} className="animate-spin" aria-hidden="true" /> : <LocateFixed size={18} aria-hidden="true" />}
                        {isFetchingLocation ? 'Mencari titik GPS' : 'Gunakan titik GPS saya'}
                    </button>
                    <p id="lap-lokasi-hint" className="field-hint" aria-live="polite">
                        {hasGps
                            ? <span className="inline-flex items-center gap-1.5 font-medium text-ok"><CircleCheck size={16} aria-hidden="true" />Titik GPS tersimpan: {reportLat.toFixed(5)}, {reportLng.toFixed(5)}</span>
                            : 'Tanpa titik GPS, petugas hanya menerima deskripsi lokasi di atas.'}
                    </p>
                </div>

                <button type="submit" className="btn-brand w-full" disabled={isSubmitting || !nama.trim() || !lokasi.trim()}>
                    {isSubmitting ? <Loader2 size={18} className="animate-spin" aria-hidden="true" /> : <Send size={18} aria-hidden="true" />}
                    {isSubmitting ? 'Mengirim laporan' : 'Kirim laporan'}
                </button>

                <div aria-live="polite">
                    {reportStatus && (
                        <p role={reportStatus.type === 'error' ? 'alert' : 'status'} className={`flex items-start gap-2 rounded-control p-3 text-sm font-medium ${reportStatus.type === 'error' ? 'bg-[#FBE0E0] text-[#8A1212]' : 'bg-[#E3F4EA] text-[#14532D]'}`}>
                            {reportStatus.type === 'error' ? <CircleAlert size={18} className="mt-0.5 shrink-0" aria-hidden="true" /> : <CircleCheck size={18} className="mt-0.5 shrink-0" aria-hidden="true" />}
                            {reportStatus.message}
                        </p>
                    )}
                </div>
            </form>
        </section>
    );
}
