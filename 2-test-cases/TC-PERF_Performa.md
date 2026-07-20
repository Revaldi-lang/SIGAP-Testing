# TEST CASES — Performa & Load

**Modul**: Performa  
**Kode Modul**: PERF  
**Dibuat**: 20 Juli 2026  
**Referensi QA Report**: Skor B+, 2 isu ditemukan  

---

## Ringkasan Test Cases

| Total TC | Pass | Fail | Skip |
|----------|------|------|------|
| 10       | 8    | 2    | 0    |

---

## TC-PERF-001: Vercel CDN & HTTPS

| Field        | Detail |
|--------------|--------|
| **ID**       | TC-PERF-001 |
| **Judul**    | Aplikasi dihosting di Vercel dengan CDN global dan HTTPS |
| **Prioritas**| P1 |
| **Severity** | Sev-1 |

**Langkah Pengujian**:
1. Buka https://sigap-liard.vercel.app di browser
2. Periksa ikon gembok di address bar
3. Klik gembok → periksa sertifikat SSL
4. Buka DevTools → Network → periksa response header `X-Vercel-Cache`

**Expected Result**: Koneksi HTTPS, sertifikat valid, header `X-Vercel-Cache: HIT` pada asset statis

**Actual Result**: ✅ HTTPS aktif, sertifikat valid (Vercel), CDN cache aktif

**Status**: ✅ **PASS**

---

## TC-PERF-002: DOM Element Count — Batas Wajar

| Field        | Detail |
|--------------|--------|
| **ID**       | TC-PERF-002 |
| **Judul**    | Jumlah total elemen DOM di beranda tidak melebihi 1500 node |
| **Prioritas**| P2 |
| **Severity** | Sev-3 |
| **Bug Ref**  | BUG-001 |

**Langkah Pengujian**:
1. Buka `/`
2. DevTools → Console → jalankan: `document.querySelectorAll('*').length`
3. Catat jumlahnya

**Expected Result**: Jumlah total DOM nodes ≤ 1500 (Google rekomendasi < 1500 untuk performa optimal)

**Actual Result Sebelum Perbaikan**: ❌ ~1800+ node (akibat 64 elemen img logo)  
**Actual Result Sesudah Perbaikan**: ✅ ~850 node

**Status**: ✅ **PASS** (setelah perbaikan)

---

## TC-PERF-003: Gambar Below-Fold — Lazy Loading

| Field        | Detail |
|--------------|--------|
| **ID**       | TC-PERF-003 |
| **Judul**    | Gambar di bawah viewport memiliki atribut loading="lazy" |
| **Prioritas**| P1 |
| **Severity** | Sev-3 |
| **Bug Ref**  | BUG-008 |

**Langkah Pengujian**:
1. Buka `/progress`
2. Jalankan: `Array.from(document.querySelectorAll('img')).filter(i => !i.loading || i.loading !== 'lazy').map(i => i.src)`
3. Periksa semua gambar news artikel
4. Ulangi untuk `/kontak-darurat`

**Expected Result**: Semua gambar berita di `/progress` memiliki `loading="lazy"`; logo instansi di kontak darurat juga lazy

**Actual Result Sebelum Perbaikan**: ❌ Tidak ada atribut `loading` pada gambar news  
**Actual Result Sesudah Perbaikan**: ✅ `loading="lazy"` ditambahkan pada semua gambar

**Status**: ✅ **PASS** (setelah perbaikan)

---

## TC-PERF-004: Network Requests — Gambar Redundan

| Field        | Detail |
|--------------|--------|
| **ID**       | TC-PERF-004 |
| **Judul**    | Tidak ada gambar logo yang dimuat lebih dari 2 kali di beranda |
| **Prioritas**| P2 |
| **Severity** | Sev-3 |

**Langkah Pengujian**:
1. Buka `/` dengan DevTools → Network tab (clear & reload)
2. Filter: Img
3. Hitung berapa kali `logo_dki.png` muncul di requests

**Expected Result**: Setiap gambar logo dimuat maksimum sekali (browser cache menangani duplikat)

**Actual Result**: ✅ Setiap logo di-request sekali; browser cache `200 (cache)` untuk penggunaan berulang

**Status**: ✅ **PASS**

---

## TC-PERF-005: Lighthouse Performance Score

| Field        | Detail |
|--------------|--------|
| **ID**       | TC-PERF-005 |
| **Judul**    | Lighthouse Performance score beranda minimal 70/100 |
| **Prioritas**| P2 |
| **Severity** | Sev-3 |

**Alat**: Chrome DevTools → Lighthouse

**Langkah Pengujian**:
1. Buka `/` di Chrome (mode Incognito, tanpa ekstensi)
2. DevTools → Lighthouse → pilih "Performance" → Analyze page load
3. Catat skor Performance

**Expected Result**: Skor Performance ≥ 70/100

**Actual Result**: ✅ Skor Performance ~74/100 (mobile); ~89/100 (desktop)

**Status**: ✅ **PASS**

---

## TC-PERF-006: First Contentful Paint (FCP)

| Field        | Detail |
|--------------|--------|
| **ID**       | TC-PERF-006 |
| **Judul**    | First Contentful Paint (FCP) kurang dari 2.5 detik |
| **Prioritas**| P2 |
| **Severity** | Sev-3 |

**Langkah Pengujian**:
1. Buka Lighthouse di `/`
2. Catat nilai FCP

**Expected Result**: FCP ≤ 2.5 detik (Good range)

**Actual Result**: ✅ FCP ~1.8s (desktop), ~2.1s (mobile Slow 4G)

**Status**: ✅ **PASS**

---

## TC-PERF-007: Font Loading — Material Symbols

| Field        | Detail |
|--------------|--------|
| **ID**       | TC-PERF-007 |
| **Judul**    | Font Material Symbols Outlined dimuat dari Google Fonts tanpa FOIT |
| **Prioritas**| P2 |
| **Severity** | Sev-4 |

**Langkah Pengujian**:
1. Buka `/` dan langsung scroll ke area ikon
2. Perhatikan apakah ikon sempat tidak muncul (Flash of Invisible Text)

**Expected Result**: Ikon tampil dengan baik, `display=swap` mencegah FOIT parah

**Actual Result**: ✅ Font dimuat dengan `display=swap`, ikon tampil setelah font terpasang

**Status**: ✅ **PASS**

---

## TC-PERF-008: Asset Gambar — Self-Hosted

| Field        | Detail |
|--------------|--------|
| **ID**       | TC-PERF-008 |
| **Judul**    | Asset gambar utama di-host sendiri (bukan CDN eksternal pihak ketiga) |
| **Prioritas**| P3 |
| **Severity** | Sev-4 |

**Langkah Pengujian**:
1. DevTools → Network → Filter Img
2. Periksa domain sumber gambar-gambar utama (logo, kategori)

**Expected Result**: Gambar utama berasal dari domain Vercel/Supabase, bukan CDN pihak ketiga yang tidak terkontrol

**Actual Result**: ✅ Semua gambar utama dari `/assets/images/` (self-hosted di Vercel); Google logo di login menggunakan CDN Flaticon (acceptable)

**Status**: ✅ **PASS**

---

## TC-PERF-009: CSS Bundle Size

| Field        | Detail |
|--------------|--------|
| **ID**       | TC-PERF-009 |
| **Judul**    | Bundle CSS tidak melebihi 100KB (compressed) |
| **Prioritas**| P3 |
| **Severity** | Sev-4 |

**Langkah Pengujian**:
1. DevTools → Network → Filter CSS
2. Periksa ukuran file CSS utama

**Expected Result**: CSS bundle ≤ 100KB (gzipped)

**Actual Result**: ✅ CSS bundle ~28KB gzipped (Tailwind purged)

**Status**: ✅ **PASS**

---

## TC-PERF-010: JavaScript Bundle Size

| Field        | Detail |
|--------------|--------|
| **ID**       | TC-PERF-010 |
| **Judul**    | Bundle JS utama tidak melebihi 500KB (compressed) |
| **Prioritas**| P3 |
| **Severity** | Sev-4 |

**Langkah Pengujian**:
1. `npm run build` → lihat output bundle size
2. Atau DevTools → Network → Filter JS → periksa chunk utama

**Expected Result**: JS bundle utama ≤ 500KB (gzipped)

**Actual Result**: ✅ Chunk utama ~156KB gzipped

**Status**: ✅ **PASS**
