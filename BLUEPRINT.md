# 🏛️ BLUEPRINT ARSITEKTUR SISTEM — LENTERA BIPA ITENAS

**Lentera BIPA — Sistem Manajemen Kelas & Berita Acara Perkuliahan (BAP) Multi-Level**  
*Institut Teknologi Nasional (Itenas) Bandung — Program BIPA & Darmasiswa Republik Indonesia*

---

## 1. Ringkasan Eksekutif & Tujuan Sistem

Aplikasi **Lentera BIPA** dirancang untuk mendigitalkan seluruh alur tata kelola akademik, presensi multi-level, logbook pembelajaran real-time, pengesahan Berita Acara Perkuliahan (BAP) bertingkat (Dual/Triple Sign-off), serta rekapitulasi resmi program beasiswa **Darmasiswa RI** dengan standar pelaporan institusional resmi Yayasan Pendidikan Dayang Sumbi – Institut Teknologi Nasional Bandung.

Sistem ini menghubungkan 4 peran utama pemangku kepentingan:
1. **Koordinator Program (Master Oversight):** Pemantauan seluruh kelas, persetujuan rekapitulasi, manajemen kurikulum/RPS, dan ekspor arsip PDF/Excel.
2. **Supervisor Akademik (QA / Penjaminan Mutu):** Audit kesesuaian unit materi rencana vs realisasi, pencatatan log pedagogis, dan pengesahan validasi BAP.
3. **Dosen Pengampu (Facilitator / Teacher):** Input presensi harian mahasiswa, pengisian logbook realisasi materi & catatan pedagogis, penandatanganan digital (canvas & QR).
4. **Mahasiswa Asing / Perwakilan (Student & Rep):** Check-in presensi mandiri, penandatanganan konfirmasi mahasiswa perwakilan, akses materi listening/audio, modul budaya, dan misi imersif lapangan.

---

## 2. Arsitektur Teknologi & Infrastruktur

```
┌─────────────────────────────────────────────────────────────┐
│                       Client Browser                        │
│   (Vite + React 18, Tailwind CSS, Lucide Icons, QR Canvas)  │
└──────────────┬──────────────────────────────▲───────────────┘
               │ HTTP / JSON API              │
               │ (Port 3000 -> Proxy)         │
┌──────────────▼──────────────────────────────┴───────────────┐
│                    Express.js REST API                      │
│             (Node.js ESM, CORS, JSON Body Parser)           │
│                      (Port 5000)                            │
└──────────────┬──────────────────────────────▲───────────────┘
               │ File I/O Sync                │
               ▼                              │
┌─────────────────────────────────────────────┴───────────────┐
│                 Persistent JSON Database                    │
│                     (server/db.json)                        │
│   - Users & Auth Credentials                                │
│   - Classes & Syllabuses                                    │
│   - Meeting Records & Dual Signatures                       │
│   - Darmasiswa Sessions & Live Check-ins                    │
└─────────────────────────────────────────────────────────────┘
```

- **Frontend:** React 18 (SPA), Vite 5, Tailwind CSS, Canvas Signature Pad, HTML5 QR Code Generator (`qrcode`), PDF Generator (`jspdf`, `jspdf-autotable`), Spreadsheet Export (`xlsx`).
- **Backend API:** Express.js ESM, modular REST architecture, error handling middleware for JSON payloads.
- **Penyimpanan Data:** Database terstruktur lokal (`server/db.json`) dengan seeding otomatis (`server/seedData.js`) dan fallback memori `localStorage` di sisi klien.

---

## 3. Matriks Peran & Hak Akses (RBAC)

| Peran | Pengguna Dummy Standar | Kredensial / NIM | Hak Akses Utama |
|---|---|---|---|
| **Koordinator (Master)** | Prof. Dr. Irwan Susanto | `koordinator` / `password123` | Melihat semua metrik, kelola kelas, approval BAP, akses laporan rekap Itenas QR, ekspor PDF/Excel. |
| **Supervisor (QA)** | Dra. Ratna Handayani, M.Hum. | `supervisor` / `password123` | Audit kepatuhan silabus, peninjauan log pedagogis, validasi & approval akhir BAP. |
| **Dosen Pengampu** | Dianita, S.S., M.Hum. | `198704122015052001` / `password123` | Presensi mahasiswa, logbook realisasi materi, tanda tangan digital dosen, input sesi Darmasiswa. |
| **Dosen Pengampu** | Dr. Siti Rahmawati, M.Pd. | `dosen-01` / `password123` | Kelas BIPA A1 / B1 reguler, penulisan narasi pedagogis kelas. |
| **Mahasiswa Darmasiswa** | Phouphakham Bounlom (Laos) | `312024043` / `password123` | Check-in mandiri sesi Darmasiswa, pelacakan kehadiran, modul audio & misi budaya. |
| **Mahasiswa Darmasiswa** | Tam Chanthasone (Laos) | `312024144` / `password123` | Check-in mandiri sesi Darmasiswa, rekap status presensi. |
| **Mahasiswa Perwakilan** | Sarah Jenkins (Australia) | `BIPA-2026-081` / `password123` | Penandatanganan konfirmasi perwakilan kelas (Student Rep Sign-off) pada BAP. |

---

## 4. Spesifikasi Endpoint REST API

### Autentikasi & Akun
- `POST /api/auth/login` — Autentikasi NIM/Username & Password, menerbitkan token sesi & profil sanitasi.
- `GET /api/auth/dummy-accounts` — Mengambil daftar akun demonstrasi cepat untuk seluruh 4 peran.
- `POST /api/auth/register` — Pendaftaran akun mahasiswa baru dengan pencegahan duplikasi NIM/Email.
- `POST /api/auth/forgot-password` — Verifikasi akun dan penerbitan token pemulihan sandi.
- `POST /api/auth/reset-password` — Pembaruan kata sandi akun secara aman.
- `GET /api/auth/me?identifier=...` — Pengambilan profil lengkap pengguna aktif.

### Berita Acara & Presensi Reguler
- `GET /api/classes` — Mengambil daftar seluruh kelas aktif BIPA.
- `GET /api/meetings?classId=...` — Mengambil Berita Acara Perkuliahan beserta status tanda tangan multi-pihak.
- `POST /api/meetings/:id/sign` — Menyimpan tanda tangan digital dosen, perwakilan mahasiswa, atau supervisor.
- `PUT /api/meetings/:id/attendance` — Memperbarui status presensi mahasiswa (Hadir, Izin, Terlambat, Alpa).
- `GET /api/export/logbook?classId=...` — Mengambil agregat kumulatif logbook perkuliahan.

### Program Darmasiswa RI
- `GET /api/darmasiswa/sessions` — Mengambil riwayat seluruh sesi perkuliahan Darmasiswa.
- `POST /api/darmasiswa/sessions` — Menambahkan sesi baru atau memperbarui sesi fasilitator.
- `POST /api/darmasiswa/sessions/:id/facilitator-sign` — Menyimpan pengesahan fasilitator sesi.
- `POST /api/darmasiswa/sessions/:id/student-checkin` — Check-in kehadiran mahasiswa Darmasiswa secara real-time.
- `GET /api/darmasiswa/students` — Daftar mahasiswa Darmasiswa RI terdaftar.
- `GET /api/darmasiswa/institution-info` — Metadata institusi resmi Itenas (Kop Surat).

---

## 5. Fitur Unggulan Sistem

1. **Autentikasi Modern 2-Sisi (Split-Layout):**
   - Panel kiri memuat ilustrasi vektor datar kontemporer (*Flat Design International Students Study BIPA*) dengan kartu branding resmi.
   - Panel kanan menyediakan form interaktif dengan tombol jalan-pintas (Quick Chips) satu kali klik untuk akun Dosen, Mahasiswa, Supervisor, dan Koordinator.
2. **Validasi Tanda Tangan & QR Digital:**
   - Menghasilkan payload verifikasi terenkripsi yang berisi ID sesi, nama penandatangan, tanggal/waktu ISO, dan hash otentikasi.
   - QR Code dapat diinspeksi secara interaktif melalui modal detail.
3. **Rekapitulasi Format Resmi Itenas (Kop Surat):**
   - Sesuai standar dokumen Biro Kerja Sama, Humas dan Pemasaran – Institut Teknologi Nasional Bandung.
   - Dilengkapi tabel presensi berparaf QR, kalkulasi persentase otomatis, dan fungsi cetak (Print/Ctrl+P) serta ekspor PDF beresolusi tinggi.
4. **Sinkronisasi Ganda (Optimistic UI & REST Backend):**
   - Perubahan data disimpan langsung ke memori lokal (`localStorage`) untuk performa instan dan secara paralel disinkronkan ke `server/db.json` melalui REST API.
