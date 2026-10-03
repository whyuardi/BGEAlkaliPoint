"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import {
  ArrowLeft,
  Droplets,
  Users,
  Clock,
  RefreshCw,
  Download,
  Search,
  ExternalLink,
  LogOut,
  ShieldCheck,
  Loader2,
} from "lucide-react";

interface Stats {
  totalLitersToday: number;
  totalDispensesToday: number;
  totalUsers: number;
  totalLitersAllTime: number;
  totalDispensesAllTime: number;
}

interface Log {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  liters: number;
  boothId: string;
  timestamp: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    role: string;
  } | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [stats, setStats] = useState<Stats>({
    totalLitersToday: 0,
    totalDispensesToday: 0,
    totalUsers: 0,
    totalLitersAllTime: 0,
    totalDispensesAllTime: 0,
  });
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Role check: Only admin
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (!data.authenticated) {
          router.push("/login?redirect=/admin&reason=unauthorized");
        } else if (data.user.role !== "admin") {
          router.push("/login?redirect=/admin&reason=forbidden_admin");
        } else {
          setCurrentUser(data.user);
          setCheckingAuth(false);
        }
      })
      .catch(() => {
        router.push("/login?redirect=/admin&reason=unauthorized");
      });
  }, [router]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    toast.success("Berhasil logout");
    router.push("/login");
    router.refresh();
  }

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, logsRes] = await Promise.all([
        fetch("/api/dispense?action=stats"),
        fetch("/api/dispense"),
      ]);
      const statsData = await statsRes.json();
      const logsData = await logsRes.json();

      setStats(statsData.stats);
      setLogs(logsData.logs);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!checkingAuth) {
      fetchData();
      const interval = setInterval(fetchData, 20000);
      return () => clearInterval(interval);
    }
  }, [fetchData, checkingAuth]);

  function exportCSV() {
    if (logs.length === 0) return;

    const headers = ["No", "Waktu", "Nama", "No WhatsApp", "Liter", "Pos Booth"];
    const rows = logs.map((log, i) => [
      i + 1,
      new Date(log.timestamp).toLocaleString("id-ID"),
      log.userName,
      log.userPhone,
      log.liters,
      log.boothId,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `distribusi_air_alkali_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const filteredLogs = logs.filter(
    (log) =>
      log.userName.toLowerCase().includes(search.toLowerCase()) ||
      log.userPhone.includes(search)
  );

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-slate-600 mb-2" />
          <p className="text-xs text-slate-500">Memverifikasi hak akses administrator...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="mr-2 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-200 flex-shrink-0 bg-white">
              <Image
                src="/images/logo.jpg"
                alt="Logo PT. Benua Green Energy"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
                Panel Monitoring Distribusi Air Alkali
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                PT. Benua Green Energy · Blue Gold Resources
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {currentUser && (
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-semibold text-slate-900 leading-tight">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold uppercase tracking-wider">
                  Role: Administrator
                </span>
              </div>
            )}
            <Button
              onClick={fetchData}
              variant="outline"
              size="sm"
              className="text-xs border-slate-200 text-slate-700 hover:bg-slate-50 hidden md:inline-flex"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
              Perbarui Data
            </Button>
            <Link href="/scanner">
              <Button size="sm" variant="outline" className="text-xs border-slate-300">
                Pos Scanner
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="text-xs text-rose-600 border-rose-200 hover:bg-rose-50"
            >
              <LogOut className="w-3.5 h-3.5 mr-1" />
              Keluar
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-white border border-slate-200 shadow-xs rounded-xl">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-500">Penyaluran Hari Ini</span>
                <Droplets className="w-4 h-4 text-sky-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {stats.totalLitersToday}{" "}
                <span className="text-sm font-normal text-slate-500">Liter</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                {stats.totalDispensesToday} warga terlayani hari ini
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-slate-200 shadow-xs rounded-xl">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-500">Total Warga Terdaftar</span>
                <Users className="w-4 h-4 text-slate-700" />
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {stats.totalUsers}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Penerima aktif dalam sistem
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-slate-200 shadow-xs rounded-xl">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-500">Total Akumulasi Liter</span>
                <Droplets className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {stats.totalLitersAllTime}{" "}
                <span className="text-sm font-normal text-slate-500">Liter</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Sejak program dimulai
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-slate-200 shadow-xs rounded-xl">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-500">Total Transaksi</span>
                <Clock className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {stats.totalDispensesAllTime}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Total penyerahan air
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transaction History Section */}
        <Card className="bg-white border border-slate-200 shadow-xs rounded-xl overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base font-bold text-slate-900">
                Riwayat Penyerahan Air Alkali
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Log pencatatan real-time saat petugas melakukan scan QR di pos.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-48 sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                <Input
                  placeholder="Cari nama / WhatsApp..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 h-9 text-xs border-slate-200 rounded-lg"
                />
              </div>

              <Button
                onClick={exportCSV}
                disabled={logs.length === 0}
                variant="outline"
                size="sm"
                className="text-xs h-9 border-slate-200 text-slate-700"
              >
                <Download className="w-3.5 h-3.5 mr-1.5" />
                Export CSV
              </Button>
            </div>
          </div>

          <CardContent className="p-0">
            {loading ? (
              <div className="p-12 text-center text-xs text-slate-500">
                Memuat data riwayat...
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-500">
                {search
                  ? "Tidak ada data yang cocok dengan pencarian."
                  : "Belum ada riwayat pengambilan air hari ini."}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-slate-200 bg-slate-50 hover:bg-slate-50">
                      <TableHead className="w-12 text-xs font-semibold text-slate-600">No</TableHead>
                      <TableHead className="text-xs font-semibold text-slate-600">Waktu</TableHead>
                      <TableHead className="text-xs font-semibold text-slate-600">Nama Penerima</TableHead>
                      <TableHead className="text-xs font-semibold text-slate-600">No. WhatsApp</TableHead>
                      <TableHead className="text-xs font-semibold text-slate-600">Jumlah</TableHead>
                      <TableHead className="text-xs font-semibold text-slate-600">Pos / Booth</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log, index) => (
                      <TableRow key={log.id} className="border-b border-slate-100 hover:bg-slate-50/60">
                        <TableCell className="text-xs text-slate-500">{index + 1}</TableCell>
                        <TableCell className="text-xs text-slate-700 font-mono">
                          {new Date(log.timestamp).toLocaleString("id-ID", {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </TableCell>
                        <TableCell className="text-xs font-semibold text-slate-900">
                          {log.userName}
                        </TableCell>
                        <TableCell className="text-xs text-slate-600 font-mono">
                          {log.userPhone}
                        </TableCell>
                        <TableCell className="text-xs">
                          <Badge className="bg-sky-50 text-sky-800 border border-sky-200 font-semibold hover:bg-sky-50">
                            {log.liters} Liter
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-slate-500">
                          {log.boothId}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-400">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>PT. Benua Green Energy · Blue Gold Resources</span>
          <a
            href="http://www.benuagreenenergy.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-600 flex items-center gap-1"
          >
            <span>benuagreenenergy.com</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </footer>
    </div>
  );
}
