import Link from "next/link"

export default function PrivacyPage() {
  return <InfoPage title="Kebijakan privasi" description="SuratDesa hanya menggunakan data yang diperlukan untuk memproses layanan administrasi desa. Hubungi administrator desa untuk pertanyaan atau permintaan terkait data Anda." />
}

function InfoPage({ title, description }: { title: string; description: string }) {
  return <main className="min-h-screen bg-background px-6 py-16 text-body"><div className="mx-auto max-w-2xl"><Link href="/" className="font-semibold text-heading underline underline-offset-4">← Kembali ke beranda</Link><h1 className="mt-12 text-3xl font-bold text-heading">{title}</h1><p className="mt-4 text-lg leading-relaxed">{description}</p></div></main>
}
