# 📝 CHANGELOG SISTEM LENTERA BIPA

Semua catatan perubahan, perbaikan bug, dan penambahan fitur yang telah diselesaikan untuk menyempurnakan sistem **Lentera BIPA (Institut Teknologi Nasional Bandung)**.

---

## [Versi 2.1.0] - 2026-10-16

### 🚀 Peningkatan Fitur Silabus & Modul Dosen (Teacher Syllabus Mirror)
- **Tampilan Silabus Dosen Tersinkronisasi dengan Student Dashboard:**
  - Merombak total modal *"View Full Syllabus"* di [TeacherDashboard.jsx](file:///c:/MyFolder/BIPA/ClassManagementBIPA/src/components/TeacherDashboard.jsx) dari daftar statis sederhana menjadi tampilan galeri kartu modul pembelajaran kaya (*rich course modules*) yang sinkron 1:1 dengan apa yang dilihat mahasiswa di [StudentDashboard.jsx](file:///c:/MyFolder/BIPA/ClassManagementBIPA/src/components/StudentDashboard.jsx).
  - Mengalirkan *shared state* `courses` dari [App.jsx](file:///c:/MyFolder/BIPA/ClassManagementBIPA/src/App.jsx) ke `TeacherDashboard`, sehingga setiap perubahan modul/silabus oleh Koordinator langsung tercermin di dashboard dosen.
  - **Fitur Interaktif Detail Modul untuk Dosen:**
    - Pemutar audio dialog ajar native (*Interactive Native Audio Listening Player*) lengkap dengan pengatur kecepatan (0.8x, 1.0x, 1.2x), seek -10s/+10s, dan progress bar untuk diputar langsung di kelas.
    - Target kompetensi & indikator ketercapaian per pertemuan.
    - Daftar kosakata kunci (*Key Vocabulary*) beserta simulasi pelafalan audio (*Volume speaker*).
    - Fokus tata bahasa & etika budaya (*Grammar Focus & Cultural Etiquette*).
    - Lembar kerja & berkas materi (*Courseware Worksheets*) yang dapat diunduh (PDF) langsung oleh dosen.
    - Tautan langsung ke Google Drive repositori materi ajar.
    - Panel khusus **Arahan Pedagogis Pengajar (*Teacher Directive Guidance*)** untuk memudahkan dosen memandu diskusi, roleplay pasar, dan tugas imersif mahasiswa.

---

## [Versi 2.0.0] - 2026-10-11

### 🚀 Fitur Baru (New Features)
- **Desain Otentikasi 2-Kolom (Split-Layout):**
  - Mengubah tampilan `LoginPage`, `SignUpPage`, dan `ForgotPasswordPage` menjadi layout 2-kolom modern dengan rasio 5:7.
  - Menghasilkan ilustrasi kustom flat design (*Flat Design International Students Study BIPA*) yang tersimpan di `public/international_students_study.jpg` dan tersaji di sisi kiri dengan overlay gradien serta kartu informasi akademik.
  - Menambahkan panel pemilih cepat (1-Click Quick Dummy Accounts) pada halaman masuk untuk menguji peran Koordinator, Supervisor QA, Dosen Pengampu, dan Mahasiswa Asing tanpa perlu mengetik manual.
- **REST API Backend Autentikasi & Akun:**
  - Menambahkan endpoint `POST /api/auth/login` dengan validasi password dan penerbitan token sesi.
  - Menambahkan endpoint `GET /api/auth/dummy-accounts` untuk mensanitasi dan menyediakan kredensial demonstrasi ke frontend.
  - Menambahkan endpoint `POST /api/auth/register` untuk pendaftaran mahasiswa baru.
  - Menambahkan endpoint `POST /api/auth/forgot-password` dan `POST /api/auth/reset-password` untuk alur pemulihan akun.
- **REST API & Persistensi Data Darmasiswa RI:**
  - Menambahkan persistensi data program Darmasiswa di `server/database.js` dan penyimpanan permanen pada `server/db.json`.
  - Mengimplementasikan endpoint `GET /api/darmasiswa/sessions`, `POST /api/darmasiswa/sessions`, `POST /api/darmasiswa/sessions/:id/facilitator-sign`, dan `POST /api/darmasiswa/sessions/:id/student-checkin`.
  - Mengintegrasikan sinkronisasi dua arah di `src/App.jsx` sehingga presensi dan check-in mandiri mahasiswa tersimpan di backend dan tidak hilang saat halaman di-refresh.
- **Personalisasi Penuh Antarmuka Berdasarkan Pengguna Aktif (Dynamic Personalization):**
  - **Dosen (Teacher Dashboard):** Menampilkan nama dosen aktif (`Dianita, S.S., M.Hum.` atau `Dr. Siti Rahmawati, M.Pd.`), NIP/NIDN, avatar, serta mengaitkan pengesahan logbook dan tanda tangan digital dengan identitas dosen yang sedang masuk.
  - **Supervisor QA:** Menampilkan profil `Dra. Ratna Handayani, M.Hum.` dengan jabatan *Supervisor Penjaminan Mutu & Kurikulum (QA)*.
  - **Koordinator (Master):** Menampilkan profil `Prof. Dr. Irwan Susanto` sebagai *Koordinator Program BIPA & Kebudayaan*.
  - **Mahasiswa (Student Dashboard):** Menampilkan nama mahasiswa aktif (`Phouphakham Bounlom` / `312024043` atau `Sarah Jenkins` / `BIPA-2026-081`), kartu absensi Darmasiswa terintegrasi, dan tombol check-in kehadiran mandiri.

### 🐛 Perbaikan Bug & Optimasi (Bug Fixes & Refactoring)
- **Fix Syntax Error Async pada Form Pendaftaran:**
  - Memperbaiki fungsi `handleSubmit` pada `SignUpPage.jsx` dan `ForgotPasswordPage.jsx` dengan menambahkan deklarasi `async` sebelum pemanggilan `await fetch()`.
- **Fix ReferenceError DARMASISWA_NIM pada Student Dashboard:**
  - Memperbaiki variabel tak terdefinisi `DARMASISWA_NIM` pada `src/components/StudentDashboard.jsx` (baris 692) menjadi `activeStudentNim` yang dinamis sesuai profil mahasiswa aktif yang sedang login.
- **Pencegahan Server Crash Akibat Format JSON Tidak Valid:**
  - Menambahkan middleware penangkap error parsing JSON (`SyntaxError`) pada Express di `server/index.js` agar request dengan format JSON yang salah tidak mematikan server.
- **Konektivitas Sesi Darmasiswa pada Laporan Resmi Itenas:**
  - Menghubungkan props `customSessions={darmasiswaSessions}` pada `DarmasiswaRecapReport` di `App.jsx` sehingga data sesi yang baru diinput oleh dosen atau dicheck-in oleh mahasiswa langsung tercermin pada Laporan Rekapitulasi Resmi Itenas ber-Kop Surat.
- **Verifikasi Build Produksi:**
  - Menjalankan `npm run build` dan memastikan kompilasi bundle Vite berhasil bersih (`✓ 2020 modules transformed`) tanpa peringatan sintaksis.

### 🎨 Peningkatan Estetika & UX (Visual & Design Polish)
- Tampilan responsif pada ukuran layar desktop, tablet, dan ponsel.
- Efek hover interaktif, kartu backdrop-blur, transisi halus, dan animasi micro-interactions.
- Dukungan cetak dokumen (Ctrl+P / window.print) pada format laporan Kop Surat resmi Itenas dengan penataan margin optimal dan penyembunyian tombol navigasi otomatis saat cetak.
