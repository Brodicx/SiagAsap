# SiagAsap visual direction

## Design Read

SiagAsap adalah aplikasi layanan publik untuk warga dan petugas lapangan. Visualnya perlu terasa tegas, hangat, dan cepat dipindai oleh pengguna muda tanpa mengubahnya menjadi dashboard teknologi generik.

Dial: ENERGY 2 / RHYTHM 2 / MOTION 2

## Identity

- **Visual language:** editorial utility. Informasi penting diberi ruang, label singkat, dan hirarki yang jelas. Komposisi boleh memiliki satu perubahan ritme per layar, tetapi tidak memakai dekorasi yang tidak membantu tindakan.
- **Focal point:** kondisi udara pada halaman warga dan antrean laporan pada halaman petugas. Konten yang membantu keputusan selalu lebih dominan daripada ringkasan.
- **Identity motif:** garis pembatas tipis dan aksen merah pada momen peringatan atau tindakan penting. Motif ini menghubungkan konteks kebakaran dengan fungsi aplikasi tanpa memakai glow atau gradient sebagai hiasan.
- **Visual saran kesehatan:** ikon garis yang menggambarkan tindakan nyata dalam bidang `#FFF5D9`, dengan teks tetap menjadi fokus. Ikon `#A15300` adalah varian gelap dari aksen oranye agar tetap jelas di atas bidang terang (kontras 5.15:1).

## Palette

- **Brand red `#D71920`:** menandai tindakan penting seperti mengirim laporan dan konteks bahaya.
- **Ink navy `#17212F`:** memberi kontras kuat untuk judul, navigasi, dan area kerja petugas.
- **Neutral canvas and surface:** menjaga kepadatan informasi tetap ringan dan mudah dipindai.
- **Alert orange `#F28C28`:** dipakai hanya untuk kategori asap atau status yang membutuhkan perhatian, bukan sebagai warna dekoratif umum.

## Type and shape

- **Plus Jakarta Sans:** dipakai karena bentuk hurufnya tetap ramah pada layar kecil dan memiliki variasi bobot untuk membedakan status, label, dan instruksi.
- **Radius:** panel memakai radius sedang, kontrol memakai radius kecil, dan baris data tidak dibuat seperti kapsul. Perbedaan ini menjaga hierarki antara permukaan, kontrol, dan status.
- **Shadow:** bukan gaya default. Elevasi dipakai hanya ketika permukaan perlu dipisahkan dari konteks di belakangnya.

## Interaction

Judul utama, pengantar, dan tindakan awal muncul berurutan dengan fade dan pergeseran singkat untuk mengarahkan perhatian saat pengguna masuk. Animasi berjalan sekali, selesai kurang dari satu detik, dan dinonaktifkan untuk `prefers-reduced-motion`. Tidak ada loop dekoratif. Semua kontrol harus tetap dapat dipakai dengan keyboard dan layar kecil.
