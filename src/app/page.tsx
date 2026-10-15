"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  QrCode,
  ScanLine,
  ShieldCheck,
  Heart,
  Droplets,
  ArrowRight,
  Clock,
  MapPin,
  CheckCircle,
  ExternalLink,
  Lock,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-sky-100 selection:text-sky-900">
      {/* Top Announcement Bar */}
      <div className="bg-slate-900 text-slate-300 text-[11px] sm:text-xs py-1.5 sm:py-2 px-3 text-center border-b border-slate-800 flex items-center justify-center gap-1.5 sm:gap-2">
        <span className="inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 flex-shrink-0"></span>
        <span className="truncate max-w-full">Program CSR Aktif · Kuota 2 Liter / Orang Setiap Hari Gratis</span>
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 h-15 sm:h-18 flex items-center justify-between gap-2">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-full overflow-hidden border border-slate-200 shadow-xs flex-shrink-0 bg-white">
              <Image
                src="/images/logo.jpg"
                alt="PT. Benua Green Energy Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 text-xs sm:text-base tracking-tight leading-tight truncate block">
                  PT. Benua Green Energy
                </span>
              </div>
              <p className="hidden sm:block text-xs text-slate-500 font-medium leading-tight mt-0.5 truncate">
                Blue Gold Resources · Program Air Alkali Gratis
              </p>
              <p className="sm:hidden text-[10px] text-slate-500 font-medium leading-none mt-0.5 truncate">
                Blue Gold Resources
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <nav className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
            <Link href="/my-qr">
              <Button
                variant="outline"
                size="sm"
                className="h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm font-medium border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                <QrCode className="w-3.5 h-3.5 text-slate-600" />
                <span className="hidden sm:inline sm:ml-1.5">Kartu QR Saya</span>
                <span className="sm:hidden ml-1">QR Saya</span>
              </Button>
            </Link>
            <Link href="/register">
              <Button
                size="sm"
                className="h-8 sm:h-9 px-2.5 sm:px-4 text-xs sm:text-sm font-medium bg-slate-900 hover:bg-slate-800 text-white shadow-xs"
              >
                <span className="hidden sm:inline">Daftar Warga</span>
                <span className="sm:hidden">Daftar</span>
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-slate-50/70 border-b border-slate-200/80 py-16 sm:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            {/* Real Logo in Hero Badge */}
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs mb-8">
              <div className="relative w-6 h-6 rounded-full overflow-hidden border border-slate-200">
                <Image
                  src="/images/logo.jpg"
                  alt="Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-xs font-semibold text-slate-700">
                Inisiatif Sosial & Kesehatan Masyarakat
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-6">
              Akses Air Minum Alkali Sehat,{" "}
              <span className="text-sky-700">Gratis Setiap Hari</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
              Program kepedulian sosial dari <strong>PT. Benua Green Energy</strong> untuk
              kesehatan warga sekitar. Setiap individu berhak mendapatkan jatah{" "}
              <span className="text-slate-900 font-semibold">2 Liter air alkali</span> setiap hari
              tanpa dipungut biaya.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/register" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-semibold text-base px-8 h-12 shadow-sm"
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  Daftar & Dapatkan Kartu QR
                </Button>
              </Link>
              <Link href="/my-qr" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto bg-white border-slate-300 text-slate-700 hover:bg-slate-100 font-medium text-base px-6 h-12"
                >
                  Sudah Terdaftar? Buka QR
                </Button>
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 border-t border-slate-200">
              <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
                <div className="text-2xl font-bold text-slate-900">2 Liter</div>
                <div className="text-xs text-slate-500 mt-1">Kuota Harian / Orang</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
                <div className="text-2xl font-bold text-sky-700">pH 8.5+</div>
                <div className="text-xs text-slate-500 mt-1">Kualitas Alkali Tinggi</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
                <div className="text-2xl font-bold text-emerald-700">100% Gratis</div>
                <div className="text-xs text-slate-500 mt-1">Tanpa Biaya Apapun</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
                <div className="text-2xl font-bold text-slate-900">Scan QR</div>
                <div className="text-xs text-slate-500 mt-1">Pengambilan Cepat</div>
              </div>
            </div>
          </div>
        </section>

        {/* 3 Step Flow */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Alur Praktis Pengambilan Air
              </h2>
              <p className="text-sm sm:text-base text-slate-500 mt-2">
                Hanya butuh 3 langkah sederhana untuk menikmati air alkali sehat setiap hari.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Step 1 */}
              <div className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm mb-4">
                  1
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Daftar Data Diri</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Isi nama lengkap, nomor WhatsApp, dan domisili RT/RW sekali saja. Pendaftaran langsung aktif seketika.
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-sky-700 text-white flex items-center justify-center font-bold text-sm mb-4">
                  2
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Simpan Kartu QR</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Dapatkan Kartu QR digital khusus Anda. Simpan screenshot di galeri HP atau bookmark halamannya.
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-sm mb-4">
                  3
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Ambil di Pos Air</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Bawa botol/tumbler ukuran 2 liter Anda ke pos. Tunjukkan QR ke petugas untuk di-scan dan diisi.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Info & Jadwal Pos */}
        <section className="py-14 bg-slate-50 border-y border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 text-xs font-semibold mb-3 border border-emerald-200">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Pos Distribusi Aktif
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Pos Air Alkali PT. Benua Green Energy
                  </h3>
                  <div className="flex flex-col gap-2 mt-3 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <span>Pos Utama Blue Gold Resources (Area Booth Distribusi Warga)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <span>Jam Layanan: <strong>07.00 - 17.00 WIB</strong> (Setiap Hari)</span>
                    </div>
                  </div>
                </div>

                <div className="flex-shrink-0 flex flex-col gap-2">
                  <Link href="/register">
                    <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm">
                      Daftar Sekarang
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Button>
                  </Link>
                  <p className="text-[11px] text-slate-400 text-center">
                    Kuota harian reset tiap 00:00 WIB
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-xl mx-auto mb-10">
              <h2 className="text-2xl font-bold text-slate-900">Manfaat Air Minum Alkali</h2>
              <p className="text-sm text-slate-500 mt-1.5">
                Kandungan mineral mikro dan tingkat basa seimbang untuk kesehatan keluarga.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              <div className="p-5 rounded-xl border border-slate-200">
                <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center mb-3">
                  <Droplets className="w-5 h-5" />
                </div>
                <h4 className="font-semibold text-slate-900 mb-1">Hidrasi Maksimal</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Molekul mikro lebih cepat diserap oleh sel tubuh sehingga mencegah dehidrasi lebih efektif.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-slate-200">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
                  <Heart className="w-5 h-5" />
                </div>
                <h4 className="font-semibold text-slate-900 mb-1">Keseimbangan Asam Basa</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Membantu menetralkan kadar asam berlebih dalam pencernaan akibat pola makan modern.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-slate-200">
                <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="font-semibold text-slate-900 mb-1">Kaya Antioksidan</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Mengandung antioksidan alami yang menangkal radikal bebas dan menjaga daya tahan tubuh.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white flex-shrink-0">
                <Image
                  src="/images/logo.jpg"
                  alt="Logo PT. Benua Green Energy"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="text-white font-bold text-base leading-tight">
                  PT. Benua Green Energy
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Blue Gold Resources · Clean Water Distribution System
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <a
                href="http://www.benuagreenenergy.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors flex items-center gap-1"
              >
                <span>www.benuagreenenergy.com</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-slate-700">|</span>
              <Link href="/login" className="hover:text-white transition-colors flex items-center gap-1 text-slate-300 font-medium">
                <Lock className="w-3 h-3 text-slate-400" />
                <span>Portal Petugas & Admin</span>
              </Link>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} PT. Benua Green Energy. Seluruh hak cipta dilindungi.</p>
            <p>Program Bantuan Sosial Air Sehat Masyarakat</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
