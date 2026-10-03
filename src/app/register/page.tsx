"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  ArrowLeft,
  User,
  Phone,
  MapPin,
  Loader2,
  CheckCircle2,
  QrCode,
  ShieldCheck,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [area, setArea] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [registeredUser, setRegisteredUser] = useState<{
    name: string;
    phone: string;
    qrToken: string;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Nama lengkap wajib diisi");
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      toast.error("Nomor WhatsApp tidak valid (minimal 10 digit)");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, area }),
      });

      const data = await res.json();

      if (res.status === 409) {
        toast.info("Nomor ini sudah terdaftar. Mengalihkan ke Kartu QR...");
        localStorage.setItem("userPhone", data.user.phone);
        localStorage.setItem("userName", data.user.name);
        localStorage.setItem("userToken", data.user.qrToken);
        setTimeout(() => router.push("/my-qr"), 800);
        return;
      }

      if (!res.ok) {
        toast.error(data.error || "Gagal mendaftar");
        return;
      }

      localStorage.setItem("userPhone", data.user.phone);
      localStorage.setItem("userName", data.user.name);
      localStorage.setItem("userToken", data.user.qrToken);
      setRegisteredUser(data.user);
      setSuccess(true);
      toast.success("Pendaftaran berhasil!");
    } catch {
      toast.error("Gagal terhubung ke server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900 font-sans">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Kembali ke Beranda
          </Link>
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-slate-200">
              <Image
                src="/images/logo.jpg"
                alt="Logo"
                fill
                className="object-cover"
              />
            </div>
            <span className="text-xs font-semibold text-slate-800 hidden sm:inline">
              PT. Benua Green Energy
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md">
          {!success ? (
            <Card className="border border-slate-200 shadow-sm bg-white rounded-2xl overflow-hidden">
              {/* Header with Logo */}
              <div className="p-6 pb-2 text-center">
                <div className="relative w-16 h-16 rounded-full overflow-hidden mx-auto mb-3 border border-slate-200 shadow-xs">
                  <Image
                    src="/images/logo.jpg"
                    alt="PT. Benua Green Energy"
                    fill
                    className="object-cover"
                  />
                </div>
                <h1 className="text-xl font-bold text-slate-900">
                  Formulir Penerima Air
                </h1>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Daftar sekali untuk mendapatkan kuota 2 liter air alkali gratis setiap hari.
                </p>
              </div>

              <CardContent className="p-6 pt-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      Nama Lengkap
                    </label>
                    <Input
                      placeholder="Contoh: Budi Santoso"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-10 text-sm border-slate-200 focus:border-slate-400 rounded-lg"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      Nomor WhatsApp / HP
                    </label>
                    <Input
                      type="tel"
                      placeholder="Contoh: 081234567890"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="h-10 text-sm border-slate-200 focus:border-slate-400 rounded-lg"
                      required
                    />
                    <p className="text-[11px] text-slate-400">
                      Digunakan untuk verifikasi dan identifikasi tiket QR.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      Domisili / RT & RW (Opsional)
                    </label>
                    <Input
                      placeholder="Contoh: RT 03 / RW 05"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="h-10 text-sm border-slate-200 focus:border-slate-400 rounded-lg"
                    />
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-lg"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Memproses...
                        </>
                      ) : (
                        <>
                          <QrCode className="w-4 h-4 mr-2" />
                          Daftar & Terbitkan Kartu QR
                        </>
                      )}
                    </Button>
                  </div>
                </form>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Data aman & program 100% tanpa dipungut biaya.</span>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border border-slate-200 shadow-sm bg-white rounded-2xl overflow-hidden p-6 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Pendaftaran Berhasil!
              </h2>
              <p className="text-xs text-slate-600 mt-1.5">
                Kartu Digital Air Alkali atas nama{" "}
                <strong className="text-slate-900">{registeredUser?.name}</strong> telah aktif.
              </p>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 my-6 text-left">
                <div className="flex justify-between items-center text-xs text-slate-500 mb-1">
                  <span>Kode Token QR:</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {registeredUser?.qrToken}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>Jatah Harian:</span>
                  <span className="font-bold text-emerald-700">2 Liter (Tersedia)</span>
                </div>
              </div>

              <div className="space-y-2">
                <Link href="/my-qr" className="block w-full">
                  <Button className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-lg">
                    <QrCode className="w-4 h-4 mr-2" />
                    Buka Kartu QR Saya Sekarang
                  </Button>
                </Link>
                <Link href="/" className="block w-full">
                  <Button
                    variant="outline"
                    className="w-full h-10 border-slate-200 text-slate-700 text-xs font-medium"
                  >
                    Kembali ke Halaman Utama
                  </Button>
                </Link>
              </div>
            </Card>
          )}
        </div>
      </main>

      <footer className="text-center py-4 text-xs text-slate-400 border-t border-slate-200 bg-white">
        PT. Benua Green Energy · Blue Gold Resources
      </footer>
    </div>
  );
}
