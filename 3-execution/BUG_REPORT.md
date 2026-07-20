# BUG REPORT — SIGAP Web Application

**Dokumen No.**: SIGAP-QA-BUG-001  
**Versi**: 1.0  
**Tanggal**: 20 Juli 2026  
**Status Keseluruhan**: ✅ Semua bug terselesaikan  

---

## Ringkasan Bug

| Severity   | Ditemukan | Diselesaikan | Open |
|------------|-----------|--------------|------|
| Sev-1 (Critical) | 0   | 0            | 0    |
| Sev-2 (High)     | 7   | 7            | 0    |
| Sev-3 (Medium)   | 4   | 4            | 0    |
| Sev-4 (Low)      | 0   | 0            | 0    |
| **Total**        | **11**| **11**   | **0**|

---

## BUG-001: Marquee Logo — Elemen DOM Berlebihan

| Field         | Detail |
|---------------|--------|
| **ID**        | BUG-001 |
| **Modul**     | Beranda — Marquee Section |
| **Severity**  | Sev-3 (Medium) |
| **Priority**  | P1 |
| **Status**    | ✅ FIXED |
| **Fix Commit**| Perbaikan pada `src/app/page.tsx` |

**Deskripsi**:  
Logo instansi (DKI, PUPR, Dishub, DLH) diulang 8 kali per set → 2 set = **64 elemen `<img>`** di DOM. Ini memperberat rendering dan menambah jumlah HTTP request gambar yang berulang.

**Langkah Reproduksi**:
1. Buka `/`
2. Jalankan: `document.querySelectorAll('.animate-marquee img').length`
3. Output: `64`

**Root Cause**:
```javascript
// Sebelum — array logos diulang 8x menjadi 32 items per set × 2 set = 64
const repeatedLogos = Array(8).fill(partnerLogos).flat(); // 32 items
// 2 div × 32 items = 64 img elements
```

**Fix Applied**:
```javascript
// Sesudah — langsung gunakan array 4 logo, totalnya 8 img
const partnerLogos = [...]; // 4 logos
// Set 1: 4 img (accessible)
// Set 2: 4 img (aria-hidden="true", alt="" — dekoratif)
```

**Verifikasi**: `document.querySelectorAll('.animate-marquee img').length` → `8` ✅

---

## BUG-002: Halaman `/login-masyarakat` — Berpotensi Blank Screen

| Field         | Detail |
|---------------|--------|
| **ID**        | BUG-002 |
| **Modul**     | Login Masyarakat |
| **Severity**  | Sev-2 (High) |
| **Priority**  | P1 |
| **Status**    | ✅ FIXED |
| **Fix Commit**| Perbaikan pada `src/app/login-masyarakat/page.tsx` |

**Deskripsi**:  
Kondisi `if (loading || currentUser)` menampilkan spinner. Jika `loading` state tidak ter-resolve dalam waktu singkat (karena network lambat atau Supabase lambat), pengguna melihat layar spinner tanpa batas waktu, tanpa fallback ke form login. QA report mencatat halaman "tidak merender konten apapun."

**Langkah Reproduksi**:
1. Buka `/login-masyarakat` dengan koneksi lambat (DevTools Network Throttling)
2. Amati spinner yang tidak kunjung hilang

**Root Cause**:
```tsx
// Sebelum — tidak ada timeout fallback
if (loading || currentUser) {
  return <Spinner />;
}
// Jika loading tidak resolve → blank spinner selamanya
```

**Fix Applied**:
```tsx
// Sesudah — timer 1.5s memaksa form muncul
const [pageReady, setPageReady] = useState(false);
useEffect(() => {
  const timer = setTimeout(() => setPageReady(true), 1500);
  return () => clearTimeout(timer);
}, []);

if ((loading && !pageReady) || currentUser) {
  return <SpinnerWithText text="Memuat Portal Warga..." />;
}
// Form SELALU muncul setelah 1.5s
```

---

## BUG-003: Anchor Links Navbar & Footer — Tidak Berfungsi di Subhalaman

| Field         | Detail |
|---------------|--------|
| **ID**        | BUG-003 |
| **Modul**     | Navbar, Footer |
| **Severity**  | Sev-2 (High) |
| **Priority**  | P1 |
| **Status**    | ✅ FIXED |
| **Fix Commit**| Perbaikan pada `src/components/Navbar.tsx`, `src/components/Footer.tsx` |

**Deskripsi**:  
Link navigasi menggunakan hash anchor tanpa prefix URL (`#info-section`). Di halaman beranda ini berfungsi, namun dari subhalaman `/progress` atau `/kontak-darurat`, link tersebut mencoba scroll ke section yang tidak ada di halaman tersebut, sehingga tidak ada aksi yang terjadi.

**Langkah Reproduksi**:
1. Buka `/progress`
2. Klik "Kegunaan" di navbar
3. Tidak ada yang terjadi (URL tidak berubah, tidak ada scroll)

**Root Cause**:
```html
<!-- Sebelum — hash-only, hanya works di halaman beranda -->
<a href="#info-section">Kegunaan</a>
```

**Fix Applied**:
```html
<!-- Sesudah — full path + hash, works dari halaman manapun -->
<a href="/#info-section">Kegunaan</a>
```

**Halaman yang Diperbaiki**:
- `Navbar.tsx`: Desktop links (baris 71-74) + Mobile links (baris 146-149)
- `Footer.tsx`: Navigation links (baris 23-26)

---

## BUG-004: Material Symbols Icons — Dibaca Screen Reader sebagai Teks Literal

| Field         | Detail |
|---------------|--------|
| **ID**        | BUG-004 |
| **Modul**     | Seluruh Halaman |
| **Severity**  | Sev-2 (High) |
| **Priority**  | P1 |
| **Status**    | ✅ FIXED |
| **Fix Commit**| Perbaikan pada semua halaman dan komponen |

**Deskripsi**:  
Material Symbols Outlined adalah icon font berbasis teks. Tanpa `aria-hidden="true"`, screen reader membaca teks literal seperti "visibility", "map", "verified", "ambulance", "dashboard", dll. Ini membingungkan pengguna dengan gangguan penglihatan.

**Contoh Bug (sebelum perbaikan)**:
```
Screen reader: "visibility Pemantauan Aduan Pantau status... map Database Infrastruktur..."
```

**Seharusnya**:
```
Screen reader: "Pemantauan Aduan Pantau status... Database Infrastruktur..."
```

**Root Cause**:
```tsx
// Sebelum — tanpa aria-hidden
<span className="material-symbols-outlined">visibility</span>
```

**Fix Applied**:
```tsx
// Sesudah — semua ikon dekoratif diberi aria-hidden
<span className="material-symbols-outlined" aria-hidden="true">visibility</span>
```

**File yang Diperbaiki**:
- `Navbar.tsx`: 6 ikon
- `Footer.tsx`: 3 ikon
- `page.tsx`: 11 ikon
- `progress/page.tsx`: 2 ikon
- `kontak-darurat/page.tsx`: 3 ikon
- `login-masyarakat/page.tsx`: 5 ikon

---

## BUG-005: Tombol Menu Hamburger — Tidak Ada Aria-Label

| Field         | Detail |
|---------------|--------|
| **ID**        | BUG-005 |
| **Modul**     | Navbar — Mobile |
| **Severity**  | Sev-2 (High) |
| **Priority**  | P1 |
| **Status**    | ✅ FIXED |
| **Fix Commit**| Perbaikan pada `src/components/Navbar.tsx` |

**Deskripsi**:  
Tombol hamburger hanya menampilkan ikon "menu" tanpa teks atau aria-label. Screen reader membaca "menu" (teks literal ikon) tanpa konteks apa yang dilakukan tombol ini.

**Root Cause**:
```tsx
// Sebelum
<button aria-expanded={mobileMenuOpen}>
  <span className="material-symbols-outlined">{mobileMenuOpen ? 'close' : 'menu'}</span>
</button>
```

**Fix Applied**:
```tsx
// Sesudah
<button
  aria-expanded={mobileMenuOpen}
  aria-label={mobileMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
>
  <span className="material-symbols-outlined" aria-hidden="true">{...}</span>
</button>
```

---

## BUG-006: Statistik Angka — Tidak Ada Semantik

| Field         | Detail |
|---------------|--------|
| **ID**        | BUG-006 |
| **Modul**     | Beranda — Section Dampak Nyata |
| **Severity**  | Sev-3 (Medium) |
| **Priority**  | P2 |
| **Status**    | ✅ FIXED |
| **Fix Commit**| Perbaikan pada `src/app/page.tsx` |

**Deskripsi**:  
Angka statistik "92%", "340+", "15mnt", "15,310" ditampilkan sebagai paragraf `<p>` biasa tanpa konteks semantik. Screen reader tidak dapat mengasosiasikan angka dengan label statistiknya.

**Root Cause**:
```tsx
// Sebelum
<div className="grid grid-cols-2 gap-8">
  <div><p>92%</p><p>Aduan Tuntas</p></div>
```

**Fix Applied**:
```tsx
// Sesudah — menggunakan dl/dt/dd dengan aria-label
<dl className="grid grid-cols-2 gap-8" aria-label="Statistik Pencapaian SIGAP">
  <div><dt>92%</dt><dd>Aduan Tuntas</dd></div>
```

---

## BUG-007: Tiga CTA Card — Mengarah ke URL yang Sama

| Field         | Detail |
|---------------|--------|
| **ID**        | BUG-007 |
| **Modul**     | Beranda — Section Info |
| **Severity**  | Sev-2 (High) |
| **Priority**  | P1 |
| **Status**    | ✅ FIXED |
| **Fix Commit**| Perbaikan pada `src/app/page.tsx` |

**Deskripsi**:  
Tiga card CTA di section "Pelayanan Publik Terpadu" (Tracking Laporan, Lihat Peta Kota, Cek Akuntabilitas) semuanya mengarah ke `/login-masyarakat`. Ini membingungkan pengguna karena teks CTA menjanjikan fungsi yang berbeda.

**Root Cause**: Semua 3 link `href="/login-masyarakat"` identik

**Fix Applied**:
| CTA Text | Sebelum | Sesudah |
|----------|---------|---------|
| Tracking Laporan | `/login-masyarakat` | `/dashboard-pelapor` |
| Lihat Peta Kota | `/login-masyarakat` | `/peta-pelapor` |
| Cek Akuntabilitas | `/login-masyarakat` | `/progress` |

---

## BUG-008: Gambar Progress News — Tidak Ada Lazy Loading

| Field         | Detail |
|---------------|--------|
| **ID**        | BUG-008 |
| **Modul**     | Halaman Progress |
| **Severity**  | Sev-3 (Medium) |
| **Priority**  | P2 |
| **Status**    | ✅ FIXED |
| **Fix Commit**| Perbaikan pada `src/app/progress/page.tsx`, `src/app/kontak-darurat/page.tsx` |

**Deskripsi**:  
Semua gambar di halaman `/progress` (4 gambar news besar) tidak memiliki `loading="lazy"`, menyebabkan semua gambar di-download saat halaman pertama kali dibuka, bahkan yang berada jauh di bawah viewport.

**Fix Applied**:
```tsx
// Sesudah
<img src={news.image} alt={news.title} loading="lazy" className="w-full h-full object-cover" />
```

---

## BUG-009: Title Halaman Subpage — Sama dengan Beranda

| Field         | Detail |
|---------------|--------|
| **ID**        | BUG-009 |
| **Modul**     | SEO — `/progress`, `/kontak-darurat`, `/login-masyarakat` |
| **Severity**  | Sev-2 (High) |
| **Priority**  | P1 |
| **Status**    | ✅ FIXED |
| **Fix Commit**| Tambah `layout.tsx` di masing-masing rute |

**Deskripsi**:  
Halaman subhalaman mewarisi title dari root `layout.tsx` ("SIGAP - Sistem Informasi Gerak Aduan Publik") tanpa override. Setiap halaman seharusnya memiliki title unik untuk SEO.

**Fix Applied**: Membuat `layout.tsx` dengan metadata unik untuk setiap subhalaman:
- `src/app/progress/layout.tsx`
- `src/app/kontak-darurat/layout.tsx`
- `src/app/login-masyarakat/layout.tsx`

---

## BUG-010: Open Graph & Twitter Card Tags — Tidak Ada

| Field         | Detail |
|---------------|--------|
| **ID**        | BUG-010 |
| **Modul**     | SEO — Semua Halaman |
| **Severity**  | Sev-2 (High) |
| **Priority**  | P1 |
| **Status**    | ✅ FIXED |
| **Fix Commit**| Perbaikan pada `src/app/layout.tsx` |

**Deskripsi**:  
Tidak ada Open Graph (`og:title`, `og:description`, `og:image`, `og:url`) dan Twitter Card tags. Saat link dibagikan di WhatsApp, Twitter, atau LinkedIn, tidak muncul preview gambar/deskripsi.

**Fix Applied**: Menambahkan OG dan Twitter metadata lengkap di root `layout.tsx` dan layout per rute.

---

## BUG-011: Sitemap.xml & Robots.txt — Tidak Ada

| Field         | Detail |
|---------------|--------|
| **ID**        | BUG-011 |
| **Modul**     | SEO |
| **Severity**  | Sev-2 (High) |
| **Priority**  | P1 |
| **Status**    | ✅ FIXED |
| **Fix Commit**| Tambah `src/app/sitemap.ts` dan `src/app/robots.ts` |

**Deskripsi**:  
Tidak ada `/sitemap.xml` dan `/robots.txt`. Search engine crawler tidak mendapat panduan halaman mana yang diindex, memperlambat proses indexing dan berpotensi melewatkan halaman penting.

**Fix Applied**: 
- `src/app/sitemap.ts` — menghasilkan sitemap.xml dengan 6 URL
- `src/app/robots.ts` — menghasilkan robots.txt yang mengizinkan crawling publik, memblokir `/admin/` dan `/api/`
