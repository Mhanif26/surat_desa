"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowRight, Check, CircleHelp, Menu, Play, Search, ShieldCheck, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { StatusTag } from "@/components/status"

const navItems = [
  ["Beranda", "beranda"],
  ["Alur layanan", "alur"],
  ["Panduan video", "panduan"],
  ["Cek status", "status"],
  ["FAQ", "faq"],
] as const

const steps = [
  ["01", "Pilih jenis surat dan isi form", "Pilih jenis surat yang dibutuhkan dan unggah foto KTP dari HP Anda."],
  ["02", "Verifikasi petugas desa", "Petugas memeriksa kelengkapan berkas secara digital dalam kurun 1 hari kerja."],
  ["03", "Unduh PDF atau ambil cetakan", "Surat yang telah ditandatangani TTE Kades siap diunduh secara mandiri."],
]

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState("beranda")
  const [statusNumber, setStatusNumber] = useState("")
  const [statusMessage, setStatusMessage] = useState("Pengajuan terakhir diperbarui hari ini")
  const [faqOpen, setFaqOpen] = useState<number | null>(null)

  const goTo = (id: string) => {
    setActive(id)
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  function checkStatus(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatusMessage(
      statusNumber.trim()
        ? "Nomor pengajuan ditemukan — diperbarui hari ini"
        : "Masukkan nomor pengajuan untuk melihat status"
    )
  }

  return (
    <main className="min-h-screen bg-background text-body">
      <header className="material-bar sticky top-3 z-20 mx-auto w-[calc(100%-2rem)] max-w-[1200px] rounded-2xl border shadow-sm">
        <nav className="mx-auto flex min-h-16 max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-6" aria-label="Navigasi utama">
          <Link href="#beranda" className="flex items-center gap-2 font-bold tracking-tight text-heading" onClick={() => goTo("beranda")}>
            <span className="grid size-8 place-items-center rounded-full bg-secondary-soft text-secondary" aria-hidden="true">
              <span className="text-lg">⌁</span>
            </span>
            suratdesa
          </Link>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-lg text-heading hover:bg-surface-strong md:hidden"
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
            aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
          <div id="primary-navigation" className={`${menuOpen ? "flex" : "hidden"} absolute inset-x-2 top-[4.5rem] flex-col gap-1 rounded-xl border bg-white p-2 shadow-float md:static md:flex md:flex-row md:items-center md:border-0 md:bg-transparent md:p-0 md:shadow-none`}>
            {navItems.map(([label, id]) => (
              <button
                key={id}
                type="button"
                className={`rounded-full px-3 py-2 text-left text-sm transition-colors duration-150 md:text-center ${active === id ? "bg-primary-soft font-semibold text-heading" : "text-muted-foreground hover:bg-surface-strong hover:text-heading"}`}
                aria-current={active === id ? "page" : undefined}
                onClick={() => goTo(id)}
              >
                {label}
              </button>
            ))}
            <Button asChild variant="outline" size="dense" className="mt-2 w-full md:mt-0 md:w-auto">
              <Link href="/login">Akses staf desa</Link>
            </Button>
          </div>
        </nav>
      </header>

      <section id="beranda" className="relative overflow-hidden bg-[radial-gradient(circle_at_50%_18%,#e9ecf5_0,transparent_35rem)] px-6 pb-16 pt-32 text-center md:pb-24 md:pt-40">
        <div className="relative z-10 mx-auto max-w-[1200px]">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-4 py-1.5 text-sm font-semibold text-heading">
            <ShieldCheck className="size-4" aria-hidden="true" /> Layanan mandiri resmi warga desa
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl text-3xl font-bold leading-tight tracking-tight text-heading md:text-4xl">
            Urus surat administrasi desa langsung dari rumah
          </h1>
          <p className="mx-auto mt-4 max-w-prose text-base text-body md:text-lg">
            Gratis, transparan, dan biasanya selesai dalam 1 hari kerja. Pantau status verifikasi secara langsung dari HP Anda.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild variant="secondary">
              <Link href="#status">Ajukan surat baru <ArrowRight aria-hidden="true" /></Link>
            </Button>
            <Button variant="link" onClick={() => goTo("alur")}>Pelajari persyaratan</Button>
          </div>
          <div className="mx-auto mt-14 max-w-[800px] rounded-xl border border-hairline bg-white p-4 text-left shadow-float">
            <div className="flex items-center justify-between pb-4 text-xs text-muted-foreground">
              <span>Pratinjau surat digital</span>
              <span className="flex gap-1" aria-hidden="true"><i className="size-2 rounded-full bg-hairline" /><i className="size-2 rounded-full bg-hairline" /><i className="size-2 rounded-full bg-hairline" /></span>
            </div>
            <div className="grid gap-5 rounded-lg bg-canvas p-5 md:grid-cols-[1fr_1.25fr]">
              <div className="border-b border-hairline pb-5 md:border-b-0 md:border-r md:pb-0 md:pr-5">
                <h2 className="font-semibold text-heading">SuratDesa</h2>
                <p className="mt-5 text-xs uppercase tracking-wide text-muted-foreground">Nomor pengajuan</p><div className="mt-1 h-2 w-1/2 rounded bg-hairline" />
                <p className="mt-4 text-xs uppercase tracking-wide text-muted-foreground">Nama pemohon</p><div className="mt-1 h-2 w-4/5 rounded bg-hairline" />
                <p className="mt-4 text-xs uppercase tracking-wide text-muted-foreground">Jenis layanan</p><div className="mt-1 h-2 w-4/5 rounded bg-hairline" />
              </div>
              <div className="rounded-lg border border-hairline bg-white p-5">
                <div className="mx-auto h-4 w-3/4 rounded bg-primary" />
                <div className="mt-6 h-2 rounded bg-hairline" /><div className="mt-3 h-2 rounded bg-hairline" /><div className="mt-3 h-2 w-1/2 rounded bg-hairline" />
                <div className="ml-auto mt-6 h-8 w-24 border-b-2 border-primary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="alur" className="mx-auto w-[calc(100%-3rem)] max-w-[1200px] rounded-2xl bg-canvas px-4 py-12 md:px-10 md:py-16">
        <SectionHeading title="3 langkah mudah pengajuan surat mandiri" description="Proses cepat tanpa perlu mengantre di kantor desa" />
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map(([number, title, description]) => (
            <article key={number} className="rounded-xl border border-hairline bg-white p-6">
              <span className="inline-grid h-8 w-11 place-items-center rounded-full bg-primary text-xs font-bold text-white">{number}</span>
              <h3 className="mt-5 text-lg font-semibold text-heading">{title}</h3>
              <p className="mt-2 text-base text-muted-foreground">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="panduan" className="px-6 py-16 md:py-20">
        <div className="mx-auto max-w-[1000px]">
          <SectionHeading title="Panduan penggunaan layanan" description="Simak video singkat 2 menit untuk memahami cara pengajuan surat secara mandiri." />
          <div className="relative grid aspect-video place-items-center overflow-hidden rounded-xl border border-hairline bg-[linear-gradient(135deg,#eef0f4,#cbd2df)]">
            <div className="absolute inset-[12%_9%] rounded-lg bg-white shadow-float" />
            <div className="absolute left-[9%] top-[12%] bottom-[12%] w-[18%] rounded-l-lg bg-primary" />
            <div className="absolute left-[32%] right-[13%] top-[22%] h-2 rounded bg-hairline shadow-[0_30px_0_#dfe1e8,0_60px_0_#dfe1e8]" />
            <Button size="icon" className="relative z-10 rounded-full" aria-label="Putar panduan video"><Play className="fill-current" aria-hidden="true" /></Button>
          </div>
          <p className="mt-3 text-center text-sm text-muted-foreground">Keterangan: Panduan langkah demi langkah pengisian formulir dari HP untuk warga desa.</p>
        </div>
      </section>

      <section id="status" className="mx-auto w-[calc(100%-3rem)] max-w-[1200px] rounded-2xl bg-canvas px-4 py-12 md:px-10 md:py-16">
        <SectionHeading title="Pantau status pengajuan surat Anda" description="Masukkan nomor pengajuan yang Anda terima saat mendaftar." />
        <form className="mx-auto flex max-w-3xl flex-col gap-2 rounded-xl border border-input bg-white p-2 sm:flex-row sm:rounded-full" onSubmit={checkStatus}>
          <label className="sr-only" htmlFor="application-number">Nomor pengajuan</label>
          <Search className="ml-3 mt-3 size-5 shrink-0 text-muted-foreground sm:mt-3" aria-hidden="true" />
          <Input id="application-number" value={statusNumber} onChange={(event) => setStatusNumber(event.target.value)} placeholder="Masukkan nomor pengajuan, misal: SD-2410-0142" className="border-0 shadow-none focus-visible:ring-0" />
          <Button type="submit" variant="secondary" className="sm:rounded-full">Cek status</Button>
        </form>
        <div className="mx-auto mt-6 max-w-3xl rounded-xl border border-hairline bg-white p-6">
          <div className="flex flex-col justify-between gap-4 border-b border-hairline pb-5 sm:flex-row sm:items-start">
            <div><h3 className="font-semibold text-heading">{statusNumber || "SD-2410-0142"}</h3><p className="mt-1 text-sm text-muted-foreground">{statusMessage}</p></div>
            <StatusTag tone="info">Sedang diverifikasi petugas</StatusTag>
          </div>
          <div className="grid gap-4 pt-6 sm:grid-cols-4">
            {["Diajukan", "Sedang diverifikasi", "Menunggu kades", "Disetujui"].map((item, index) => (
              <div key={item} className={`text-center text-xs ${index < 2 ? "font-semibold text-heading" : "text-muted-foreground"}`}>
                <span className={`mx-auto mb-2 grid size-4 place-items-center rounded-full border-2 ${index < 2 ? "border-primary bg-primary text-white" : "border-hairline"}`}>{index === 0 && <Check className="size-3" aria-hidden="true" />}</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="px-6 py-16 md:py-20">
        <div className="mx-auto max-w-3xl">
          <SectionHeading title="Pertanyaan yang sering diajukan" description="Temukan jawaban atas pertanyaan umum seputar pengajuan surat." />
          <div className="divide-y divide-hairline border-y border-hairline">
            {[
              ["Berapa lama proses pengajuan surat?", "Pengajuan biasanya selesai dalam 1 hari kerja setelah berkas dinyatakan lengkap oleh petugas desa."],
              ["Apakah saya harus datang ke balai desa?", "Tidak selalu. Anda dapat mengisi formulir, mengunggah berkas, dan mengunduh surat dari HP."],
              ["Apakah ada biaya untuk layanan ini?", "Layanan pengajuan surat melalui SuratDesa tidak dipungut biaya."],
            ].map(([question, answer], index) => (
              <div key={question}>
                <button type="button" className="flex min-h-16 w-full items-center justify-between gap-4 py-4 text-left font-semibold text-heading" aria-expanded={faqOpen === index} onClick={() => setFaqOpen(faqOpen === index ? null : index)}>
                  {question}<CircleHelp className="size-5 shrink-0" aria-hidden="true" />
                </button>
                {faqOpen === index && <p className="pb-5 pr-8 text-base text-muted-foreground">{answer}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-[calc(100%-3rem)] max-w-[1200px] rounded-2xl border border-hairline bg-white px-6 py-12 text-center md:py-16">
        <h2 className="mx-auto max-w-2xl text-2xl font-semibold text-heading">Butuh surat administrasi hari ini? Ajukan sekarang</h2>
        <p className="mt-2 text-base text-muted-foreground">Proses cepat, transparan, dan tidak dipungut biaya sepeser pun.</p>
        <Button asChild variant="secondary" className="mt-6"><Link href="#status">Ajukan surat mandiri</Link></Button>
      </section>

      <footer className="mt-16 bg-secondary px-6 py-12 text-white">
        <div className="mx-auto grid max-w-[1200px] gap-8 md:grid-cols-3">
          <div><h2 className="font-semibold">suratdesa</h2><p className="mt-3 max-w-xs text-lg font-semibold leading-snug">Layanan administrasi desa yang lebih mudah untuk semua warga.</p><Link className="mt-5 inline-block text-sm underline underline-offset-4" href="/login">Akses staf desa</Link></div>
          <FooterColumn title="Layanan" links={[["Alur layanan", "#alur"], ["Panduan video", "#panduan"], ["Cek status pengajuan", "#status"], ["Pertanyaan umum", "#faq"]]} />
          <FooterColumn title="Informasi" links={[["Panduan aplikasi", "#panduan"], ["Kebijakan privasi", "/privasi"], ["Syarat & ketentuan", "/syarat"], ["Hubungi administrator", "mailto:admin@desa.id"]]} />
        </div>
        <div className="mx-auto mt-10 max-w-[1200px] border-t border-white/25 pt-5 text-sm text-white/80">© 2026 Government Village Administration Portal. Powered by IT-2023 System.</div>
      </footer>
    </main>
  )
}

function SectionHeading({ title, description }: { title: string; description: string }) {
  return <div className="mx-auto mb-8 max-w-2xl text-center"><h2 className="text-2xl font-semibold text-heading">{title}</h2><p className="mt-2 text-base text-muted-foreground">{description}</p></div>
}

function FooterColumn({ title, links }: { title: string; links: readonly [string, string][] }) {
  return <div><h2 className="font-semibold">{title}</h2><div className="mt-3 space-y-2 text-sm text-white/80">{links.map(([label, href]) => <Link key={label} className="block hover:text-white" href={href}>{label}</Link>)}</div></div>
}
