import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Lora, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: { default: "SuratDesa — Layanan Administrasi Desa Digital", template: "%s · SuratDesa" },
  description: "Ajukan surat administrasi desa secara mandiri, transparan, dan gratis.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" className={`${jakarta.variable} ${lora.variable}`}>
      <body className="min-h-dvh">
        <TooltipProvider delayDuration={300} skipDelayDuration={150}>
          {children}
        </TooltipProvider>
        <Toaster />
      </body>
    </html>
  );
}
