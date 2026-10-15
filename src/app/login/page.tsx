"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  ArrowLeft,
  Lock,
  User,
  ShieldCheck,
  ScanLine,
  Loader2,
  AlertCircle,
  KeyRound,
  CheckCircle2,
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "";
  const reason = searchParams.get("reason") || "";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(userVal: string, passVal: string) {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: userVal, password: passVal }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Gagal login");
        return;
      }

      toast.success(`Selamat datang, ${data.user.name}`);

      // Handle redirect
      if (redirectUrl && redirectUrl.startsWith("/")) {
        // If logged in as petugas but trying to access admin, redirect to scanner
        if (redirectUrl.startsWith("/admin") && data.user.role !== "admin") {
          router.push("/scanner");
          return;
        }
        router.push(redirectUrl);
      } else {
        // Default destination by role
        if (data.user.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/scanner");
        }
      }
      router.refresh();
    } catch {
      toast.error("Terjadi kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      toast.error("Username dan password wajib diisi");
      return;
    }
    handleLogin(username, password);
  }

  function quickLogin(role: "petugas" | "admin") {
    if (role === "petugas") {
      setUsername("petugas");
      setPassword("petugas123");
      handleLogin("petugas", "petugas123");
    } else {
      setUsername("admin");
      setPassword("admin123");
      handleLogin("admin", "admin123");
    }
  }

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Access alert message */}
      {reason === "forbidden_admin" && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-rose-900">Akses Dibatasi: Role Admin Saja</p>
            <p className="mt-0.5 text-rose-700">
              Akun Petugas tidak memiliki hak untuk membuka Panel Admin. Silakan masuk menggunakan akun Administrator.
            </p>
          </div>
        </div>
      )}

      {reason === "unauthorized" && (
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-800">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-amber-900">Perlu Autentikasi</p>
            <p className="mt-0.5 text-amber-700">
              Silakan login dengan akun yang memiliki hak akses untuk halaman tersebut.
            </p>
          </div>
        </div>
      )}

      <Card className="border border-slate-200 shadow-sm bg-white rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-2 text-center">
          <div className="relative w-16 h-16 rounded-full overflow-hidden mx-auto mb-3 border border-slate-200 shadow-xs bg-white">
            <Image
              src="/images/logo.jpg"
              alt="PT. Benua Green Energy"
              fill
              className="object-cover"
              priority
            />
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Login Portal Internal
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Khusus Petugas Pos Distribusi & Administrator BGE
          </p>
        </div>

        <CardContent className="p-6 pt-4 space-y-5">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                Username
              </label>
              <Input
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-10 text-sm border-slate-200 rounded-lg"
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                Password
              </label>
              <Input
                type="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10 text-sm border-slate-200 rounded-lg"
                disabled={loading}
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Memverifikasi...
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4 mr-2" />
                  Masuk ke Portal
                </>
              )}
            </Button>
          </form>

          {/* Quick Demo Login Buttons */}
          <div className="pt-2 border-t border-slate-100">
            <p className="text-[11px] text-slate-400 font-medium text-center mb-3">
              AKSES CEPAT (DEMO PERAN)
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => quickLogin("petugas")}
                disabled={loading}
                className="p-3 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-xl text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-1.5 text-sky-700 text-xs font-bold mb-0.5">
                  <ScanLine className="w-3.5 h-3.5" />
                  <span>Petugas Pos</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Akses Scanner Pos
                </p>
                <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                  petugas / petugas123
                </span>
              </button>

              <button
                type="button"
                onClick={() => quickLogin("admin")}
                disabled={loading}
                className="p-3 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-xl text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-1.5 text-slate-900 text-xs font-bold mb-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin BGE</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Akses Dashboard
                </p>
                <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                  admin / admin123
                </span>
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900 font-sans">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 h-15 sm:h-16 flex items-center justify-between gap-2">
          <Link
            href="/"
            className="inline-flex items-center text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-4 h-4 mr-1 sm:mr-1.5" />
            <span className="hidden sm:inline">Kembali ke Beranda</span>
            <span className="sm:hidden">Beranda</span>
          </Link>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-slate-200 bg-white">
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
        <Suspense fallback={<div className="text-xs text-slate-400">Memuat...</div>}>
          <LoginForm />
        </Suspense>
      </main>

      <footer className="text-center py-4 text-xs text-slate-400 border-t border-slate-200 bg-white">
        PT. Benua Green Energy · Blue Gold Resources
      </footer>
    </div>
  );
}
