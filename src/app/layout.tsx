import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BGE Alkali Point - Distribusi Air Alkali Gratis PT. Benua Green Energy",
  description:
    "Sistem distribusi air minum alkali gratis 2 liter per hari oleh PT. Benua Green Energy (Blue Gold Resources). Pendaftaran warga, kartu QR digital, pemindai petugas pos, dan monitoring admin.",
  keywords: [
    "BGE Alkali Point",
    "air alkali",
    "air minum gratis",
    "PT Benua Green Energy",
    "Blue Gold Resources",
    "CSR",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
