# TEST CASES — Aksesibilitas (a11y)

**Modul**: Aksesibilitas  
**Kode Modul**: A11Y  
**Standar Referensi**: WCAG 2.1 Level AA  
**Dibuat**: 20 Juli 2026  
**Referensi QA Report**: Skor C+, 5 isu ditemukan  

---

## Ringkasan Test Cases

| Total TC | Pass | Fail | Skip |
|----------|------|------|------|
| 15       | 11   | 4    | 0    |

---

## TC-A11Y-001: Aria-Hidden pada Ikon Dekoratif Material Symbols

| Field        | Detail |
|--------------|--------|
| **ID**       | TC-A11Y-001 |
| **Judul**    | Semua ikon Material Symbols dekoratif memiliki aria-hidden="true" |
| **Prioritas**| P1 |
| **Severity** | Sev-2 |
| **Bug Ref**  | BUG-004 |
| **Standar**  | WCAG 4.1.2 — Name, Role, Value |

**Langkah Pengujian**:
1. Buka `/` di Chrome DevTools
2. Jalankan di Console:
   ```javascript
   Array.from(document.querySelectorAll('.material-symbols-outlined'))
     .filter(el => !el.hasAttribute('aria-hidden'))
     .map(el => el.textContent.trim())
   ```
3. Catat semua elemen yang tidak memiliki `aria-hidden`
4. Ulangi untuk `/progress`, `/kontak-darurat`, `/login-masyarakat`

**Expected Result**: Array kosong (`[]`) — semua ikon dekoratif memiliki `aria-hidden="true"`

**Actual Result Sebelum Perbaikan**: ❌ Ditemukan > 20 ikon tanpa `aria-hidden` (visibility, map, verified, ambulance, dll.)  
**Actual Result Sesudah Perbaikan**: ✅ Semua ikon dekoratif memiliki `aria-hidden="true"`

**Status**: ✅ **PASS** (setelah perbaikan)

---

## TC-A11Y-002: Aria-Label pada Tombol Hamburger Mobile

| Field        | Detail |
|--------------|--------|
| **ID**       | TC-A11Y-002 |
| **Judul**    | Tombol hamburger mobile memiliki aria-label yang deskriptif |
| **Prioritas**| P1 |
| **Severity** | Sev-2 |
| **Bug Ref**  | BUG-005 |
| **Standar**  | WCAG 4.1.2 — Name, Role, Value |

**Langkah Pengujian**:
1. Buka `/` di viewport ≤ 768px
2. DevTools → Elements → cari tombol hamburger
3. Periksa atribut `aria-label`

**Expected Result**: Tombol memiliki `aria-label="Buka menu navigasi"` (saat tutup) dan `aria-label="Tutup menu navigasi"` (saat buka)

**Actual Result Sebelum Perbaikan**: ❌ Tidak ada `aria-label` — hanya `aria-expanded`  
**Actual Result Sesudah Perbaikan**: ✅ `aria-label` dinamis sesuai kondisi menu

**Status**: ✅ **PASS** (setelah perbaikan)

---

## TC-A11Y-003: Aria-Label pada Tombol "Masuk Portal"

| Field        | Detail |
|--------------|--------|
| **ID**       | TC-A11Y-003 |
| **Judul**    | Tombol "Masuk Portal" di navbar memiliki aria-label |
| **Prioritas**| P2 |
| **Severity** | Sev-3 |
| **Standar**  | WCAG 4.1.2 — Name, Role, Value |

**Langkah Pengujian**:
1. Buka `/` saat belum login
2. Periksa tombol "Masuk Portal" di navbar desktop
3. Periksa `aria-label` atribut

**Expected Result**: Tombol memiliki `aria-label="Masuk ke portal SIGAP"`

**Actual Result**: ✅ Atribut `aria-label="Masuk ke portal SIGAP"` ada pada kedua tombol (desktop & mobile)

**Status**: ✅ **PASS**

---

## TC-A11Y-004: Struktur Heading Hierarkis

| Field        | Detail |
|--------------|--------|
| **ID**       | TC-A11Y-004 |
| **Judul**    | Setiap halaman memiliki satu H1 dengan hierarki heading yang benar |
| **Prioritas**| P1 |
| **Severity** | Sev-2 |
| **Standar**  | WCAG 1.3.1 — Info and Relationships |

**Langkah Pengujian**:
1. Buka `/` di Chrome
2. Jalankan di Console:
   ```javascript
   Array.from(document.querySelectorAll('h1,h2,h3,h4'))
     .map(el => `${el.tagName}: ${el.textContent.trim().slice(0,50)}`)
   ```
3. Ulangi untuk `/progress`, `/kontak-darurat`

**Expected Result**: 
- Tepat satu `H1` per halaman
- `H2` muncul setelah `H1` (tidak melompat dari H1 ke H3)

**Actual Result**: ✅ Setiap halaman memiliki tepat satu `H1`, hierarki H2/H3/H4 benar

**Status**: ✅ **PASS**

---

## TC-A11Y-005: Alt Text pada Gambar

| Field        | Detail |
|--------------|--------|
| **ID**       | TC-A11Y-005 |
| **Judul**    | Semua gambar informatif memiliki alt text yang deskriptif |
| **Prioritas**| P1 |
| **Severity** | Sev-2 |
| **Standar**  | WCAG 1.1.1 — Non-text Content |

**Langkah Pengujian**:
1. Buka setiap halaman di Chrome
2. Jalankan: `Array.from(document.querySelectorAll('img')).filter(i => !i.alt && !i.closest('[aria-hidden]')).map(i => i.src)`
3. Catat semua gambar informatif tanpa alt text

**Expected Result**: Tidak ada gambar informatif tanpa alt text; gambar dekoratif boleh `alt=""`

**Actual Result**: ✅ Logo SIGAP memiliki `alt="Logo SIGAP"`, logo instansi memiliki alt nama instansi, duplikat dekoratif `alt=""`

**Status**: ✅ **PASS**

---

## TC-A11Y-006: Semantik Statistik — dl/dt/dd

| Field        | Detail |
|--------------|--------|
| **ID**       | TC-A11Y-006 |
| **Judul**    | Blok statistik beranda menggunakan elemen semantik dl/dt/dd |
| **Prioritas**| P2 |
| **Severity** | Sev-3 |
| **Bug Ref**  | BUG-006 |
| **Standar**  | WCAG 1.3.1 — Info and Relationships |

**Langkah Pengujian**:
1. Buka `/` dan scroll ke section "Dampak Nyata"
2. DevTools → Elements → periksa struktur elemen statistik
3. Periksa ada `<dl aria-label="Statistik Pencapaian SIGAP">` dengan `<dt>` dan `<dd>`

**Expected Result**: 
```html
<dl aria-label="Statistik Pencapaian SIGAP">
  <div><dt>92%</dt><dd>Aduan Tuntas</dd></div>
  ...
</dl>
```

**Actual Result Sebelum Perbaikan**: ❌ Menggunakan `<div><p>92%</p><p>Aduan Tuntas</p></div>`  
**Actual Result Sesudah Perbaikan**: ✅ Menggunakan `<dl>`, `<dt>`, `<dd>` dengan `aria-label`

**Status**: ✅ **PASS** (setelah perbaikan)

---

## TC-A11Y-007: Kontras Warna Teks

| Field        | Detail |
|--------------|--------|
| **ID**       | TC-A11Y-007 |
| **Judul**    | Rasio kontras warna teks memenuhi WCAG AA (minimum 4.5:1 untuk teks normal) |
| **Prioritas**| P2 |
| **Severity** | Sev-3 |
| **Standar**  | WCAG 1.4.3 — Contrast (Minimum) |

**Langkah Pengujian**:
1. Gunakan Chrome DevTools Accessibility → Color Picker pada:
   - Teks utama (`text-slate-800` on white)
   - Teks sekunder (`text-slate-500` on white)
   - Teks badge primary (`text-white` on `bg-primary`)
2. Catat rasio kontras

**Expected Result**: Semua teks body memiliki rasio kontras ≥ 4.5:1; teks besar ≥ 3:1

**Actual Result**: ✅ `text-slate-800` (~7.5:1 ✅), `text-slate-500` (~4.6:1 ✅), `text-white on bg-primary (#001360)` (~15:1 ✅)

**Status**: ✅ **PASS**

---

## TC-A11Y-008: Focus Management & Keyboard Navigation

| Field        | Detail |
|--------------|--------|
| **ID**       | TC-A11Y-008 |
| **Judul**    | Semua elemen interaktif dapat diakses menggunakan keyboard (Tab navigation) |
| **Prioritas**| P1 |
| **Severity** | Sev-2 |
| **Standar**  | WCAG 2.1.1 — Keyboard |

**Langkah Pengujian**:
1. Buka `/login-masyarakat`
2. Tekan Tab berulang kali dari awal halaman
3. Periksa urutan focus: Link logo → Form email → Form password → Checkbox → Tombol submit → Tombol Google → Link Daftar → Link kembali

**Expected Result**: Setiap elemen interaktif dapat difocus dengan Tab; focus indicator terlihat

**Actual Result**: ✅ Semua elemen interaktif dapat difocus secara berurutan; focus ring terlihat (dari Tailwind focus:ring utilities)

**Status**: ✅ **PASS**

---

## TC-A11Y-009: Aria-Label pada Show Password Button

| Field        | Detail |
|--------------|--------|
| **ID**       | TC-A11Y-009 |
| **Judul**    | Tombol show/hide password memiliki aria-label yang deskriptif |
| **Prioritas**| P2 |
| **Severity** | Sev-3 |
| **Standar**  | WCAG 4.1.2 — Name, Role, Value |

**Langkah Pengujian**:
1. Buka `/login-masyarakat`
2. Periksa tombol visibility di field kata sandi
3. Cek `aria-label`-nya

**Expected Result**: `aria-label="Tampilkan kata sandi"` saat tersembunyi, `aria-label="Sembunyikan kata sandi"` saat terlihat

**Actual Result**: ✅ `aria-label` dinamis sudah diterapkan

**Status**: ✅ **PASS**

---

## TC-A11Y-010: Screen Reader Test — Ikon Tidak Dibacakan

| Field        | Detail |
|--------------|--------|
| **ID**       | TC-A11Y-010 |
| **Judul**    | Screen reader tidak membaca teks ikon Material Symbols ("visibility", "map", "ambulance") |
| **Prioritas**| P1 |
| **Severity** | Sev-2 |
| **Standar**  | WCAG 4.1.2 — Name, Role, Value |

**Alat**: NVDA (Windows) atau VoiceOver (Mac)

**Langkah Pengujian**:
1. Aktifkan NVDA Screen Reader
2. Buka `/`
3. Navigasi menggunakan Tab dan dengarkan output
4. Periksa apakah kata "visibility", "map", "verified" dibacakan

**Expected Result**: Ikon tidak dibacakan oleh screen reader; hanya teks yang bermakna dibacakan

**Actual Result**: ✅ Semua ikon memiliki `aria-hidden="true"`, tidak dibacakan screen reader

**Status**: ✅ **PASS** (setelah perbaikan)

---

## TC-A11Y-011: Link CTA — Tujuan yang Berbeda per Aksi

| Field        | Detail |
|--------------|--------|
| **ID**       | TC-A11Y-011 |
| **Judul**    | Tiga CTA card mengarah ke URL yang berbeda sesuai fungsinya |
| **Prioritas**| P1 |
| **Severity** | Sev-2 |
| **Bug Ref**  | BUG-007 |
| **Standar**  | WCAG 2.4.4 — Link Purpose |

**Langkah Pengujian**:
1. Buka `/` → scroll ke section "Pelayanan Publik Terpadu"
2. Hover/Inspect link "Tracking Laporan" → periksa `href`
3. Hover/Inspect link "Lihat Peta Kota" → periksa `href`
4. Hover/Inspect link "Cek Akuntabilitas" → periksa `href`

**Expected Result**:
- "Tracking Laporan" → `/dashboard-pelapor`
- "Lihat Peta Kota" → `/peta-pelapor`
- "Cek Akuntabilitas" → `/progress`

**Actual Result Sebelum Perbaikan**: ❌ Ketiga CTA mengarah ke `/login-masyarakat` yang sama  
**Actual Result Sesudah Perbaikan**: ✅ Setiap CTA mengarah ke URL sesuai fungsinya

**Status**: ✅ **PASS** (setelah perbaikan)

---

## TC-A11Y-012: Form Labels Terhubung dengan Input

| Field        | Detail |
|--------------|--------|
| **ID**       | TC-A11Y-012 |
| **Judul**    | Setiap form input memiliki label yang terhubung secara programatik |
| **Prioritas**| P1 |
| **Severity** | Sev-2 |
| **Standar**  | WCAG 1.3.1 — Info and Relationships |

**Langkah Pengujian**:
1. Buka `/login-masyarakat`
2. Jalankan: `Array.from(document.querySelectorAll('input')).map(i => ({type: i.type, label: document.querySelector('[for="'+i.id+'"]')?.textContent}))`

**Expected Result**: Setiap input memiliki `id` yang cocok dengan `for` pada `<label>`

**Actual Result**: ✅ Checkbox "Ingat sesi" terhubung dengan `htmlFor="remember"`, input email & password memiliki label

**Status**: ✅ **PASS**

---

## TC-A11Y-013: Landmark Regions

| Field        | Detail |
|--------------|--------|
| **ID**       | TC-A11Y-013 |
| **Judul**    | Halaman memiliki landmark HTML5 yang benar (nav, main, footer) |
| **Prioritas**| P2 |
| **Severity** | Sev-3 |
| **Standar**  | WCAG 1.3.6 — Identify Purpose |

**Langkah Pengujian**:
1. Buka `/progress`
2. Jalankan: `['nav', 'main', 'footer', 'header', 'section'].map(t => ({tag: t, count: document.querySelectorAll(t).length}))`

**Expected Result**: Ada minimal 1 `<nav>`, 1 `<main>`, 1 `<footer>`; `<header>` digunakan di dalam `<main>`

**Actual Result**: ✅ `nav` (1), `main` (1), `footer` (1), `header` (1 di dalam main), `section` (2)

**Status**: ✅ **PASS**

---

## TC-A11Y-014: Logo Duplikat Marquee — Screen Reader

| Field        | Detail |
|--------------|--------|
| **ID**       | TC-A11Y-014 |
| **Judul**    | Logo duplikat marquee tidak menambah noise bagi screen reader |
| **Prioritas**| P2 |
| **Severity** | Sev-3 |
| **Bug Ref**  | BUG-004 |
| **Standar**  | WCAG 4.1.2 — Name, Role, Value |

**Langkah Pengujian**:
1. Buka `/` 
2. DevTools → Accessibility tree
3. Periksa elemen marquee duplikat

**Expected Result**: Div duplikat marquee tidak muncul dalam accessibility tree (karena `aria-hidden="true"`)

**Actual Result**: ✅ Div duplikat dengan `aria-hidden="true"` tidak tampil di accessibility tree

**Status**: ✅ **PASS** (setelah perbaikan)

---

## TC-A11Y-015: Axe-Core Automated Scan

| Field        | Detail |
|--------------|--------|
| **ID**       | TC-A11Y-015 |
| **Judul**    | Automated scan axe-core tidak menemukan critical/serious violations |
| **Prioritas**| P1 |
| **Severity** | Sev-2 |
| **Standar**  | WCAG 2.1 AA |

**Alat**: Playwright + axe-core (lihat `4-automation/tests/aksesibilitas.spec.ts`)

**Langkah Pengujian**:
1. Jalankan: `npx playwright test tests/aksesibilitas.spec.ts`
2. Review HTML report

**Expected Result**: 0 violations dengan impact "critical" atau "serious"

**Actual Result**: ✅ 0 critical violations sesudah perbaikan (sebelumnya ada 5 violations)

**Status**: ✅ **PASS** (setelah perbaikan)
