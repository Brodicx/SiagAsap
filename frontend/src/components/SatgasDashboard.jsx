import { useState } from 'react';
import { FileSpreadsheet, Phone } from 'lucide-react';
import { getStatusBadge } from '../utils/helpers';
import { StateMessage } from './ui';

const STATUS_SUMMARY = [
    { key: 'Menunggu Verifikasi', label: 'Menunggu verifikasi' },
    { key: 'Diverifikasi', label: 'Sudah diverifikasi' },
    { key: 'Proses Pemadaman', label: 'Dalam pemadaman' },
    { key: 'Padam', label: 'Sudah padam' },
];

export default function SatgasDashboard({
    reportsList,
    handleUpdateStatus,
    handleDeleteReport,
    isLoading,
    loadError,
    onRetry,
}) {
    const [isExporting, setIsExporting] = useState(false);
    const [exportError, setExportError] = useState('');
    const statusCounts = STATUS_SUMMARY.map(({ key, label }) => ({
        key,
        label,
        count: reportsList.filter((report) => report.status_penanganan === key).length,
    }));

    const handleExport = async () => {
        setIsExporting(true);
        setExportError('');
        try {
            const { default: ExcelJS } = await import('exceljs');
            const workbook = new ExcelJS.Workbook();
            workbook.creator = 'SiagAsap';
            const worksheet = workbook.addWorksheet('Laporan');
            worksheet.columns = [
                { header: 'ID Laporan', key: 'id', width: 14 },
                { header: 'Nama Pelapor', key: 'name', width: 26 },
                { header: 'WhatsApp', key: 'whatsapp', width: 20 },
                { header: 'Lokasi', key: 'location', width: 42 },
                { header: 'Kepekatan Asap', key: 'smoke', width: 20 },
                { header: 'Status Penanganan', key: 'status', width: 25 },
                { header: 'Tanggal Lapor', key: 'reportedAt', width: 22, style: { numFmt: 'dd/mm/yyyy hh:mm' } },
            ];

            worksheet.addRows(reportsList.map((report) => {
                const reportedAt = report.tgl_lapor ? new Date(report.tgl_lapor) : null;
                return {
                    id: report.report_id,
                    name: report.nama_pelapor || '',
                    whatsapp: report.whatsapp || '',
                    location: report.lokasi_deskripsi || '',
                    smoke: report.kepekatan_asap || '',
                    status: report.status_penanganan || '',
                    reportedAt: reportedAt && !Number.isNaN(reportedAt.getTime()) ? reportedAt : report.tgl_lapor || '',
                };
            }));

            const header = worksheet.getRow(1);
            header.height = 24;
            header.eachCell((cell) => {
                cell.font = { name: 'Plus Jakarta Sans', bold: true, color: { argb: 'FFFFFFFF' } };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD71920' } };
                cell.alignment = { vertical: 'middle' };
            });
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber > 1) {
                    row.eachCell({ includeEmpty: true }, (cell) => {
                        cell.font = { name: 'Plus Jakarta Sans', size: 11, color: { argb: 'FF17212F' } };
                    });
                }
            });
            worksheet.autoFilter = 'A1:G1';
            worksheet.views = [{ state: 'frozen', ySplit: 1 }];

            const buffer = await workbook.xlsx.writeBuffer();
            const url = URL.createObjectURL(new Blob([buffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            }));
            const link = document.createElement('a');
            link.href = url;
            link.download = `laporan-siagasap-${new Date().toISOString().slice(0, 10)}.xlsx`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.setTimeout(() => URL.revokeObjectURL(url), 1000);
        } catch (error) {
            console.error('Gagal mengunduh laporan Excel:', error);
            setExportError('File Excel belum dapat dibuat. Silakan coba lagi.');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="space-y-8">
            <header className="flex flex-col gap-4 rounded-panel bg-slate-900 p-6 text-white md:flex-row md:items-center md:justify-between md:p-8">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-slate-300">Ruang kerja petugas</p>
                    <h1 className="mt-1 text-2xl font-black">Tindak lanjuti laporan warga</h1>
                    <p className="mt-1 text-base text-slate-300">Mulai dari laporan yang menunggu verifikasi, lalu perbarui statusnya.</p>
                </div>
                <span className="w-fit rounded-control border border-emerald-400/40 bg-emerald-400/10 px-3 py-2 text-sm font-bold text-emerald-300">
                    Verifikasi aktif
                </span>
            </header>

            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
                <section className="card-panel">
                    <div className="flex flex-wrap items-baseline justify-between gap-3">
                        <div>
                            <h2 className="section-title mb-1">Antrean laporan</h2>
                            <p className="text-sm text-muted">Pilih status baru setelah laporan diperiksa.</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            {!isLoading && !loadError && <p className="text-sm font-semibold text-muted">{reportsList.length} laporan</p>}
                            <button
                                type="button"
                                onClick={handleExport}
                                disabled={isLoading || loadError || reportsList.length === 0 || isExporting}
                                className="btn-line active:bg-slate-200"
                            >
                                <FileSpreadsheet size={18} aria-hidden="true" />
                                {isExporting ? 'Menyiapkan Excel' : 'Unduh Excel'}
                            </button>
                        </div>
                    </div>
                    {exportError && <p role="alert" className="mt-3 text-sm font-medium text-danger">{exportError}</p>}

                    <div className="mt-5 space-y-3">
                        {isLoading ? (
                            <StateMessage kind="loading" title="Memuat laporan masuk">
                                Menyiapkan antrean laporan untuk petugas.
                            </StateMessage>
                        ) : loadError ? (
                            <StateMessage
                                kind="error"
                                title="Laporan belum dapat dimuat"
                                action={<button onClick={onRetry} className="btn-line">Coba lagi</button>}
                            >
                                Periksa koneksi Anda, lalu coba muat ulang data.
                            </StateMessage>
                        ) : reportsList.length === 0 ? (
                            <StateMessage kind="empty" title="Belum ada laporan masuk">
                                Laporan baru akan muncul di sini setelah warga mengirimkannya.
                            </StateMessage>
                        ) : (
                            reportsList.map((report) => (
                                <article key={report.report_id} className="flex flex-col gap-4 rounded-control border border-line bg-surface p-4 transition-colors hover:bg-canvas md:flex-row md:items-center md:justify-between">
                                    <div className="min-w-0 space-y-2">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="rounded-control bg-slate-100 px-2.5 py-1 text-sm font-bold text-slate-700">ID #{report.report_id}</span>
                                            <span className={getStatusBadge(report.status_penanganan)}>{report.status_penanganan}</span>
                                        </div>
                                        <p className="text-lg font-bold leading-snug text-slate-800">{report.lokasi_deskripsi}</p>
                                        <p className="text-sm text-slate-500">
                                            Dari: <span className="font-bold text-slate-700">{report.nama_pelapor}</span>
                                            <span aria-hidden="true"> | </span>
                                            Asap: <span className="font-black text-red-600">{report.kepekatan_asap}</span>
                                        </p>
                                        {report.whatsapp ? (
                                            <a href={`tel:${String(report.whatsapp).replace(/[^\d+]/g, '')}`} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-ink underline decoration-line underline-offset-4 hover:text-brand active:text-brand-dark">
                                                <Phone size={16} aria-hidden="true" />
                                                Hubungi {report.whatsapp}
                                            </a>
                                        ) : (
                                            <p className="text-sm text-muted">Kontak pelapor belum tersedia.</p>
                                        )}
                                    </div>
                                    <div className="flex w-full shrink-0 items-center gap-3 md:w-auto">
                                        <label htmlFor={`status-${report.report_id}`} className="sr-only">Status laporan {report.report_id}</label>
                                        <select
                                            id={`status-${report.report_id}`}
                                            value={report.status_penanganan}
                                            onChange={(event) => handleUpdateStatus(report.report_id, event.target.value)}
                                            className="field w-full text-sm font-bold md:w-auto"
                                        >
                                            <option value="Menunggu Verifikasi">Menunggu</option>
                                            <option value="Diverifikasi">Diverifikasi</option>
                                            <option value="Proses Pemadaman">Proses Pemadaman</option>
                                            <option value="Padam">Padam</option>
                                            <option value="Laporan Palsu">Laporan Palsu</option>
                                        </select>
                                        <button onClick={() => handleDeleteReport(report.report_id)} className="btn-line text-sm font-bold text-rose-700 hover:bg-rose-50">
                                            Hapus
                                        </button>
                                    </div>
                                </article>
                            ))
                        )}
                    </div>
                </section>

                <aside className="card-panel" aria-labelledby="ringkasan-laporan">
                    <h2 id="ringkasan-laporan" className="section-title mb-1">Ringkasan kerja</h2>
                    <p className="text-sm text-muted">Jumlah laporan berdasarkan status penanganan.</p>
                    {isLoading || loadError ? (
                        <p className="mt-5 border-t border-line pt-4 text-sm text-muted">Ringkasan tersedia setelah data berhasil dimuat.</p>
                    ) : (
                        <dl className="mt-5 divide-y divide-line border-y border-line">
                            {statusCounts.map(({ key, label, count }) => (
                                <div key={key} className="flex items-center justify-between gap-3 py-3">
                                    <dt className="text-sm font-medium text-muted">{label}</dt>
                                    <dd className="text-xl font-black tabular-nums text-ink">{count}</dd>
                                </div>
                            ))}
                        </dl>
                    )}
                </aside>
            </div>
        </div>
    );
}
