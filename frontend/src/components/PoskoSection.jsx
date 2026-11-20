import { Phone, Navigation, MapPin, ExternalLink } from 'lucide-react';
import { StateMessage } from './ui';

const hasCoords = (p) => p.latitude != null && p.longitude != null && !Number.isNaN(Number(p.latitude)) && !Number.isNaN(Number(p.longitude));

export default function PoskoSection({
    sortedFacilities, showAllFacilities, setShowAllFacilities, userCoords, headerLocation,
    isLoading, isHospitalLoading, hospitalError, onRetryHospitals
}) {
    const shown = showAllFacilities ? sortedFacilities : sortedFacilities.slice(0, 4);
    const rest = sortedFacilities.length - 4;
    return (
        <section id="posko" aria-labelledby="h-posko" className="panel scroll-mt-24">
            <div className="p-5 pb-3 md:p-6 md:pb-3">
                <h2 id="h-posko" className="text-2xl font-semibold">Rumah sakit dan posko medis</h2>
                <p className="mt-1 flex items-center gap-1.5 text-[15px] text-muted">
                    <MapPin size={16} aria-hidden="true" />
                    {userCoords ? `Diurutkan dari yang terdekat ke ${headerLocation === 'LOKASI ANDA (GPS)' ? 'lokasi Anda' : titleOf(headerLocation)}.` : 'Cari kota atau gunakan lokasi Anda untuk melihat rumah sakit dan posko di sekitarnya.'}
                </p>
            </div>

            {isHospitalLoading && <StateMessage kind="loading" title="Memuat rumah sakit di wilayah ini" />}
            {hospitalError && <StateMessage
                kind="error"
                title="Data rumah sakit belum dapat dimuat"
                action={userCoords && <button onClick={onRetryHospitals} className="btn-line">Coba lagi</button>}
            >{hospitalError} Posko yang sudah dimasukkan tetap ditampilkan jika tersedia.</StateMessage>}

            {isLoading ? <StateMessage kind="loading" title="Memuat data fasilitas kesehatan" />
                : sortedFacilities.length === 0
                    ? isHospitalLoading || hospitalError ? null
                        : <StateMessage kind="empty" title={userCoords ? 'Belum ada fasilitas yang terdaftar untuk wilayah ini' : 'Belum ada posko yang ditambahkan'}>{userCoords ? 'Data rumah sakit bersumber dari OpenStreetMap dan mungkin belum mencakup semua fasilitas. Posko yang dikelola aplikasi juga akan tampil di sini.' : 'Cari kota atau gunakan lokasi Anda untuk mencari rumah sakit dan posko di sekitar wilayah tersebut.'}</StateMessage>
                    : (
                        <ul className="divide-y divide-line border-t border-line">
                            {shown.map((p, i) => {
                                const isHospital = p.type === 'hospital';
                                const stokDiketahui = p.jumlah_stok != null && p.jumlah_stok !== '';
                                return (
                                    <li key={isHospital ? p.hospital_id : (p.posko_id ?? i)} className="flex flex-col gap-3 px-5 py-4 md:flex-row md:items-center md:justify-between md:px-6">
                                        <div className="min-w-0">
                                            <p className="text-base font-semibold leading-snug">{isHospital ? p.nama : p.nama_posko}
                                                {p.distance != null && <span className="ml-2 text-sm font-medium text-muted tabular-nums">{p.distance} km</span>}
                                            </p>
                                            <p className="text-[15px] text-muted">{isHospital ? p.alamat : p.lokasi}</p>
                                            {isHospital
                                                ? <a href={`https://www.openstreetmap.org/${p.osm_type}/${p.osm_id}`} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex min-h-11 items-center gap-1 text-sm font-medium underline underline-offset-2">Data OpenStreetMap <ExternalLink size={14} aria-hidden="true" /></a>
                                                : <p className="mt-1 text-[15px]">
                                                    {p.nama_barang
                                                        ? <>{p.nama_barang}: <span className="font-semibold tabular-nums">{stokDiketahui ? `${p.jumlah_stok} ${p.satuan ?? ''}` : 'jumlah belum diinformasikan'}</span></>
                                                        : <span className="text-muted">Informasi logistik belum tersedia</span>}
                                                </p>}
                                        </div>
                                        <div className="flex gap-2 shrink-0">
                                            {p.kontak && <a href={`tel:${String(p.kontak).replace(/[^\d+]/g, '')}`} className="btn-line"><Phone size={16} aria-hidden="true" />Telepon</a>}
                                            {hasCoords(p) && <a href={`https://www.google.com/maps/dir/?api=1&destination=${p.latitude},${p.longitude}`} target="_blank" rel="noopener noreferrer" className="btn-line"><Navigation size={16} aria-hidden="true" />Petunjuk arah</a>}
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-3 md:px-6">
                <p className="text-sm text-muted">
                    Rumah sakit dicari dari titik wilayah terpilih dalam radius sekitar 20 km; data OpenStreetMap dapat belum lengkap.
                    {' '}<a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">© kontributor OpenStreetMap</a>
                    {' '}· Stok posko dapat berubah karena waktu pembaruan belum tersedia.
                </p>
                {rest > 0 && <button onClick={() => setShowAllFacilities(!showAllFacilities)} className="btn-line" aria-expanded={showAllFacilities}>{showAllFacilities ? 'Tampilkan lebih sedikit' : `Tampilkan ${rest} fasilitas lainnya`}</button>}
            </div>
        </section>
    );
}

const titleOf = (s = '') => s.charAt(0) + s.slice(1).toLowerCase();
