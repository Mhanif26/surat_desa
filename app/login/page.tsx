"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowLeft, Eye, EyeOff, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FormField } from "@/components/form-field"
import { Input } from "@/components/ui/input"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [submitted, setSubmitted] = useState(false)

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(false)
    setError("")
    const form = new FormData(event.currentTarget)
    if (!String(form.get("email") || "").trim() || !String(form.get("password") || "")) {
      setError("Masukkan email atau ID staf dan kata sandi untuk melanjutkan.")
      return
    }
    setSubmitted(true)
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_10%_8%,#e9ecf5_0,transparent_28rem)] px-6 text-body">
      <header className="mx-auto flex min-h-20 max-w-[1200px] items-center justify-between">
        <Link href="/" className="font-bold tracking-tight text-heading">suratdesa</Link>
        <Link href="/" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-heading"><ArrowLeft className="size-4" aria-hidden="true" /> Kembali ke beranda</Link>
      </header>
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-[1200px] items-center gap-12 py-12 lg:grid-cols-[1fr_480px] lg:gap-24">
        <section>
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-4 py-1.5 text-sm font-semibold text-heading"><ShieldCheck className="size-4" aria-hidden="true" /> Portal staf desa</span>
          <h1 className="mt-5 max-w-xl text-3xl font-bold leading-tight tracking-tight text-heading md:text-4xl">Kelola layanan warga dengan lebih mudah.</h1>
          <p className="mt-4 max-w-prose text-lg">Masuk ke ruang kerja staf untuk memeriksa pengajuan, memverifikasi berkas, dan menerbitkan surat administrasi desa.</p>
        </section>
        <section className="rounded-xl border border-hairline bg-white p-6 shadow-float md:p-8" aria-labelledby="login-heading">
          <h2 id="login-heading" className="text-2xl font-semibold text-heading">Masuk ke portal staf</h2>
          <p className="mt-2 text-sm text-muted-foreground">Gunakan akun resmi yang diberikan administrator desa.</p>
          <form className="mt-6 space-y-5" onSubmit={submit}>
            <FormField label="Email atau ID staf" error={error ? "Periksa email atau ID staf." : undefined}>
              <Input name="email" type="text" autoComplete="username" placeholder="contoh: staf@desa.id" />
            </FormField>
            <FormField label="Kata sandi" error={error ? "Periksa kata sandi." : undefined}>
              <div className="relative">
                <Input name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Masukkan kata sandi" className="pr-20" />
                <button type="button" className="absolute right-2 top-1/2 inline-flex min-h-9 -translate-y-1/2 items-center gap-1 rounded-md px-2 text-xs font-semibold text-heading hover:bg-primary-soft" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}>
                  {showPassword ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />} {showPassword ? "Sembunyikan" : "Lihat"}
                </button>
              </div>
            </FormField>
            <div className="flex items-center justify-between gap-4 text-sm">
              <label className="inline-flex items-center gap-2 text-muted-foreground"><input type="checkbox" name="remember" className="size-4 accent-secondary" /> Ingat saya</label>
              <a href="mailto:admin@desa.id?subject=Reset%20kata%20sandi" className="font-semibold text-heading underline underline-offset-4">Lupa kata sandi?</a>
            </div>
            <Button type="submit" variant="secondary" className="w-full">Masuk ke portal</Button>
            {submitted && <p className="rounded-lg bg-secondary-soft p-3 text-sm text-status-success-text" role="status">Formulir siap dikirim ke layanan autentikasi desa.</p>}
          </form>
          <p className="mt-6 border-t border-hairline pt-5 text-center text-sm text-muted-foreground">Belum memiliki akses? <a href="mailto:admin@desa.id" className="font-semibold text-heading underline underline-offset-4">Hubungi administrator desa</a>.</p>
        </section>
      </div>
    </main>
  )
}
