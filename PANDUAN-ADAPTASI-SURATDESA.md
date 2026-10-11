# Panduan Adaptasi SuratDesa ke PMKM-23-IT-BOS

Panduan ini menjelaskan cara memindahkan landing page SuratDesa dari HTML/CSS/JavaScript statis ke struktur Next.js yang tersedia di folder ini. Acuan visual dan aksesibilitas utama adalah [DESIGN-it-2023.md](./DESIGN-it-2023.md).

## 1. Kondisi struktur saat ini

Project ini sudah memiliki fondasi yang sesuai dengan DESIGN-it-2023:

```text
app/
  globals.css              # token warna, type scale, radius, motion, accessibility
  layout.tsx               # font dan root layout
  page.tsx                 # entry point saat ini
  docs/                    # halaman dokumentasi template
components/
  ui/                      # primitive shadcn/ui
  candidates/              # pola siap pakai, termasuk sign-in
  iconiq/                  # komponen alternatif/iconiq
  search-pill.tsx          # pola pencarian lookup
  status.tsx               # StatusTag dan SuccessBand
  step-card.tsx            # kartu langkah
  form-field.tsx           # field dengan label, hint, error
lib/
  ...                      # helper teruji
```

`app/page.tsx` masih mengarahkan pengguna ke `/docs`. Landing page SuratDesa sebaiknya menggantikan redirect ini setelah komponen utama selesai.

## 2. Target struktur route

Gunakan route App Router berikut:

```text
app/
  page.tsx                 # landing page warga
  login/
    page.tsx               # login staf desa
  status/
    page.tsx               # halaman lookup, jika ingin URL terpisah
  privasi/
    page.tsx               # kebijakan privasi
  syarat/
    page.tsx               # syarat dan ketentuan
```

Status tracker dapat tetap menjadi section di halaman utama. Buat `app/status/page.tsx` hanya jika status perlu dibagikan lewat URL atau ditangani sebagai halaman mandiri.

## 3. Mapping dari HTML lama ke komponen project

| Bagian SuratDesa | Komponen/pola yang digunakan |
|---|---|
| Navbar sticky | `components/candidates/app-nav.tsx` atau `components/ui/navigation-menu.tsx`, dengan class `material-bar` |
| Tombol umum | `components/ui/button.tsx` |
| Badge hero | `components/ui/badge.tsx` |
| Preview surat | `components/ui/card.tsx` |
| Alur 3 langkah | `components/step-card.tsx` |
| Video tutorial | `Card` + tombol `Button` + icon dari `lucide-react` |
| Cek status | `components/search-pill.tsx` |
| Status badge | `components/status.tsx` dengan tone `info`, `success`, atau `warning` |
| Timeline status | `components/status-tracker.tsx` atau komponen lokal berbasis status |
| FAQ | `components/ui/accordion.tsx` |
| Login staf | `components/candidates/sign-in.tsx` atau `components/form-field.tsx` + `Button` |
| Sponsor footer | `Card`/`Avatar` atau logo `<Image>` dengan alt yang benar |

Jangan menyalin seluruh CSS dari `index.html`. Gunakan class Tailwind dan token yang sudah tersedia di `app/globals.css`.

## 4. Urutan implementasi yang disarankan

### Langkah 1 — Pindahkan token dan layout

Jangan membuat token warna baru. Gunakan token yang sudah didefinisikan:

```tsx
<main className="min-h-screen bg-background text-body">
  <section className="rounded-2xl bg-canvas px-6 py-16">
    ...
  </section>
</main>
```

Token penting:

- `bg-background` untuk putih.
- `bg-canvas` untuk band abu-abu.
- `text-heading` untuk navy.
- `text-body` untuk teks utama.
- `text-muted-foreground` untuk teks sekunder.
- `bg-secondary` untuk satu CTA utama.
- `border-border` untuk hairline.
- `shadow-float` hanya untuk elemen yang mengambang.
- `rounded-lg`, `rounded-xl`, `rounded-2xl`, dan `rounded-full`.

### Langkah 2 — Buat komponen navbar

Navbar perlu:

- Memakai `.material-bar`.
- Sticky dan memiliki radius `rounded-2xl`.
- Menampilkan link `Beranda`, `Alur Layanan`, `Panduan Video`, `Cek Status`, dan `FAQ`.
- Memiliki state aktif melalui `aria-current`.
- Menjadi menu mobile dengan target minimal 44px.
- Mengarahkan tombol `Akses Staf Desa` ke `/login`.

Gunakan icon dari `lucide-react`, bukan inline SVG manual:

```tsx
import { Menu, Leaf } from "lucide-react";
```

Icon dekoratif harus memiliki `aria-hidden="true"`. Icon-only button harus memiliki `aria-label`.

### Langkah 3 — Buat hero

Struktur yang disarankan:

```tsx
<section id="beranda" className="relative overflow-hidden py-32">
  <div className="mx-auto max-w-[1200px] px-6 text-center">
    <Badge variant="soft">Layanan Mandiri Resmi Warga Desa</Badge>
    <h1 className="mt-5 text-3xl font-bold text-heading">
      Urus Surat Administrasi Desa Langsung dari Rumah
    </h1>
    <p className="mx-auto mt-4 max-w-prose text-body">
      Gratis, transparan, dan biasanya selesai dalam 1 hari kerja.
    </p>
    <div className="mt-7 flex flex-wrap justify-center gap-4">
      <Button size="default">Ajukan Surat Baru</Button>
      <Button variant="link">Pelajari Persyaratan</Button>
    </div>
  </div>
</section>
```

Dekorasi laptop atau gambar hero harus:

- `aria-hidden`.
- Berada di layer background.
- Tidak menutupi teks.
- Tidak menambah horizontal overflow pada lebar 360px.
- Tidak menggunakan animasi bounce atau infinite float.

### Langkah 4 — Pindahkan alur layanan

Gunakan tiga `StepCard` dengan copy sentence case:

1. Pilih jenis surat dan isi form.
2. Verifikasi petugas desa.
3. Unduh PDF atau ambil cetakan.

Band menggunakan:

```tsx
<section className="rounded-2xl bg-canvas p-6 md:p-16">
```

Berikan padding internal yang cukup agar kartu pertama dan terakhir tidak menempel ke tepi band.

### Langkah 5 — Pindahkan lookup status

Gunakan pola `SearchPill`:

```tsx
<SearchPill
  name="application-number"
  placeholder="Masukkan nomor pengajuan, misal: SD-2410-0142"
  buttonLabel="Cek status"
/>
```

Hasil lookup harus memiliki:

- StatusTag dengan icon dan teks.
- Timeline singkat.
- State loading/pending.
- State nomor tidak ditemukan.
- State sukses jika surat siap diunduh.

Jangan mengganti status hanya berdasarkan isi input tanpa request atau state data yang jelas.

### Langkah 6 — Buat halaman login staf

Gunakan `components/candidates/sign-in.tsx` bila API komponen cocok. Jika tidak, susun dari:

- `FormField`.
- `Label`.
- `Input`.
- `Button`.
- `Alert` untuk error atau status.

Setiap field error harus terhubung secara semantik:

```tsx
<Input
  aria-invalid={Boolean(error)}
  aria-describedby={error ? "email-error" : undefined}
/>
{error ? <p id="email-error" role="alert">{error}</p> : null}
```

Form login harus memiliki:

- `name` pada field.
- `autocomplete="username"` dan `autocomplete="current-password"`.
- Fokus ke error pertama setelah submit gagal.
- Pending state pada tombol.
- `aria-busy` ketika request berjalan.
- Pesan error yang menjelaskan tindakan berikutnya.

### Langkah 7 — Buat FAQ dan CTA

FAQ gunakan Accordion dari `components/ui/accordion.tsx`, bukan custom disclosure jika tidak ada alasan khusus.

CTA harus tetap menggunakan satu tombol hijau utama. Dekorasi gambar:

- Diletakkan di wrapper background, bukan di permukaan card.
- Tidak mengurangi kontras teks.
- Tidak memakai animasi terus-menerus.
- Memiliki `alt=""` dan `aria-hidden="true"` bila murni dekoratif.

### Langkah 8 — Susun footer

Footer dapat memakai tiga kolom:

1. Identitas SuratDesa.
2. Layanan.
3. Informasi.

Gunakan background solid sesuai aturan material. DESIGN-it-2023 hanya mengizinkan material semi-transparan untuk sticky bar; footer sebaiknya tidak memakai `backdrop-filter` atau opacity.

## 5. Aturan desain yang wajib dipertahankan

### Warna

- Navy: `#172146`.
- Leaf green: `#2B6032`.
- Canvas: `#F6F7F9`.
- Hairline: `#DFE1E8`.
- Control border: `#80869A`.

Leaf green digunakan untuk satu aksi utama pada satu konteks layar. Tombol sekunder gunakan variant outline, soft, ghost, atau link.

### Typography

- Plus Jakarta Sans untuk seluruh UI.
- Gunakan ukuran `rem` melalui token Tailwind.
- Body publik: sekitar `1.125rem`.
- Teks padat staf: minimal `1rem`.
- Jangan membuat teks di bawah `0.875rem`.

### Motion

- Hover dan perubahan warna: sekitar 150ms.
- Press: scale `0.97` sekitar 100ms.
- Menu/dialog/sheet: maksimal 300ms.
- Tidak boleh ada bounce.
- Jangan menganimasikan width, height, margin, atau layout.
- Hormati `prefers-reduced-motion`.

### Accessibility

- Target interaktif minimal 44×44px.
- Tombol dan field publik idealnya 48px.
- Focus ring terlihat.
- Status tidak hanya dibedakan dengan warna.
- Error menggunakan `aria-live` atau `role="alert"`.
- Error terhubung melalui `aria-describedby`.
- HTML memakai `lang="id"`.
- Gambar dekoratif menggunakan `alt=""` dan `aria-hidden`.

## 6. File yang sebaiknya dibuat

```text
app/
  page.tsx
  login/page.tsx
components/suratdesa/
  hero.tsx
  site-nav.tsx
  service-steps.tsx
  tutorial-video.tsx
  application-lookup.tsx
  faq.tsx
  site-footer.tsx
lib/suratdesa/
  application-status.ts
  navigation.ts
```

Buat komponen domain di `components/suratdesa/`, bukan menambah semua markup langsung ke `app/page.tsx`.

## 7. Validasi sebelum dianggap selesai

Jalankan dari folder project:

```bash
bun run lint
bun run check
bun run build
```

Uji manual pada lebar:

- 360px.
- 390px.
- 768px.
- 1280px atau lebih.

Checklist visual:

- Tidak ada horizontal overflow.
- CTA hijau hanya satu per konteks.
- Kartu tidak menyentuh tepi band.
- Navbar aktif mengikuti section.
- Footer tidak memakai transparansi jika ingin patuh penuh pada DESIGN-it-2023.

Checklist interaksi:

- Semua link bekerja.
- Menu mobile bisa dibuka dan ditutup dengan keyboard.
- FAQ bisa dibuka dengan keyboard.
- Form login memfokuskan error pertama.
- Status tracker memiliki loading, error, dan success state.

## 8. Deviasi yang perlu dicatat

Landing page Acctual/SuratDesa sebelumnya dibuat sebagai HTML statis. Saat dipindahkan ke project ini, beberapa hal harus diperbaiki, bukan disalin:

1. Inline SVG diganti dengan `lucide-react`.
2. CSS inline dipindahkan ke token dan utility Tailwind.
3. Footer semi-transparan diganti solid agar sesuai aturan material.
4. Login simulasi dihubungkan ke server action atau API autentikasi.
5. Status tracker simulasi diganti dengan state data nyata.
6. Link privasi dan syarat diarahkan ke route yang benar.
7. Error form memakai `aria-describedby`.

Dengan urutan ini, tampilan SuratDesa dapat mempertahankan struktur visual Acctual sekaligus menggunakan arsitektur dan komponen yang memang disediakan oleh PMKM-23-IT-BOS.
