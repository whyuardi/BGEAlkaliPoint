"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  ArrowLeft,
  Droplets,
  Phone,
  Search,
  Loader2,
  CheckCircle2,
  Clock,
  Printer,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

interface UserData {
  name: string;
  phone: string;
  area: string;
  qrToken: string;
}

export default function MyQRPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasDispensedToday, setHasDispensedToday] = useState(false);
  const [dispensedAt, setDispensedAt] = useState<string | null>(null);
  const [nextReset, setNextReset] = useState("");

  // Load from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("userToken");
    if (savedToken) {
      fetchUserByToken(savedToken);
    }
  }, []);

  // Countdown reset
  useEffect(() => {
    function updateCountdown() {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      const diff = tomorrow.getTime() - now.getTime();

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setNextReset(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    }

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  async function fetchUserByToken(token: string) {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/dispense?action=check&token=${encodeURIComponent(token)}`
      );
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Gagal memverifikasi kartu");
        return;
      }

      setUser({
        name: data.user.name,
        phone: data.user.phone,
        area: data.user.area,
        qrToken: token,
      });
      setHasDispensedToday(data.hasDispensedToday);
      setDispensedAt(data.dispensedAt);
    } catch {
      toast.error("Gagal memuat status kartu");
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!phone.trim()) {
      toast.error("Masukkan nomor WhatsApp");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `/api/user?phone=${encodeURIComponent(phone.trim())}`
      );
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Data tidak ditemukan. Silakan daftar dulu.");
        return;
      }

      localStorage.setItem("userPhone", data.user.phone);
      localStorage.setItem("userName", data.user.name);
      localStorage.setItem("userToken", data.user.qrToken);

      await fetchUserByToken(data.user.qrToken);
      toast.success("Kartu QR berhasil ditemukan!");
    } catch {
      toast.error("Gagal mencari data kartu");
    } finally {
      setLoading(false);
    }
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900 font-sans print:bg-white print:p-0">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 print:hidden">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Beranda
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
            <span className="text-xs font-semibold text-slate-800">
              PT. Benua Green Energy
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 py-8">
        <div className="w-full max-w-sm">
          {loading && !user ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-slate-600 mb-3" />
              <p className="text-xs text-slate-500 font-medium">Memuat kartu QR...</p>
            </div>
          ) : user ? (
            <div className="space-y-4">
              {/* The Official ID Card */}
              <div
                id="digital-card"
                className="bg-white rounded-2xl border border-slate-300 shadow-md overflow-hidden print:border print:shadow-none"
              >
                {/* Header with Company Logo */}
                <div className="bg-slate-900 text-white p-4 flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white border border-slate-700 flex-shrink-0">
                    <Image
                      src="/images/logo.jpg"
                      alt="PT. Benua Green Energy"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm tracking-tight text-white leading-snug truncate">
                      PT. Benua Green Energy
                    </h3>
                    <p className="text-[11px] text-slate-400 font-normal truncate">
                      Blue Gold Resources · CSR Air Minum
                    </p>
                    <span className="inline-block mt-1 text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">
                      Kartu Penerima Air Alkali
                    </span>
                  </div>
                </div>

                {/* QR Code Container */}
                <div className="p-6 text-center bg-white flex flex-col items-center justify-center">
                  <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs inline-block">
                    <QRCodeSVG
                      value={user.qrToken}
                      size={200}
                      level="H"
                      includeMargin={false}
                    />
                  </div>

                  <div className="mt-3">
                    <p className="text-[11px] text-slate-400 font-medium">KODE TOKEN</p>
                    <p className="text-base font-mono font-bold text-slate-900 tracking-wider">
                      {user.qrToken}
                    </p>
                  </div>
                </div>

                {/* Citizen Details */}
                <div className="px-6 pb-6 pt-0 border-t border-slate-100 bg-slate-50/50">
                  <div className="space-y-2 pt-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500">Nama Penerima:</span>
                      <span className="font-bold text-slate-900">{user.name}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500">Nomor WhatsApp:</span>
                      <span className="font-medium text-slate-800">{user.phone}</span>
                    </div>
                    {user.area && (
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500">Wilayah / RT:</span>
                        <span className="font-medium text-slate-800">{user.area}</span>
                      </div>
                    )}
                  </div>

                  {/* Quota Status Box */}
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    {!hasDispensedToday ? (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-emerald-900 leading-tight">
                              Kuota Tersedia: 2 Liter
                            </p>
                            <p className="text-[11px] text-emerald-700 leading-tight">
                              Siap diambil di pos hari ini
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-emerald-600 text-white text-[10px] hover:bg-emerald-600">
                          Aktif
                        </Badge>
                      </div>
                    ) : (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                          <p className="text-xs font-bold text-amber-900">
                            Sudah Diambil Hari Ini (2 Liter)
                          </p>
                        </div>
                        <p className="text-[11px] text-amber-700">
                          Jatah berikutnya tersedia dalam: <strong>{nextReset}</strong>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 print:hidden">
                <Button
                  onClick={handlePrint}
                  variant="outline"
                  className="w-full h-10 border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-medium"
                >
                  <Printer className="w-3.5 h-3.5 mr-2" />
                  Cetak / Simpan Kartu PDF
                </Button>

                <div className="flex gap-2">
                  <Button
                    onClick={() => fetchUserByToken(user.qrToken)}
                    variant="ghost"
                    size="sm"
                    className="flex-1 text-slate-600 hover:text-slate-900 text-xs"
                  >
                    <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                    Refresh Status
                  </Button>
                  <Button
                    onClick={() => {
                      setUser(null);
                      localStorage.clear();
                    }}
                    variant="ghost"
                    size="sm"
                    className="flex-1 text-slate-500 hover:text-rose-600 text-xs"
                  >
                    Ganti Kartu Lain
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            /* Search Card if not found or no token */
            <Card className="border border-slate-200 shadow-sm bg-white rounded-2xl p-6 text-center">
              <div className="relative w-14 h-14 rounded-full overflow-hidden mx-auto mb-3 border border-slate-200">
                <Image
                  src="/images/logo.jpg"
                  alt="PT. Benua Green Energy"
                  fill
                  className="object-cover"
                />
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                Cari Kartu QR Anda
              </h2>
              <p className="text-xs text-slate-500 mt-1 mb-5">
                Masukkan nomor WhatsApp yang pernah Anda daftarkan.
              </p>

              <form onSubmit={handleSearch} className="space-y-3">
                <Input
                  type="tel"
                  placeholder="Contoh: 081234567890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-10 text-sm border-slate-200 rounded-lg text-center"
                  required
                />
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-10 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-lg"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Search className="w-3.5 h-3.5 mr-1.5" />
                      Temukan Kartu Saya
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-5 pt-4 border-t border-slate-100 text-center">
                <p className="text-xs text-slate-500 mb-2">Belum pernah mendaftar?</p>
                <Link href="/register">
                  <Button variant="outline" size="sm" className="w-full text-xs border-slate-300">
                    Daftar Baru Sekarang
                  </Button>
                </Link>
              </div>
            </Card>
          )}
        </div>
      </main>

      <footer className="text-center py-4 text-xs text-slate-400 border-t border-slate-200 bg-white print:hidden">
        PT. Benua Green Energy · Blue Gold Resources
      </footer>
    </div>
  );
}
