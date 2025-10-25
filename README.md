# 🍱 Omahan Food – Sistem Informasi Katering Berbasis Web

**Omahan Food** adalah sistem informasi katering berbasis web yang dikembangkan untuk membantu pengelolaan bisnis katering secara digital, efisien, dan terintegrasi.  
Website ini menyediakan fitur pemesanan online, pengelolaan menu dan kategori, sistem langganan paket, laporan penjualan, serta integrasi pembayaran otomatis.

---

## 🚀 Fitur Utama

### 🛒 Untuk Pelanggan
- Melihat daftar menu dan kategori makanan.  
- Melakukan pemesanan langsung melalui website.  
- Memilih jenis paket (harian, mingguan, bulanan).  
- Melakukan pembayaran online dengan **Midtrans Snap**.  
- Melihat status dan riwayat pesanan.  

### 🧑‍🍳 Untuk Admin
- Mengelola kategori dan menu makanan.  
- Mengelola data pelanggan dan pesanan.  
- Dashboard laporan penjualan dan pendapatan.  
- Manajemen kurir dan status pengiriman.  
- Statistik dan analisis penjualan.  

### 🚚 Untuk Kurir
- Melihat daftar pesanan yang harus dikirim.  
- Mengubah status pengiriman (dalam proses, selesai).  
- Melihat riwayat pengantaran.  

---

## 🧩 Teknologi yang Digunakan

| Komponen | Teknologi |
|-----------|------------|
| **Framework Frontend** | [Next.js](https://nextjs.org/) |
| **UI Library** | [ShadCN UI](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com/) |
| **Backend** | [Node.js](https://nodejs.org/), [Express.js](https://expressjs.com/) |
| **Database** | [PostgreSQL](https://www.postgresql.org/) |
| **ORM** | [Prisma](https://www.prisma.io/) |
| **Autentikasi** | [Clerk](https://clerk.com/) / [NextAuth v5](https://next-auth.js.org/) |
| **Payment Gateway** | [Midtrans Snap](https://snap-docs.midtrans.com/) |
| **Hosting & Deployment** | [Vercel](https://vercel.com/) / [Railway](https://railway.app/) |

---

## 🏗️ Arsitektur Sistem

Frontend (Next.js)
│
├── API Routes (Express.js)
│
├── Prisma ORM
│
└── PostgreSQL Database


---

## ⚙️ Cara Instalasi dan Menjalankan Proyek

1. **Clone repository**
   ```bash
   git clone https://github.com/username/omahan-food.git
   cd omahan-food

2. **Install depedensi**
    ```bash
    npm install

3. **Atur environment variable**
    Buat file .env di folder utama dan isi dengan konfigurasi berikut:
    ```bash
    DATABASE_URL="postgresql://user:password@localhost:5432/omahan_food"
    NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=your_client_key
    MIDTRANS_SERVER_KEY=your_server_key
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
    CLERK_SECRET_KEY=your_clerk_secret

4. **Migrasi Database**
    ```bash
    npx prisma migrate dev

5. **Jalankan Server**
    ```bash
    npm run dev

6. **Akses Website**
    ```bash
    http://localhost:3000



### 🖼️ Cuplikan Tampilan Website

#### 🏠 Halaman Beranda
![Omahan Food Homepage](/public/homepage.png)


#### 💳 Halaman Checkout dengan Midtrans
![Omahan Food Checkout](/public/checkout.png)


---
