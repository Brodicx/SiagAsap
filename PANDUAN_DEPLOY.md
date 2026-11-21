# Panduan GitHub dan deployment SiagAsap

Dokumen ini mencatat proses push ke GitHub yang sudah dilakukan, deployment frontend ke Vercel, dan pekerjaan yang masih diperlukan untuk menghubungkan backend.

## Status terakhir

- Repository: `Brodicx/SiagAsap`
- Branch: `main`
- Commit merge yang berhasil dipush: `8bc8a0f`
- Branch lokal dan `origin/main` sudah sinkron setelah push.
- Frontend sudah dideploy ke Vercel. URL deployment tidak dicatat di sesi ini.
- Backend belum dikonfirmasi berhasil dideploy.
- Koneksi lokal backend ke PostgreSQL berhasil diuji. Tabel `users`, `reports_kebakaran`, dan `posko_kesehatan` tersedia, dan query baca backend cocok dengan skema database saat diuji.
- URL backend production belum tersedia, jadi `VITE_API_URL` belum bisa disetel di project frontend Vercel.
- `backend/.env` masih terlacak Git. Lihat bagian [Peringatan kredensial](#peringatan-kredensial) sebelum melanjutkan.

## Riwayat push yang gagal lalu berhasil

Push awal ditolak karena branch lokal dan GitHub berbeda:

- Lokal memiliki tiga commit yang tidak ada di GitHub.
- GitHub memiliki satu commit yang tidak ada secara lokal.
- Git menyatakan push ditolak sebagai `non-fast-forward`.
- `git pull --rebase origin main` tidak bisa berjalan karena ada direktori metadata rebase lama yang kosong atau rusak.
- Setelah metadata kosong itu dibersihkan, merge biasa ditolak dengan `refusing to merge unrelated histories`.

Karena memang dipilih untuk menggabungkan kedua histori, merge dijalankan:

```powershell
git merge --allow-unrelated-histories origin/main
```

Git menemukan konflik `add/add` pada file yang ada di kedua histori. Keputusan saat itu adalah mempertahankan versi lokal untuk file yang konflik, sambil tetap mengambil file yang hanya ada di GitHub. Resolusi tersebut dilakukan dengan:

```powershell
$conflicts = git diff --name-only --diff-filter=U
foreach ($file in $conflicts) {
    git checkout --ours -- $file
    git add -- $file
}
```

`--ours` berarti versi branch lokal saat merge. Jangan jalankan perintah itu secara otomatis pada merge lain, karena pilihan versi harus mengikuti isi perubahan yang ingin dipertahankan.

Merge diselesaikan dan dipush:

```powershell
git -c core.editor=true commit -m "Merge GitHub project history with local updates" `
  -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
git push origin main
```

Push berhasil. Jangan mengulang merge ini. Untuk perubahan berikutnya, mulai dengan:

```powershell
git status -sb
git pull --rebase origin main
git push origin main
```

Jika branch kembali memiliki histori yang tidak berhubungan, periksa log dan perubahan kedua sisi terlebih dahulu. Jangan memakai `git push --force` untuk mengatasi penolakan non-fast-forward.

## Deployment frontend di Vercel

Repo berisi dua aplikasi, `frontend` (React/Vite) dan `backend` (Express). Karena itu Vercel menampilkan pilihan multi-service.

Untuk frontend, langkah yang dipilih:

1. Import repository `Brodicx/SiagAsap` di Vercel.
2. Pada bagian aplikasi frontend, pilih **Import single project**.
3. Atur **Root Directory** ke `frontend`.
4. Pilih preset Vite.
5. Build command: `npm run build`.
6. Output directory: `dist`.
7. Deploy frontend.

Jangan pilih **Import multi-service** kecuali konfigurasi multi-service Vercel memang sudah dibuat. Frontend dapat diimpor sebagai project tunggal dari monorepo.

### Frontend dan backend production

Frontend membaca alamat API dari `VITE_API_URL`, dengan fallback lokal:

```js
VITE_API_URL=https://nama-backend.example/api
```

Tetapkan variabel itu di pengaturan Environment project frontend Vercel dengan URL backend publik yang diakhiri `/api`, lalu redeploy frontend. Jangan menyimpan password database di variabel frontend berawalan `VITE_`, karena nilainya masuk ke bundle browser.

## Deployment backend

Backend memakai Express dan menjalankan `app.listen()` di `backend/server.mjs`. Untuk cara paling langsung, deploy backend sebagai Web Service terpisah, misalnya di Render:

1. Buat Web Service dari repository GitHub yang sama.
2. Root directory: `backend`.
3. Build command: `npm install`.
4. Start command: `npm start`.
5. Tambahkan variabel database pada pengaturan Environment milik service.
6. Pastikan PostgreSQL sudah tersedia di layanan database yang bisa diakses backend dari jaringan publik.
7. Setelah service aktif, salin URL publiknya dan hubungkan frontend sesuai langkah di atas.

Backend sekarang memakai PostgreSQL dan membaca konfigurasi berikut:

- `DATABASE_URL`
- `NOMINATIM_URL` (jika diperlukan)

Masukkan `DATABASE_URL` di pengaturan Environment service backend, bukan di frontend. Jangan mengunggah file `.env` ke GitHub atau menaruh kredensial di kode.

Database PostgreSQL yang diuji sudah memiliki tabel yang diperlukan. Untuk database baru, jalankan `backend/schema.sql` melalui SQL editor provider sebelum backend mulai menerima request. Query ini menyiapkan tabel laporan dan posko, dan tidak menghapus tabel atau data yang sudah ada.

Backend juga bisa dicoba sebagai project terpisah di Vercel dengan memilih aplikasi backend dan Root Directory `backend`. Namun, server yang ada menggunakan `app.listen()`, sehingga perlu memastikan format entry point-nya sesuai runtime Vercel sebelum mengandalkannya. Untuk backend Express yang berjalan sebagai server biasa, Web Service seperti Render lebih sederhana.

## Peringatan kredensial

`backend/.env` saat ini masih tercatat sebagai file Git meskipun `.gitignore` sudah mengabaikannya. File itu ikut masuk ke histori GitHub melalui merge sebelumnya. Jangan membaca atau menyalin nilainya ke chat atau log.

Lakukan langkah berikut sebelum backend dipublikasikan:

1. Anggap kredensial dalam file tersebut sudah terekspos, lalu ganti password database dan secret terkait melalui providernya.
2. Hapus file dari index Git tanpa menghapus salinan lokal:

   ```powershell
   git rm --cached backend/.env
   ```

3. Pastikan `.gitignore` tetap mengabaikan `backend/.env` dan file environment lain. Saat ini `.gitignore` root sudah memiliki aturan tersebut.
4. Commit dan push penghapusan file dari versi terbaru:

   ```powershell
   git commit -m "Remove tracked backend environment file"
   git push origin main
   ```

Menghapus file dari commit terbaru tidak menghapusnya dari commit lama. Rotasi kredensial tetap wajib. Jika repository bersifat publik dan kebijakan proyek meminta pembersihan histori, koordinasikan rewrite histori sebelum melakukannya karena tindakan itu mengubah commit yang sudah dipush.

## Konteks untuk agent berikutnya

Lanjutkan dari status repo saat ini, jangan mengulang merge histori. Fokus yang masih perlu dikerjakan:

1. Beri tahu pemilik untuk merotasi kredensial yang pernah tersimpan di `backend/.env`.
2. Hapus `backend/.env` dari Git tracking tanpa menghapus salinan lokal, lalu commit dan push setelah pemilik menyetujui perubahan.
3. Deploy backend ke provider terpisah dan masukkan `DATABASE_URL` ke environment backend.
4. Setelah mendapat URL publik backend, set `VITE_API_URL` pada project frontend Vercel, dengan akhiran `/api`.
5. Redeploy frontend Vercel, lalu uji endpoint API dan alur aplikasi.

Jangan menuliskan isi `.env`, meminta pengguna mengirim kredensial di chat, atau melakukan force push.
