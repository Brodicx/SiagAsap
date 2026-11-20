# Ringkasan Pembaruan SiagAsap

Dokumen ini merangkum perubahan fitur dan pemeriksaan yang dilakukan pada SiagAsap hingga 20 November 2026.

## Fitur yang diperbarui

### Rumah sakit dan posko medis

- Bagian yang sebelumnya berfokus pada posko kini menampilkan rumah sakit serta posko yang dimasukkan secara manual.
- Saat pengguna mencari kota atau memakai lokasi GPS, backend mencari rumah sakit yang terpetakan dalam radius sekitar 20 km dari koordinat wilayah melalui OpenStreetMap.
- Hasil rumah sakit mencakup nama, alamat atau keterangan alamat, nomor telepon bila tersedia, tautan ke objek OpenStreetMap, dan petunjuk arah.
- Rumah sakit dan posko diurutkan berdasarkan jarak dari lokasi pilihan pengguna. Posko manual tetap berasal dari database SiagAsap.
- Backend memakai pencarian rumah sakit Nominatim setelah pengguna mencari kota atau memakai lokasi GPS. URL layanan dapat diganti melalui `NOMINATIM_URL`; respons disimpan di cache selama 15 menit dan antrean membatasi permintaan hingga satu per detik. Antarmuka menyediakan status memuat, kosong, gagal, dan tombol untuk mencoba kembali.
- Atribusi OpenStreetMap ditampilkan pada bagian fasilitas kesehatan dan setiap rumah sakit memiliki tautan ke datanya.

Sumber OpenStreetMap bukan direktori resmi dan kelengkapan datanya bergantung pada pemetaan kontributor. Nominatim mengembalikan hasil pencarian terbaik, bukan direktori lengkap; hasilnya tidak menjamin semua rumah sakit dalam radius tersebut. Pencarian hanya dilakukan di sekitar koordinat wilayah yang dipilih, bukan menampilkan seluruh rumah sakit Indonesia sekaligus. Gunakan hasilnya sebagai referensi dan verifikasi informasi penting sebelum keadaan darurat.

### Pelaporan titik api

- Form laporan menyediakan nomor WhatsApp pelapor.
- Nomor tersebut ikut dikirim bersama laporan dan ditampilkan pada dasbor admin sebagai tautan telepon untuk menghubungi pelapor.

### Kualitas udara dan saran kesehatan

- Bagian kualitas udara menjelaskan bahwa jumlah wilayah yang dipantau dapat lebih banyak daripada entri pada daftar 10 teratas.
- Saran kesehatan dilengkapi visual sesuai jenis saran, seperti aktivitas, kondisi rumah, masker, dan bantuan medis.

### Berita terkini

- Kartu berita menampilkan foto artikel apabila sumber berita menyediakan gambar.
- Jika sumber tidak menyediakan gambar, kartu tetap dapat ditampilkan tanpa foto.

### Transisi antarmuka

- Transisi kemunculan teks dan elemen halaman ditambahkan untuk memberi umpan balik saat bagian antarmuka tampil.
- Gerakan non-esensial mengikuti pengaturan `prefers-reduced-motion` pengguna.

## Perubahan backend dan konfigurasi lokal

- Konfigurasi aplikasi memisahkan port HTTP backend (`PORT`, biasanya `3000`) dari port database (`DB_PORT`, biasanya `3306`).
- Endpoint `GET /api/hospitals?lat=<latitude>&lng=<longitude>` memvalidasi koordinat, mengambil data OpenStreetMap, lalu mengirim daftar rumah sakit ke frontend.
- Skema dan panduan database lokal ditambahkan atau diperbarui. Tabel tetap kosong sampai data posko dimasukkan oleh pengelola.
- File `.env` digunakan untuk konfigurasi lokal dan tidak boleh dibagikan atau dimasukkan ke repositori. Gunakan `backend/.env.example` sebagai contoh nama variabel, lalu isi nilai yang sesuai dengan server lokal.

## Hasil pemeriksaan

- `npm run build` frontend berhasil setelah fitur rumah sakit awal ditambahkan. Build ulang setelah perbaikan pencarian tidak selesai karena Windows kehabisan memori.
- Tes backend untuk pemetaan hasil Nominatim, batas radius pencarian, validasi koordinat, cache, batas laju permintaan, dan penanganan kegagalan berhasil.
- Pemeriksaan sintaks backend dan lint pada komponen frontend yang diubah berhasil.
- Lint pada `frontend/src/App.jsx` masih melaporkan aturan `react-hooks/set-state-in-effect` di pemanggilan awal `fetchData` dalam `useEffect`. Ini terkait pola pemuatan awal yang sudah ada dan bukan bukti kegagalan build.
- Uji langsung controller backend ke Nominatim berhasil untuk koordinat Bandung dan mengembalikan 40 rumah sakit dalam radius saat diuji. Data yang tersedia dapat berubah dan hasil Nominatim bukan direktori lengkap.

## Catatan menjalankan aplikasi

- Backend melayani API di port `3000`; frontend dijalankan dari folder `frontend` dengan `npm run dev`.
- MySQL atau MariaDB harus aktif di port yang diatur pada `DB_PORT`. `ECONNREFUSED` menunjukkan tidak ada server database yang menerima koneksi di alamat dan port tersebut. `Access denied` menunjukkan server terjangkau, tetapi kredensial database ditolak.
- MySQL XAMPP dan service MariaDB terpisah tidak dapat sama-sama menggunakan port `3306` pada alamat yang sama. Pilih satu server database dan pastikan `DB_*` di `backend/.env` cocok dengan server tersebut.
- Pada pemeriksaan terakhir, `npm run dev` frontend dan build berikutnya gagal karena Windows kehabisan memori virtual. Tutup aplikasi berat atau mulai ulang komputer sebelum mencoba lagi; gejala ini tidak dengan sendirinya menunjukkan kerusakan kode frontend.
