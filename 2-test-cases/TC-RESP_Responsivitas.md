# TEST CASES — Responsivitas & Mobile-Friendly

**Modul**: Responsivitas  
**Kode Modul**: RESP  
**Dibuat**: 20 Juli 2026  
**Referensi QA Report**: Skor B, 3 isu ditemukan  

---

## Ringkasan Test Cases

| Total TC | Pass | Fail | Skip |
|----------|------|------|------|
| 12       | 9    | 3    | 0    |

---

## TC-RESP-001: Viewport Meta Tag

| Field        | Detail |
|--------------|--------|
| **ID**       | TC-RESP-001 |
| **Judul**    | Verifikasi viewport meta tag pada semua halaman |
| **Prioritas**| P1 |
| **Severity** | Sev-2 |

**Langkah Pengujian**:
1. Buka halaman utama `/` di Chrome DevTools
2. Periksa tab Elements → `<head>` → cari tag `<meta name="viewport">`
3. Ulangi langkah 1-2 untuk `/progress`, `/kontak-darurat`, `/login-masyarakat`

**Expected Result**: Setiap halaman memiliki `<meta name="viewport" content="width=device-width, initial-scale=1">`

**Actual Result**: ✅ Viewport meta tag ditemukan dan benar di semua halaman (diset via Next.js App Router default)

**Status**: ✅ **PASS**

---

## TC-RESP-002: Tampilan Mobile — Beranda (375px)

| Field        | Detail |
|--------------|--------|
| **ID**       | TC-RESP-002 |
| **Judul**    | Layout beranda tidak overflow pada viewport 375px |
| **Prioritas**| P1 |
| **Severity** | Sev-2 |

**Prasyarat**: Chrome DevTools → Device Toolbar → iPhone SE (375x667)

**Langkah Pengujian**:
1. Buka `/` di Chrome, aktifkan Device Toolbar (F12 → Toggle Device)
2. Set viewport ke 375x667 (iPhone SE)
3. Scroll dari atas hingga footer
4. Periksa horizontal scroll
5. Periksa konten tidak terpotong

**Expected Result**: Tidak ada horizontal scrollbar; semua konten terlihat dan terbaca dengan baik

**Actual Result**: ✅ Tidak ada overflow horizontal. Hero, marquee, section, footer semua responsif

**Status**: ✅ **PASS**

---

## TC-RESP-003: Marquee Logo — Jumlah Elemen DOM

| Field        | Detail |
|--------------|--------|
| **ID**       | TC-RESP-003 |
| **Judul**    | Logo marquee tidak membebani DOM dengan elemen berlebihan |
| **Prioritas**| P1 |
| **Severity** | Sev-3 |
| **Bug Ref**  | BUG-001 |

**Langkah Pengujian**:
1. Buka `/` di Chrome
2. Buka DevTools Console
3. Jalankan: `document.querySelectorAll('.animate-marquee img').length`
4. Catat jumlah elemen `<img>` dalam marquee

**Expected Result**: Jumlah elemen `<img>` dalam marquee ≤ 10 (maksimum 4 logo asli + 4 duplikat dekoratif)

**Actual Result Sebelum Perbaikan**: ❌ 64 elemen `<img>` ditemukan  
**Actual Result Sesudah Perbaikan**: ✅ 8 elemen `<img>` ditemukan (4 + 4 aria-hidden)

**Status**: ✅ **PASS** (setelah perbaikan)

---

## TC-RESP-004: Marquee Logo — Aria-Hidden Duplikat

| Field        | Detail |
|--------------|--------|
| **ID**       | TC-RESP-004 |
| **Judul**    | Elemen duplikat marquee memiliki aria-hidden="true" dan alt="" |
| **Prioritas**| P2 |
| **Severity** | Sev-3 |

**Langkah Pengujian**:
1. Buka `/` di Chrome
2. Buka DevTools → Elements
3. Cari div marquee kedua (duplikat)
4. Periksa atribut `aria-hidden` dan `alt` pada elemen img di dalamnya

**Expected Result**: Div duplikat memiliki `aria-hidden="true"`; img di dalamnya memiliki `alt=""`

**Actual Result**: ✅ Div duplikat memiliki `aria-hidden="true"`, semua img duplikat memiliki `alt=""`

**Status**: ✅ **PASS**

---

## TC-RESP-005: Halaman `/login-masyarakat` — Tidak Blank Screen

| Field        | Detail |
|--------------|--------|
| **ID**       | TC-RESP-005 |
| **Judul**    | Halaman login-masyarakat merender konten dan tidak menampilkan layar kosong |
| **Prioritas**| P1 |
| **Severity** | Sev-2 |
| **Bug Ref**  | BUG-002 |

**Langkah Pengujian**:
1. Buka tab incognito (pastikan tidak ada sesi login aktif)
2. Navigasi ke `/login-masyarakat`
3. Tunggu maksimal 3 detik
4. Periksa apakah form login tampil

**Expected Result**: Form login (email, password, tombol "Masuk Sekarang") terlihat dalam waktu < 2 detik

**Actual Result Sebelum Perbaikan**: ❌ Halaman menampilkan spinner tanpa batas waktu jika `loading` state tidak segera resolve  
**Actual Result Sesudah Perbaikan**: ✅ Form login muncul dalam < 1.5 detik melalui `pageReady` fallback timer

**Status**: ✅ **PASS** (setelah perbaikan)

---

## TC-RESP-006: Loading State — Spinner dengan Teks

| Field        | Detail |
|--------------|--------|
| **ID**       | TC-RESP-006 |
| **Judul**    | Loading state menampilkan spinner dan teks informatif |
| **Prioritas**| P3 |
| **Severity** | Sev-4 |

**Langkah Pengujian**:
1. Buka `/login-masyarakat` dengan koneksi lambat (DevTools → Network → Slow 3G)
2. Perhatikan kondisi sementara loading

**Expected Result**: Terlihat spinner animasi dan teks "Memuat Portal Warga..." selama proses loading

**Actual Result**: ✅ Spinner + teks "Memuat Portal Warga..." tampil dengan animasi pulse

**Status**: ✅ **PASS**

---

## TC-RESP-007: Anchor Link Navbar — Cross-Page Navigation

| Field        | Detail |
|--------------|--------|
| **ID**       | TC-RESP-007 |
| **Judul**    | Link navigasi navbar berfungsi dari subhalaman ke section beranda |
| **Prioritas**| P1 |
| **Severity** | Sev-2 |
| **Bug Ref**  | BUG-003 |

**Langkah Pengujian**:
1. Navigasi ke `/progress`
2. Klik link "Kegunaan" di navbar
3. Periksa apakah browser berpindah ke `/` dan scroll ke `#info-section`
4. Ulangi untuk "Cara Melapor" → `#alur-section`, "SOP Kerja" → `#proses-section`, "Suara Warga" → `#suara-warga-section`
5. Ulangi dari halaman `/kontak-darurat`

**Expected Result**: Setiap klik navigasi mengarahkan ke beranda (`/`) dan scroll ke section yang tepat

**Actual Result Sebelum Perbaikan**: ❌ Link `#info-section` tidak berfungsi dari `/progress` (tidak ada section dengan ID tersebut di halaman itu)  
**Actual Result Sesudah Perbaikan**: ✅ Link `/#info-section` mengarahkan ke beranda dan scroll ke section yang benar

**Status**: ✅ **PASS** (setelah perbaikan)

---

## TC-RESP-008: Mobile Menu — Hamburger Toggle

| Field        | Detail |
|--------------|--------|
| **ID**       | TC-RESP-008 |
| **Judul**    | Menu hamburger mobile dapat dibuka dan ditutup dengan benar |
| **Prioritas**| P1 |
| **Severity** | Sev-2 |

**Prasyarat**: Viewport ≤ 768px

**Langkah Pengujian**:
1. Buka `/` di viewport 375px
2. Klik tombol hamburger (ikon menu)
3. Periksa dropdown menu muncul
4. Klik salah satu link menu
5. Periksa menu tertutup setelah klik
6. Klik backdrop (overlay gelap) — periksa menu tertutup

**Expected Result**: Menu terbuka saat diklik, tertutup setelah navigasi atau klik backdrop

**Actual Result**: ✅ Menu berfungsi dengan benar, backdrop menutup menu, animasi smooth

**Status**: ✅ **PASS**

---

## TC-RESP-009: Tablet Layout — 768px

| Field        | Detail |
|--------------|--------|
| **ID**       | TC-RESP-009 |
| **Judul**    | Layout beranda pada viewport 768px tidak overlap atau rusak |
| **Prioritas**| P2 |
| **Severity** | Sev-3 |

**Langkah Pengujian**:
1. Set viewport ke 768px
2. Periksa grid section "Pelayanan Publik Terpadu" (3 card)
3. Periksa section statistik (2 kolom)
4. Periksa navbar (desktop links visible)

**Expected Result**: Layout konsisten tanpa elemen yang tumpang tindih

**Actual Result**: ✅ Layout konsisten di viewport 768px

**Status**: ✅ **PASS**

---

## TC-RESP-010: Kontak Darurat — Tabel Scrollable Mobile

| Field        | Detail |
|--------------|--------|
| **ID**       | TC-RESP-010 |
| **Judul**    | Kartu kontak provinsi dapat di-scroll di mobile tanpa overflow |
| **Prioritas**| P2 |
| **Severity** | Sev-3 |

**Langkah Pengujian**:
1. Buka `/kontak-darurat` di viewport 375px
2. Scroll ke section "Kontak per Provinsi"
3. Periksa kartu-kartu provinsi

**Expected Result**: Kartu provinsi ditampilkan satu kolom dan dapat di-scroll tanpa horizontal overflow

**Actual Result**: ✅ Kartu ditampilkan dalam satu kolom di mobile, layout responsif

**Status**: ✅ **PASS**

---

## TC-RESP-011: Navbar Footer — Anchor dari Footer

| Field        | Detail |
|--------------|--------|
| **ID**       | TC-RESP-011 |
| **Judul**    | Link navigasi di footer berfungsi cross-page |
| **Prioritas**| P2 |
| **Severity** | Sev-3 |
| **Bug Ref**  | BUG-003 |

**Langkah Pengujian**:
1. Buka `/progress` dan scroll ke footer
2. Klik "Kegunaan" di bagian navigasi footer
3. Verifikasi mengarah ke `/#info-section`

**Expected Result**: Navigasi footer mengarahkan ke beranda section yang tepat

**Actual Result Sebelum Perbaikan**: ❌ Link `#info-section` tidak berfungsi dari `/progress`  
**Actual Result Sesudah Perbaikan**: ✅ Mengarah ke `/#info-section` dengan benar

**Status**: ✅ **PASS** (setelah perbaikan)

---

## TC-RESP-012: Desktop 1280px — Full Layout

| Field        | Detail |
|--------------|--------|
| **ID**       | TC-RESP-012 |
| **Judul**    | Layout lengkap desktop 1280px berfungsi dengan benar |
| **Prioritas**| P1 |
| **Severity** | Sev-2 |

**Langkah Pengujian**:
1. Set viewport ke 1280px
2. Periksa semua section beranda: Hero, Marquee, Alur, Info, Steps, SOP, Stats, CTA
3. Periksa navbar — desktop links visible, hamburger hidden

**Expected Result**: Semua section tampil dengan layout yang sesuai desain

**Actual Result**: ✅ Layout sesuai, semua section tampil dengan baik

**Status**: ✅ **PASS**
