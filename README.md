# 💧 BGE Alkali Point

**Sistem Distribusi Air Minum Alkali Gratis Berbasis QR Code**  
Program Inisiatif Sosial & Kesehatan Masyarakat oleh **PT. Benua Green Energy (Blue Gold Resources)**.

---

## 📌 Gambaran Umum

BGE Alkali Point adalah aplikasi berbasis web modern yang dirancang untuk mengelola dan memfasilitasi pembagian air alkali gratis berjatah **2 Liter per hari** untuk masyarakat sekitar secara tertib, adil, dan transparan.

### Fitur Utama:
1. **Pendaftaran Warga (`/register`)**: Warga mendaftarkan identitas (Nama, WhatsApp, RT/RW) sekali saja tanpa biaya.
2. **Kartu QR Digital (`/my-qr`)**: Kartu tanda penerima resmi berformat ID Card digital dilengkapi QR Code unik, status kuota harian (2 Liter), dan fitur Cetak/Simpan PDF.
3. **Pos Scanner Petugas (`/scanner`)**: Pemindai kamera otomatis & input manual bagi petugas pos untuk memvalidasi tiket warga dan mencatat penyerahan air secara instan.
4. **Panel Admin & Monitoring (`/admin`)**: Dashboard real-time untuk memantau total liter tersalurkan, jumlah penerima aktif, riwayat transaksi, dan ekspor data ke file CSV.
5. **Role-Based Access Control (RBAC)**: Pembatasan hak akses berbasis peran menggunakan Next.js Middleware dan proteksi sesi.

---

## 🔐 Kredensial Login Internal (Demo)

Buka halaman `/login` untuk mengakses portal internal:

| Peran (Role) | Username | Password | Hak Akses Halaman |
|:---|:---|:---|:---|
| **Petugas Pos** | `petugas` | `petugas123` | `/scanner` (Pos Scanner) |
| **Administrator** | `admin` | `admin123` | `/admin` (Dashboard) & `/scanner` |

*Warga/publik tidak memerlukan login untuk mendaftar dan melihat kartu QR.*

---

## 🛠️ Teknologi yang Digunakan

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, TypeScript)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Komponen UI**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **QR Generator**: `qrcode.react`
- **QR Scanner**: Web `BarcodeDetector` API + manual token fallback
- **Notifikasi**: `sonner`

---

## 🚀 Menjalankan Secara Lokal

```bash
# 1. Clone repository
git clone https://github.com/whyuardi/BGEAlkaliPoint.git
cd BGEAlkaliPoint

# 2. Install dependencies
npm install

# 3. Jalankan server development
npm run dev

# 4. Buka di browser
http://localhost:3000
```

---

## 🏢 Tentang Perusahaan

- **Perusahaan**: PT. Benua Green Energy
- **Brand / Merek**: Blue Gold Resources
- **Website Resmi**: [www.benuagreenenergy.com](http://www.benuagreenenergy.com)
