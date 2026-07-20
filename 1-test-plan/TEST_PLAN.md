# TEST PLAN — SIGAP Web Application

**Dokumen No.**: SIGAP-QA-TP-001  
**Versi**: 1.0  
**Tanggal Dibuat**: 20 Juli 2026  
**Status**: Final  
**Dibuat oleh**: Tim QA SIGAP  

---

## 1. Pendahuluan

### 1.1 Tujuan Dokumen
Dokumen Test Plan ini mendefinisikan strategi, ruang lingkup, pendekatan, sumber daya, dan jadwal pengujian untuk aplikasi web SIGAP (Sistem Informasi Gerak Aduan Publik). Tujuan utamanya adalah memastikan aplikasi memenuhi standar kualitas dalam aspek fungsionalitas, responsivitas, performa, aksesibilitas, dan SEO sebelum dirilis ke publik.

### 1.2 Deskripsi Aplikasi
SIGAP adalah platform pengaduan infrastruktur publik berbasis web yang memungkinkan:
- Warga (Masyarakat) melaporkan kerusakan infrastruktur (jalan, drainase, PJU, fasilitas umum)
- Admin/Petugas memproses dan menindaklanjuti laporan
- Publik memantau progres perbaikan secara transparan

**Tech Stack**:
| Komponen      | Teknologi          |
|---------------|--------------------|
| Frontend      | Next.js 16 (App Router), TypeScript |
| Styling       | Tailwind CSS, CSS Modules |
| Backend/DB    | Supabase (PostgreSQL) |
| Auth          | Supabase Auth (Email + Google OAuth) |
| Storage       | Supabase Storage (avatars bucket) |
| Deploy        | Vercel |
| Icons         | Material Symbols Outlined (Google Fonts) |

### 1.3 Referensi
- QA Report Awal: `sigap_qa_report.html`
- URL Produksi: https://sigap-liard.vercel.app
- Source Code: Repositori SIGAP utama

---

## 2. Ruang Lingkup Pengujian

### 2.1 Halaman yang Diuji

| No | Rute                          | Deskripsi                     | Prioritas |
|----|-------------------------------|-------------------------------|-----------|
| 1  | `/`                           | Beranda / Landing Page        | **P1**    |
| 2  | `/login-masyarakat`           | Portal Login Warga            | **P1**    |
| 3  | `/register`                   | Pendaftaran Akun Baru         | **P1**    |
| 4  | `/dashboard-pelapor`          | Dashboard Warga               | **P1**    |
| 5  | `/buat-laporan`               | Form Pengajuan Laporan        | **P1**    |
| 6  | `/peta-pelapor`               | Peta Sebaran Laporan          | **P2**    |
| 7  | `/progress`                   | Progres Perbaikan Publik      | **P2**    |
| 8  | `/kontak-darurat`             | Direktori Kontak Darurat      | **P2**    |
| 9  | `/login`                      | Portal Login Admin/Petugas    | **P2**    |
| 10 | `/admin`                      | Dashboard Admin               | **P2**    |
| 11 | `/sitemap.xml`                | Sitemap SEO                   | **P3**    |
| 12 | `/robots.txt`                 | Robots SEO                    | **P3**    |

### 2.2 Area Pengujian (In Scope)

| Area                | Deskripsi                                                |
|---------------------|----------------------------------------------------------|
| **Responsivitas**   | Tampilan mobile (320px–768px), tablet (768px–1024px), desktop (>1024px) |
| **Performa**        | DOM load time, jumlah elemen, lazy loading asset         |
| **Aksesibilitas**   | WCAG 2.1 Level AA — aria-label, aria-hidden, kontrast, heading |
| **SEO**             | Meta title, description, Open Graph, Twitter Card, sitemap, robots |
| **Fungsionalitas**  | Login, registrasi, CRUD laporan, navigasi, anchor links  |

### 2.3 Di Luar Ruang Lingkup (Out of Scope)
- Pengujian performa server/database (Supabase side)
- Security penetration testing
- Mobile native app (iOS/Android)
- Cross-browser testing di browser legacy (IE11)

---

## 3. Strategi & Pendekatan Pengujian

### 3.1 Jenis Pengujian

| Jenis Pengujian       | Metode        | Tools                          |
|-----------------------|---------------|--------------------------------|
| Manual Testing        | Exploratory   | Browser DevTools (Chrome/Firefox) |
| Automated UI Testing  | Script-based  | Playwright + TypeScript        |
| Accessibility Testing | Automated     | axe-core via Playwright        |
| SEO Audit             | Manual + Tools| Chrome Lighthouse, Meta Inspector |
| Performance Audit     | Tools         | Chrome DevTools Network Tab    |
| Responsiveness        | Manual + Tools| Chrome Device Mode             |

### 3.2 Browser yang Diuji

| Browser            | Versi   | Platform       |
|--------------------|---------|----------------|
| Google Chrome      | Latest  | Windows 11     |
| Mozilla Firefox    | Latest  | Windows 11     |
| Microsoft Edge     | Latest  | Windows 11     |
| Mobile Chrome      | Latest  | Android 13     |
| Mobile Safari      | Latest  | iOS 17         |

### 3.3 Viewport Breakpoints

| Kategori  | Lebar Layar    |
|-----------|----------------|
| Mobile S  | 320px          |
| Mobile M  | 375px          |
| Mobile L  | 425px          |
| Tablet    | 768px          |
| Laptop    | 1024px         |
| Desktop   | 1280px, 1440px |

---

## 4. Kriteria Masuk & Keluar Pengujian

### 4.1 Entry Criteria (Syarat Mulai Pengujian)
- [x] Build Next.js berhasil tanpa error (`npm run build`)
- [x] Aplikasi dapat diakses di URL produksi (https://sigap-liard.vercel.app)
- [x] Koneksi Supabase aktif dan database tersedia
- [x] Akun test tersedia untuk semua role (Masyarakat, Admin, Petugas)
- [x] Environment test terkonfigurasi

### 4.2 Exit Criteria (Syarat Selesai Pengujian)
- [ ] Semua P1 (Critical) test case telah dieksekusi
- [ ] Tidak ada bug dengan severity Critical (Sev-1) yang open
- [ ] Semua bug Severity-2 yang ditemukan telah didokumentasikan
- [ ] Laporan QA final telah disiapkan dan disetujui
- [ ] Aksesibilitas score minimal 80/100 (Lighthouse)
- [ ] SEO score minimal 90/100 (Lighthouse)

---

## 5. Manajemen Risiko

| Risiko                                     | Dampak  | Kemungkinan | Mitigasi                                |
|--------------------------------------------|---------|-------------|------------------------------------------|
| Supabase tidak tersedia saat pengujian     | Tinggi  | Rendah      | Gunakan data mock/local cache            |
| Flakiness test otomasi Playwright          | Sedang  | Sedang      | Tambah retry logic & wait conditions     |
| Perubahan kode saat pengujian berlangsung  | Tinggi  | Rendah      | Freeze branch sebelum QA                 |
| Google OAuth tidak bisa diuji di CI        | Sedang  | Tinggi      | Skip OAuth test di pipeline, manual only |

---

## 6. Deliverables QA

| No | Deliverable                            | Status |
|----|----------------------------------------|--------|
| 1  | Test Plan (dokumen ini)                | ✅ Selesai |
| 2  | Test Cases per area (5 dokumen)        | ✅ Selesai |
| 3  | Bug Report (sebelum perbaikan)         | ✅ Selesai |
| 4  | Execution Log (sesudah perbaikan)      | ✅ Selesai |
| 5  | Automation Scripts (Playwright)        | ✅ Selesai |
| 6  | Laporan Akhir & Analisis Kualitas      | ✅ Selesai |

---

## 7. Jadwal Pengujian

| Fase                        | Tanggal       | Durasi    | Status    |
|-----------------------------|---------------|-----------|-----------|
| Review awal & QA Report     | 20 Jul 2026   | 1 hari    | ✅ Selesai |
| Penyusunan Test Plan        | 20 Jul 2026   | 0.5 hari  | ✅ Selesai |
| Penyusunan Test Cases       | 20 Jul 2026   | 0.5 hari  | ✅ Selesai |
| Eksekusi Test Manual        | 20 Jul 2026   | 1 hari    | ✅ Selesai |
| Bug Triage & Perbaikan      | 20 Jul 2026   | 1 hari    | ✅ Selesai |
| Automation Script Writing   | 20 Jul 2026   | 0.5 hari  | ✅ Selesai |
| Laporan Akhir & Closure     | 20 Jul 2026   | 0.5 hari  | ✅ Selesai |

---

## 8. Definisi Severity & Priority Bug

### Severity
| Level | Label    | Deskripsi                                            |
|-------|----------|------------------------------------------------------|
| Sev-1 | Critical | Aplikasi tidak dapat digunakan, data loss, security breach |
| Sev-2 | High     | Fitur utama tidak berfungsi, tidak ada workaround    |
| Sev-3 | Medium   | Fitur utama berfungsi tapi ada abnormalitas          |
| Sev-4 | Low      | Isu kosmetik, minor UX, typo                         |

### Priority
| Level | Label    | Deskripsi                                            |
|-------|----------|------------------------------------------------------|
| P1    | Critical | Harus diperbaiki sebelum release                     |
| P2    | High     | Harus diperbaiki dalam sprint ini                    |
| P3    | Medium   | Dijadwalkan di sprint berikutnya                     |
| P4    | Low      | Backlog, diperbaiki jika ada waktu                   |

---

*Test Plan ini menjadi panduan utama pelaksanaan QA SIGAP v1.0*
