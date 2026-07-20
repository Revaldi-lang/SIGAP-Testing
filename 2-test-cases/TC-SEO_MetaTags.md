# TEST CASES — SEO & Meta Tags

**Modul**: SEO & Meta Tags  
**Kode Modul**: SEO  
**Dibuat**: 20 Juli 2026  
**Referensi QA Report**: Skor B, 3 isu ditemukan  

---

## Ringkasan Test Cases

| Total TC | Pass | Fail | Skip |
|----------|------|------|------|
| 12       | 8    | 4    | 0    |

---

## TC-SEO-001: Title Tag — Beranda

| Field        | Detail |
|--------------|--------|
| **ID**       | TC-SEO-001 |
| **Judul**    | Halaman beranda memiliki title tag yang deskriptif |
| **Prioritas**| P1 |
| **Severity** | Sev-2 |

**Langkah Pengujian**:
1. Buka `/`
2. DevTools → Elements → `<head>` → cari `<title>`
3. Atau: `document.title` di Console

**Expected Result**: `"SIGAP - Sistem Informasi Gerak Aduan Publik"`

**Actual Result**: ✅ Title sesuai

**Status**: ✅ **PASS**

---

## TC-SEO-002: Meta Description — Beranda

| Field        | Detail |
|--------------|--------|
| **ID**       | TC-SEO-002 |
| **Judul**    | Halaman beranda memiliki meta description yang deskriptif (50-160 karakter) |
| **Prioritas**| P1 |
| **Severity** | Sev-2 |

**Langkah Pengujian**:
1. Buka `/`
2. Jalankan: `document.querySelector('meta[name="description"]')?.content`

**Expected Result**: Description antara 50-160 karakter, deskriptif tentang SIGAP

**Actual Result**: ✅ `"Portal Resmi Pelayanan Pengaduan & Aspirasi Infrastruktur Daerah Terintegrasi"` (76 karakter)

**Status**: ✅ **PASS**

---

## TC-SEO-003: Title Unik per Halaman

| Field        | Detail |
|--------------|--------|
| **ID**       | TC-SEO-003 |
| **Judul**    | Halaman /progress dan /kontak-darurat memiliki title yang unik (berbeda dari beranda) |
| **Prioritas**| P1 |
| **Severity** | Sev-2 |
| **Bug Ref**  | BUG-009 |

**Langkah Pengujian**:
1. Buka `/progress` → `document.title`
2. Buka `/kontak-darurat` → `document.title`
3. Buka `/login-masyarakat` → `document.title`
4. Bandingkan dengan title beranda

**Expected Result**:
- `/progress`: `"Progres & Pembenahan Infrastruktur | SIGAP"`
- `/kontak-darurat`: `"Direktori Kontak Darurat Indonesia | SIGAP"`
- `/login-masyarakat`: `"Portal Warga & Pelapor | SIGAP"`

**Actual Result Sebelum Perbaikan**: ❌ Semua halaman memiliki title yang sama dari root layout  
**Actual Result Sesudah Perbaikan**: ✅ Setiap halaman memiliki title unik via `layout.tsx` per rute

**Status**: ✅ **PASS** (setelah perbaikan)

---

## TC-SEO-004: Open Graph Tags — Beranda

| Field        | Detail |
|--------------|--------|
| **ID**       | TC-SEO-004 |
| **Judul**    | Halaman beranda memiliki OG tags yang lengkap |
| **Prioritas**| P1 |
| **Severity** | Sev-2 |
| **Bug Ref**  | BUG-010 |

**Langkah Pengujian**:
1. Buka `/`
2. Jalankan:
   ```javascript
   ['og:title','og:description','og:image','og:url','og:type'].map(p => 
     ({property: p, content: document.querySelector(`meta[property="${p}"]`)?.content})
   )
   ```

**Expected Result**:
- `og:title`: Terisi
- `og:description`: Terisi
- `og:image`: URL gambar valid
- `og:url`: URL produksi
- `og:type`: `website`

**Actual Result Sebelum Perbaikan**: ❌ Tidak ada OG tags  
**Actual Result Sesudah Perbaikan**: ✅ Semua 5 OG tags terisi

**Status**: ✅ **PASS** (setelah perbaikan)

---

## TC-SEO-005: Twitter Card Tags

| Field        | Detail |
|--------------|--------|
| **ID**       | TC-SEO-005 |
| **Judul**    | Halaman memiliki Twitter Card meta tags |
| **Prioritas**| P2 |
| **Severity** | Sev-3 |
| **Bug Ref**  | BUG-010 |

**Langkah Pengujian**:
1. Buka `/`
2. Jalankan: `['twitter:card','twitter:title','twitter:description','twitter:image'].map(n => ({name: n, content: document.querySelector('meta[name="'+n+'"]')?.content}))`

**Expected Result**: Semua Twitter Card tags terisi dengan nilai yang relevan

**Actual Result**: ✅ Twitter Card tags hadir: `summary_large_image`, title, description, image

**Status**: ✅ **PASS** (setelah perbaikan)

---

## TC-SEO-006: Sitemap.xml

| Field        | Detail |
|--------------|--------|
| **ID**       | TC-SEO-006 |
| **Judul**    | Sitemap.xml dapat diakses dan berisi semua URL utama |
| **Prioritas**| P1 |
| **Severity** | Sev-2 |
| **Bug Ref**  | BUG-011 |

**Langkah Pengujian**:
1. Buka `https://sigap-liard.vercel.app/sitemap.xml` (atau `localhost:3000/sitemap.xml` saat dev)
2. Periksa format XML dan daftar URL
3. Verifikasi semua rute utama ada

**Expected Result**: XML valid berisi minimal: `/`, `/progress`, `/kontak-darurat`, `/login-masyarakat`, `/buat-laporan`, `/peta-pelapor`

**Actual Result Sebelum Perbaikan**: ❌ `/sitemap.xml` mengembalikan 404  
**Actual Result Sesudah Perbaikan**: ✅ Sitemap valid dengan 6 URL terdaftar

**Status**: ✅ **PASS** (setelah perbaikan)

---

## TC-SEO-007: Robots.txt

| Field        | Detail |
|--------------|--------|
| **ID**       | TC-SEO-007 |
| **Judul**    | Robots.txt dapat diakses dan mengizinkan crawling halaman publik |
| **Prioritas**| P1 |
| **Severity** | Sev-2 |
| **Bug Ref**  | BUG-011 |

**Langkah Pengujian**:
1. Buka `https://sigap-liard.vercel.app/robots.txt`
2. Periksa direktif `User-agent`, `Allow`, `Disallow`, `Sitemap`

**Expected Result**:
```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Sitemap: https://sigap-liard.vercel.app/sitemap.xml
```

**Actual Result Sebelum Perbaikan**: ❌ 404  
**Actual Result Sesudah Perbaikan**: ✅ robots.txt valid sesuai expected

**Status**: ✅ **PASS** (setelah perbaikan)

---

## TC-SEO-008: Canonical URL

| Field        | Detail |
|--------------|--------|
| **ID**       | TC-SEO-008 |
| **Judul**    | Halaman memiliki canonical URL yang benar |
| **Prioritas**| P2 |
| **Severity** | Sev-3 |

**Langkah Pengujian**:
1. Buka `/`
2. Jalankan: `document.querySelector('link[rel="canonical"]')?.href`

**Expected Result**: Canonical mengarah ke URL produksi https://sigap-liard.vercel.app/

**Actual Result**: ✅ Canonical URL ter-generate otomatis oleh Next.js `metadataBase`

**Status**: ✅ **PASS**

---

## TC-SEO-009: Heading H1 — Satu per Halaman

| Field        | Detail |
|--------------|--------|
| **ID**       | TC-SEO-009 |
| **Judul**    | Setiap halaman memiliki tepat satu H1 yang mengandung kata kunci relevan |
| **Prioritas**| P1 |
| **Severity** | Sev-2 |

**Langkah Pengujian**:
1. Buka setiap halaman
2. Jalankan: `document.querySelectorAll('h1').length`
3. Periksa teks H1

**Expected Result**: Tepat 1 H1 per halaman; H1 beranda mengandung "SIGAP"

**Actual Result**:
- `/`: 1 H1 — "SIGAP Hadir Untuk Warga" ✅
- `/progress`: 1 H1 — "Progres & Pembenahan Fasilitas Publik" ✅
- `/kontak-darurat`: 1 H1 — "Kontak Darurat Indonesia" ✅

**Status**: ✅ **PASS**

---

## TC-SEO-010: OG Image Valid & Accessible

| Field        | Detail |
|--------------|--------|
| **ID**       | TC-SEO-010 |
| **Judul**    | URL OG image dapat diakses (tidak 404) |
| **Prioritas**| P2 |
| **Severity** | Sev-3 |

**Langkah Pengujian**:
1. Ambil nilai `og:image` dari head
2. Buka URL tersebut di browser tab baru

**Expected Result**: Gambar dapat ditampilkan (HTTP 200)

**Actual Result**: ✅ `/assets/images/sigap.png` dapat diakses, HTTP 200

**Status**: ✅ **PASS**

---

## TC-SEO-011: Lang Attribute pada HTML

| Field        | Detail |
|--------------|--------|
| **ID**       | TC-SEO-011 |
| **Judul**    | Elemen `<html>` memiliki atribut `lang="id"` |
| **Prioritas**| P2 |
| **Severity** | Sev-3 |

**Langkah Pengujian**:
1. DevTools → Elements → `<html>` tag
2. Periksa atribut `lang`

**Expected Result**: `<html lang="id">` — bahasa Indonesia

**Actual Result**: ✅ `lang="id"` sudah ada di root layout

**Status**: ✅ **PASS**

---

## TC-SEO-012: Lighthouse SEO Score

| Field        | Detail |
|--------------|--------|
| **ID**       | TC-SEO-012 |
| **Judul**    | Lighthouse SEO score minimal 90/100 |
| **Prioritas**| P1 |
| **Severity** | Sev-2 |

**Alat**: Chrome Lighthouse

**Langkah Pengujian**:
1. DevTools → Lighthouse → pilih "SEO" → Analyze
2. Catat skor SEO

**Expected Result**: SEO ≥ 90/100

**Actual Result Sebelum Perbaikan**: ~75/100 (tidak ada OG, sitemap, title unik)  
**Actual Result Sesudah Perbaikan**: ✅ ~95/100

**Status**: ✅ **PASS** (setelah perbaikan)
