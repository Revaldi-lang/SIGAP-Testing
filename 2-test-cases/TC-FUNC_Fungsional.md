# TEST CASES — Fungsionalitas Inti

**Modul**: Fungsionalitas  
**Kode Modul**: FUNC  
**Dibuat**: 20 Juli 2026  

---

## Ringkasan Test Cases

| Total TC | Pass | Fail | Skip |
|----------|------|------|------|
| 15       | 14   | 1    | 0    |

---

## TC-FUNC-001: Login Masyarakat — Sukses

| Field        | Detail |
|--------------|--------|
| **ID**       | TC-FUNC-001 |
| **Judul**    | Warga dapat login dengan email dan password yang valid |
| **Prioritas**| P1 |
| **Severity** | Sev-1 |

**Prasyarat**: Akun masyarakat terdaftar dengan role "Masyarakat"

**Langkah Pengujian**:
1. Buka `/login-masyarakat`
2. Masukkan email valid terdaftar
3. Masukkan password yang benar
4. Klik "Masuk Sekarang"
5. Tunggu redirect

**Expected Result**: Berhasil login, redirect ke `/dashboard-pelapor`

**Actual Result**: ✅ Login berhasil, redirect ke dashboard

**Status**: ✅ **PASS**

---

## TC-FUNC-002: Login Masyarakat — Password Salah

| Field        | Detail |
|--------------|--------|
| **ID**       | TC-FUNC-002 |
| **Judul**    | Pesan error muncul saat password salah |
| **Prioritas**| P1 |
| **Severity** | Sev-1 |

**Langkah Pengujian**:
1. Buka `/login-masyarakat`
2. Masukkan email valid
3. Masukkan password salah
4. Klik "Masuk Sekarang"

**Expected Result**: Pesan error "Alamat email atau kata sandi salah / akun belum terdaftar." muncul; tidak ada redirect

**Actual Result**: ✅ Error message tampil, form tidak di-reset

**Status**: ✅ **PASS**

---

## TC-FUNC-003: Login Masyarakat — Portal Salah (Admin Account)

| Field        | Detail |
|--------------|--------|
| **ID**       | TC-FUNC-003 |
| **Judul**    | Akun admin tidak dapat login di portal masyarakat |
| **Prioritas**| P1 |
| **Severity** | Sev-2 |

**Prasyarat**: Akun dengan role "Administrator" tersedia

**Langkah Pengujian**:
1. Buka `/login-masyarakat`
2. Masukkan email akun Administrator
3. Masukkan password yang benar
4. Klik "Masuk Sekarang"

**Expected Result**: Pesan error "Akun ini bukan akun masyarakat. Gunakan portal Admin / Petugas untuk masuk."

**Actual Result**: ✅ Error message portal salah tampil dengan benar

**Status**: ✅ **PASS**

---

## TC-FUNC-004: Show/Hide Password Toggle

| Field        | Detail |
|--------------|--------|
| **ID**       | TC-FUNC-004 |
| **Judul**    | Tombol show/hide password berfungsi |
| **Prioritas**| P2 |
| **Severity** | Sev-3 |

**Langkah Pengujian**:
1. Buka `/login-masyarakat`
2. Ketik password di field
3. Klik ikon "visibility"
4. Periksa tipe input berubah dari `password` ke `text`
5. Klik lagi, periksa kembali ke `password`

**Expected Result**: Input type toggle antara `password` dan `text`

**Actual Result**: ✅ Toggle berfungsi, `aria-label` berubah sesuai kondisi

**Status**: ✅ **PASS**

---

## TC-FUNC-005: Navigasi — Breadcrumb di Progress

| Field        | Detail |
|--------------|--------|
| **ID**       | TC-FUNC-005 |
| **Judul**    | Breadcrumb di halaman /progress mengarah ke beranda |
| **Prioritas**| P2 |
| **Severity** | Sev-3 |

**Langkah Pengujian**:
1. Buka `/progress`
2. Klik "Beranda" di breadcrumb
3. Periksa navigasi

**Expected Result**: Berpindah ke `/`

**Actual Result**: ✅ Breadcrumb berfungsi, mengarah ke `/`

**Status**: ✅ **PASS**

---

## TC-FUNC-006: Filter Kategori — Progress Page

| Field        | Detail |
|--------------|--------|
| **ID**       | TC-FUNC-006 |
| **Judul**    | Filter kategori di halaman progress menyaring berita dengan benar |
| **Prioritas**| P2 |
| **Severity** | Sev-3 |

**Langkah Pengujian**:
1. Buka `/progress`
2. Klik tombol filter "Jalan"
3. Periksa hanya berita kategori "Jalan" yang tampil
4. Klik "Semua" — semua berita tampil kembali

**Expected Result**: Filter berfungsi sesuai kategori

**Actual Result**: ✅ Filter bekerja dengan benar

**Status**: ✅ **PASS**

---

## TC-FUNC-007: Pencarian — Progress Page

| Field        | Detail |
|--------------|--------|
| **ID**       | TC-FUNC-007 |
| **Judul**    | Search field di progress menyaring berita berdasarkan kata kunci |
| **Prioritas**| P2 |
| **Severity** | Sev-3 |

**Langkah Pengujian**:
1. Buka `/progress`
2. Ketik "Jembatan" di kotak pencarian
3. Periksa hanya berita yang mengandung "Jembatan" tampil
4. Hapus teks pencarian — semua berita tampil kembali

**Expected Result**: Search real-time memfilter berita berdasarkan judul dan deskripsi

**Actual Result**: ✅ Pencarian berfungsi secara real-time

**Status**: ✅ **PASS**

---

## TC-FUNC-008: Filter Pulau — Kontak Darurat

| Field        | Detail |
|--------------|--------|
| **ID**       | TC-FUNC-008 |
| **Judul**    | Filter pulau di kontak darurat menyaring provinsi dengan benar |
| **Prioritas**| P2 |
| **Severity** | Sev-3 |

**Langkah Pengujian**:
1. Buka `/kontak-darurat`
2. Klik pill "Jawa"
3. Periksa hanya provinsi di Pulau Jawa yang tampil

**Expected Result**: Hanya provinsi dari Pulau Jawa yang ditampilkan (DKI Jakarta, Banten, Jawa Barat, DI Yogyakarta, Jawa Tengah, Jawa Timur)

**Actual Result**: ✅ Filter pulau bekerja dengan benar

**Status**: ✅ **PASS**

---

## TC-FUNC-009: Tap-to-Call — Kontak Darurat

| Field        | Detail |
|--------------|--------|
| **ID**       | TC-FUNC-009 |
| **Judul**    | Link kontak darurat memiliki protocol tel: untuk panggilan langsung |
| **Prioritas**| P2 |
| **Severity** | Sev-3 |

**Langkah Pengujian**:
1. Buka `/kontak-darurat`
2. Inspect link nomor darurat nasional
3. Periksa atribut `href`

**Expected Result**: `href="tel:110"`, `href="tel:113"`, dll.

**Actual Result**: ✅ Semua link nomor darurat menggunakan `tel:` protocol

**Status**: ✅ **PASS**

---

## TC-FUNC-010: Modal Akses — Portal Selector

| Field        | Detail |
|--------------|--------|
| **ID**       | TC-FUNC-010 |
| **Judul**    | Modal pemilihan portal muncul saat klik "Masuk Portal" |
| **Prioritas**| P1 |
| **Severity** | Sev-2 |

**Langkah Pengujian**:
1. Buka `/` saat belum login
2. Klik tombol "Masuk Portal" di navbar
3. Periksa modal muncul dengan pilihan portal

**Expected Result**: Modal `ModalAkses` muncul dengan pilihan Portal Warga dan Portal Admin

**Actual Result**: ✅ Modal tampil dengan dua opsi portal

**Status**: ✅ **PASS**

---

## TC-FUNC-011: Logout

| Field        | Detail |
|--------------|--------|
| **ID**       | TC-FUNC-011 |
| **Judul**    | Warga dapat logout dan session dibersihkan |
| **Prioritas**| P1 |
| **Severity** | Sev-1 |

**Prasyarat**: Login terlebih dahulu sebagai masyarakat

**Langkah Pengujian**:
1. Login sebagai masyarakat
2. Klik avatar di navbar → klik "Keluar Sesi"
3. Periksa redirect ke beranda
4. Periksa localStorage: `sigap_session` harus terhapus

**Expected Result**: Redirect ke `/`; `localStorage.getItem('sigap_session')` = null

**Actual Result**: ✅ Logout berhasil, localStorage terbersihkan, redirect ke beranda

**Status**: ✅ **PASS**

---

## TC-FUNC-012: Proteksi Rute Dashboard

| Field        | Detail |
|--------------|--------|
| **ID**       | TC-FUNC-012 |
| **Judul**    | Halaman dashboard tidak dapat diakses tanpa login |
| **Prioritas**| P1 |
| **Severity** | Sev-1 |

**Langkah Pengujian**:
1. Buka tab incognito (tidak ada session)
2. Navigasi langsung ke `/dashboard-pelapor`
3. Periksa respons halaman

**Expected Result**: Redirect ke `/login-masyarakat` atau tampil pesan "tidak terotorisasi"

**Actual Result**: ✅ Redirect ke `/login-masyarakat` via `AuthGuard` component

**Status**: ✅ **PASS**

---

## TC-FUNC-013: Progress Bar — Visualisasi Persentase

| Field        | Detail |
|--------------|--------|
| **ID**       | TC-FUNC-013 |
| **Judul**    | Progress bar di setiap kartu berita menampilkan persentase yang akurat |
| **Prioritas**| P3 |
| **Severity** | Sev-4 |

**Langkah Pengujian**:
1. Buka `/progress`
2. Periksa setiap kartu berita
3. Bandingkan teks persentase dengan lebar progress bar secara visual

**Expected Result**: Progress bar lebar 100% untuk berita selesai (hijau), 75% untuk yang sedang berjalan (biru)

**Actual Result**: ✅ Progress bar akurat sesuai data; warna berbeda untuk selesai vs. sedang proses

**Status**: ✅ **PASS**

---

## TC-FUNC-014: Pencarian Provinsi — Kontak Darurat

| Field        | Detail |
|--------------|--------|
| **ID**       | TC-FUNC-014 |
| **Judul**    | Input pencarian provinsi di kontak darurat berfungsi |
| **Prioritas**| P2 |
| **Severity** | Sev-3 |

**Langkah Pengujian**:
1. Buka `/kontak-darurat`
2. Ketik "Papua" di input pencarian
3. Periksa hanya provinsi Papua yang tampil

**Expected Result**: Filter real-time berdasarkan nama provinsi

**Actual Result**: ✅ Filter real-time berfungsi (6 provinsi Papua tampil)

**Status**: ✅ **PASS**

---

## TC-FUNC-015: Marquee Logo — Animasi Berjalan

| Field        | Detail |
|--------------|--------|
| **ID**       | TC-FUNC-015 |
| **Judul**    | Marquee logo di beranda berjalan secara kontinu tanpa jeda atau lompatan |
| **Prioritas**| P3 |
| **Severity** | Sev-4 |

**Langkah Pengujian**:
1. Buka `/`
2. Amati animasi marquee logo instansi selama 10 detik
3. Periksa apakah ada jeda, lompatan, atau artifact visual

**Expected Result**: Animasi loop berjalan mulus tanpa jeda

**Actual Result**: ✅ Animasi CSS berjalan seamless dengan 2 set logo (8 elemen total)

**Status**: ✅ **PASS**
