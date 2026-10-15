"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  ArrowLeft,
  Camera,
  CameraOff,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Droplets,
  Loader2,
  LogOut,
  UserCheck,
} from "lucide-react";

interface ScanResult {
  type: "success" | "error" | "already";
  message: string;
  user?: { name: string; phone: string };
  dispensedAt?: string;
}

export default function ScannerPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [currentUser, setCurrentUser] = useState<{
    name: string;
    role: string;
    boothId?: string;
  } | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [manualToken, setManualToken] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [pendingToken, setPendingToken] = useState("");

  // Role validation check
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (
          !data.authenticated ||
          (data.user.role !== "petugas" && data.user.role !== "admin")
        ) {
          router.push("/login?redirect=/scanner&reason=unauthorized");
        } else {
          setCurrentUser(data.user);
          setCheckingAuth(false);
        }
      })
      .catch(() => {
        router.push("/login?redirect=/scanner&reason=unauthorized");
      });
  }, [router]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    toast.success("Berhasil logout");
    router.push("/login");
    router.refresh();
  }

  // Check QR token via API
  const checkToken = useCallback(async (token: string) => {
    if (processing) return;
    setProcessing(true);

    try {
      const res = await fetch(
        `/api/dispense?action=check&token=${encodeURIComponent(token)}`
      );
      const data = await res.json();

      if (!res.ok) {
        setResult({
          type: "error",
          message: data.error || "QR Code tidak terdaftar dalam sistem",
        });
        setShowResult(true);
        return;
      }

      if (data.hasDispensedToday) {
        const time = data.dispensedAt
          ? new Date(data.dispensedAt).toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "";
        setResult({
          type: "already",
          message: `${data.user.name} sudah mengambil jatah hari ini${time ? ` (pukul ${time} WIB)` : ""}. Kuota reset besok.`,
          user: data.user,
          dispensedAt: data.dispensedAt,
        });
        setShowResult(true);
        return;
      }

      setPendingToken(token);
      setResult({
        type: "success",
        message: `Penerima terverifikasi. Kuota 2 Liter tersedia untuk diserahkan.`,
        user: data.user,
      });
      setShowResult(true);
    } catch {
      toast.error("Gagal memeriksa status tiket");
    } finally {
      setProcessing(false);
    }
  }, [processing]);

  // Start camera
  async function startCamera() {
    setCameraError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
      startScanning();
    } catch (err) {
      console.error("Camera access error:", err);
      setCameraError(
        "Tidak dapat mengakses kamera. Pastikan izin kamera aktif atau gunakan input manual."
      );
      setCameraActive(false);
    }
  }

  // Stop camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    setCameraActive(false);
    setScanning(false);
  }, []);

  // Scan loop
  const startScanning = useCallback(() => {
    setScanning(true);

    if ("BarcodeDetector" in window) {
      // @ts-expect-error - Web standard in supported modern browsers
      const detector = new window.BarcodeDetector({ formats: ["qr_code"] });

      scanIntervalRef.current = setInterval(async () => {
        if (!videoRef.current || videoRef.current.readyState < 2) return;

        try {
          const barcodes = await detector.detect(videoRef.current);
          if (barcodes.length > 0) {
            const rawValue = barcodes[0].rawValue;
            stopCamera();
            checkToken(rawValue.trim());
          }
        } catch {
          // ignore detection frame errors
        }
      }, 300);
    } else {
      setCameraError(
        "Fitur deteksi otomatis kamera belum didukung di browser ini. Silakan input token manual di bawah."
      );
    }
  }, [checkToken, stopCamera]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  // Confirm dispense
  async function handleConfirmDispense() {
    if (!pendingToken) return;
    setConfirming(true);

    try {
      const res = await fetch("/api/dispense", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          qrToken: pendingToken,
          boothId: currentUser?.boothId || "BOOTH-01",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Gagal mencatat pengambilan air");
        return;
      }

      toast.success("Pengambilan 2 Liter air alkali berhasil dicatat!");
      setShowResult(false);
      setResult(null);
      setPendingToken("");
      setManualToken("");
    } catch {
      toast.error("Gagal terhubung ke server");
    } finally {
      setConfirming(false);
    }
  }

  // Handle manual input
  function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!manualToken.trim()) {
      toast.error("Masukkan kode token QR");
      return;
    }
    checkToken(manualToken.trim());
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-slate-600 mb-2" />
          <p className="text-xs text-slate-500">Memverifikasi hak akses petugas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900 font-sans">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 h-15 sm:h-16 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Link
              href="/"
              className="text-slate-400 hover:text-slate-700 transition-colors flex-shrink-0"
              title="Kembali ke Beranda"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-slate-200 flex-shrink-0 bg-white">
              <Image
                src="/images/logo.jpg"
                alt="Logo"
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <span className="text-xs sm:text-sm font-bold text-slate-900 block leading-tight truncate">
                Pos Scanner Petugas
              </span>
              <span className="text-[10px] text-slate-500 block leading-none mt-0.5 truncate">
                PT. Benua Green Energy
              </span>
            </div>
          </div>

          {/* Officer identity & logout */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {currentUser && (
              <div className="hidden md:flex flex-col text-right">
                <span className="text-xs font-semibold text-slate-900 leading-tight">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-sky-700 font-medium capitalize">
                  {currentUser.role === "admin" ? "Role: Administrator" : "Role: Petugas Pos"}
                </span>
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="h-8 px-2.5 sm:px-3 text-xs text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700"
            >
              <LogOut className="w-3.5 h-3.5 sm:mr-1" />
              <span className="hidden sm:inline">Keluar</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 py-8">
        <div className="w-full max-w-md space-y-4">
          <Card className="border border-slate-200 shadow-sm bg-white rounded-2xl overflow-hidden">
            <div className="p-5 pb-3 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h1 className="text-base font-bold text-slate-900">
                  Verifikasi Pengambilan Air
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pos Distribusi Utama · Jatah 2 Liter / Orang
                </p>
              </div>
              <Badge variant="outline" className="text-[11px] font-medium border-slate-200 text-slate-700 bg-slate-50">
                {currentUser?.boothId || "BOOTH-01"}
              </Badge>
            </div>

            <CardContent className="p-5 space-y-5">
              {/* Camera Scanner Box */}
              <div className="space-y-3">
                <div className="relative bg-slate-900 rounded-xl overflow-hidden aspect-square max-h-64 mx-auto flex items-center justify-center border border-slate-300">
                  <video
                    ref={videoRef}
                    playsInline
                    muted
                    className={`w-full h-full object-cover ${
                      cameraActive ? "block" : "hidden"
                    }`}
                  />
                  <canvas ref={canvasRef} className="hidden" />

                  {!cameraActive && (
                    <div className="text-center p-6 text-slate-400">
                      <Camera className="w-10 h-10 mx-auto mb-2 text-slate-500" />
                      <p className="text-xs text-slate-300 font-medium">Kamera Belum Aktif</p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Klik tombol di bawah untuk mengaktifkan pemindai QR.
                      </p>
                    </div>
                  )}

                  {cameraActive && scanning && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      <div className="w-48 h-48 border-2 border-emerald-400 rounded-lg relative">
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-emerald-400 animate-pulse" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {!cameraActive ? (
                    <Button
                      onClick={startCamera}
                      className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-lg"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Aktifkan Kamera Pemindai
                    </Button>
                  ) : (
                    <Button
                      onClick={stopCamera}
                      variant="outline"
                      className="w-full h-11 border-slate-300 text-slate-700 text-xs font-medium rounded-lg"
                    >
                      <CameraOff className="w-4 h-4 mr-2" />
                      Matikan Kamera
                    </Button>
                  )}
                </div>

                {cameraError && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>{cameraError}</span>
                  </div>
                )}
              </div>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  atau input manual
                </span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              {/* Manual Token Form */}
              <form onSubmit={handleManualSubmit} className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Contoh: BGE-XXXXXXXX"
                    value={manualToken}
                    onChange={(e) => setManualToken(e.target.value.toUpperCase())}
                    className="h-10 text-sm font-mono border-slate-200 rounded-lg"
                  />
                  <Button
                    type="submit"
                    disabled={processing}
                    className="h-10 bg-slate-900 hover:bg-slate-800 text-white text-xs px-5 rounded-lg"
                  >
                    {processing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Periksa"
                    )}
                  </Button>
                </div>
                <p className="text-[11px] text-slate-400">
                  Masukkan kode token yang tertera di bawah QR penerima.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Verification Result Dialog */}
      <Dialog open={showResult} onOpenChange={setShowResult}>
        <DialogContent className="max-w-sm bg-white text-slate-900 border-slate-200 rounded-2xl p-6">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              {result?.type === "success" && (
                <>
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <DialogTitle className="text-base font-bold text-slate-900">
                      Status: Layak Mengambil
                    </DialogTitle>
                  </div>
                </>
              )}
              {result?.type === "already" && (
                <>
                  <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <DialogTitle className="text-base font-bold text-amber-900">
                      Kuota Sudah Terpakai
                    </DialogTitle>
                  </div>
                </>
              )}
              {result?.type === "error" && (
                <>
                  <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
                    <XCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <DialogTitle className="text-base font-bold text-rose-900">
                      Tidak Terdaftar
                    </DialogTitle>
                  </div>
                </>
              )}
            </div>
            <DialogDescription className="text-xs text-slate-600 pt-1">
              {result?.message}
            </DialogDescription>
          </DialogHeader>

          {result?.user && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1.5 text-xs text-slate-700 my-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Nama Penerima:</span>
                <span className="font-semibold text-slate-900">{result.user.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">WhatsApp:</span>
                <span className="font-medium">{result.user.phone}</span>
              </div>
              {result.type === "success" && (
                <div className="flex justify-between border-t border-slate-200 pt-1.5 mt-1.5">
                  <span className="text-slate-500">Jatah Hari Ini:</span>
                  <span className="font-bold text-emerald-700">2 Liter Air Alkali</span>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0 mt-2">
            {result?.type === "success" ? (
              <div className="w-full space-y-2">
                <Button
                  onClick={handleConfirmDispense}
                  disabled={confirming}
                  className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-lg"
                >
                  {confirming ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Droplets className="w-4 h-4 mr-2" />
                  )}
                  Konfirmasi Serahkan 2 Liter
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowResult(false)}
                  className="w-full h-9 border-slate-200 text-slate-600 text-xs"
                >
                  Batal
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                onClick={() => setShowResult(false)}
                className="w-full h-10 border-slate-200 text-slate-700 text-xs"
              >
                Tutup
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <footer className="text-center py-4 text-xs text-slate-400 border-t border-slate-200 bg-white">
        PT. Benua Green Energy · Blue Gold Resources
      </footer>
    </div>
  );
}
