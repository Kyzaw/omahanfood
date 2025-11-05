# 🍱 OmahanFood - Aplikasi Katering

Aplikasi web katering modern yang dibangun dengan Next.js 15, TypeScript, Prisma, dan PostgreSQL. Sistem ini menyediakan platform lengkap untuk pemesanan katering dengan fitur manajemen menu, payment gateway, dan sistem review.

![Next.js](https://img.shields.io/badge/Next.js-15.3.2-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Prisma](https://img.shields.io/badge/Prisma-6.7.0-2D3748)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-316192)

## ✨ Fitur Utama

### 👥 Multi-Role System
- **Customer**: Pesan menu, tracking order, review & rating
- **Admin**: Manajemen menu, kategori, laporan, review management
- **Kurir**: Manajemen pengiriman

### 🛒 Sistem Pemesanan
- Katalog menu dengan kategori
- Keranjang belanja interaktif
- Pilihan paket (Harian, Mingguan, Bulanan)
- Pilihan waktu pengiriman (Pagi, Siang, Sore)
- Payment gateway Midtrans (Credit Card, E-Wallet, Bank Transfer)

### ⭐ Rating & Review System
- Customer dapat memberikan rating (1-5 bintang) dan komentar
- Review hanya untuk order yang sudah selesai
- Prevent duplicate review per menu per order
- Admin dapat memonitor dan mengelola review
- Statistik rating dan distribusi

### 📊 Dashboard & Laporan
- Statistik penjualan real-time
- Grafik penjualan per kategori
- Top selling products
- Review analytics
- Filter laporan berdasarkan periode

### 🎨 UI/UX Modern
- Responsive design (Mobile & Desktop)
- Dark mode support
- Loading states & skeleton loaders
- Toast notifications
- Modern UI dengan Tailwind CSS & shadcn/ui

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui (Radix UI)
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod

### Backend
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js v5
- **Password Hashing**: bcrypt-ts
- **Payment**: Midtrans Client

### Development Tools
- **Linting**: ESLint
- **Package Manager**: npm

## 📋 Prerequisites

Pastikan Anda telah menginstall:
- Node.js 20.x atau lebih tinggi
- PostgreSQL 14.x atau lebih tinggi
- npm atau yarn

## 🚀 Installation

### 1. Clone Repository
```bash
git clone https://github.com/Kyzaw/omahanfood-katering-app.git
cd omahanfood-katering-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Salin file `env.example` menjadi `.env`:
```bash
cp env.example .env
```

Edit file `.env` dan isi dengan konfigurasi Anda:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/omahanfood?schema=public"

# NextAuth
AUTH_SECRET="your-auth-secret-key"

# Midtrans
NEXT_PUBLIC_MIDTRANS_CLIENT="your-midtrans-client-key"
SECRET_MIDTRANS="your-midtrans-server-key"

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
```

### 4. Setup Database
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Seed database
npx prisma db seed
```

### 5. Run Development Server
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## 📁 Struktur Project

```
omahanfood-katering-app/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Auth pages (login, register)
│   ├── admin/               # Admin dashboard & management
│   ├── api/                 # API routes
│   ├── checkout/            # Checkout page
│   └── ...
├── components/              # React components
│   ├── admin/              # Admin-specific components
│   ├── reports/            # Report components
│   ├── ui/                 # shadcn/ui components
│   └── ...
├── hooks/                   # Custom React hooks
├── lib/                     # Utility functions & configs
│   ├── actions.ts          # Server actions
│   ├── auth-edge.ts        # Auth utilities
│   ├── prisma.ts           # Prisma client
│   └── utils.ts            # Helper functions
├── prisma/                  # Database schema & migrations
│   ├── migrations/         # Migration files
│   └── schema.prisma       # Prisma schema
├── public/                  # Static assets
└── types/                   # TypeScript type definitions
```

## 🔑 Default Accounts

Setelah seeding database, Anda dapat login dengan:

**Admin:**
- Email: `admin@omahanfood.com`
- Password: `admin123`

**Customer:**
- Email: `customer@example.com`
- Password: `customer123`

## 📖 API Documentation

### Authentication
- `POST /api/auth/register` - Register user baru
- `POST /api/auth/signin` - Login user

### Orders
- `GET /api/order/history` - Get order history
- `POST /api/order` - Create new order

### Reviews
- `GET /api/reviews?menuId={id}` - Get reviews by menu
- `POST /api/reviews` - Create review
- `DELETE /api/admin/reviews/[id]` - Delete review (Admin only)

### Transactions
- `POST /api/transactions` - Create payment transaction

Untuk dokumentasi lengkap, lihat file:
- [REVIEW_FEATURE.md](./REVIEW_FEATURE.md)
- [ADMIN_REVIEW_FEATURE.md](./ADMIN_REVIEW_FEATURE.md)

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `AUTH_SECRET` | NextAuth secret key | ✅ |
| `NEXT_PUBLIC_MIDTRANS_CLIENT` | Midtrans client key | ✅ |
| `SECRET_MIDTRANS` | Midtrans server key | ✅ |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps API key | ✅ |
| `NODE_ENV` | Environment (development/production) | ❌ |

### Cara Mendapatkan API Keys

**Midtrans:**
1. Daftar di [Midtrans Dashboard](https://dashboard.midtrans.com/)
2. Pilih environment (Sandbox untuk testing)
3. Copy Client Key dan Server Key dari Settings → Access Keys

**AUTH_SECRET:**
```bash
# Generate random secret
openssl rand -base64 32
```

## 🧪 Testing

```bash
# Run linting
npm run lint

# Build production
npm run build

# Start production server
npm start
```

## 📦 Database Schema

### User Roles
- `USER` - Customer biasa
- `ADMIN` - Administrator sistem
- `KURIR` - Kurir pengiriman

### Order Status Flow
```
PENDING → DIBAYAR → DIMASAK → SIAP_KIRIM → DIKIRIM → SELESAI
```

### Main Models
- **User** - User accounts dengan role-based access
- **Menu** - Menu items dengan kategori
- **Category** - Kategori menu
- **Order** - Order transactions
- **Review** - Rating & review untuk menu

Lihat detail schema di [prisma/schema.prisma](./prisma/schema.prisma)

## 🚢 Deployment

### Vercel (Recommended)
1. Push code ke GitHub
2. Import project di [Vercel](https://vercel.com)
3. Set environment variables
4. Deploy

### Manual Deployment
```bash
# Build production
npm run build

# Start production server
npm start
```

**Note:** Pastikan PostgreSQL database sudah running dan accessible dari production server.

## 👨‍💻 Author

**Kyzaw**
- GitHub: [@Kyzaw](https://github.com/Kyzaw)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Midtrans](https://midtrans.com/)

## 📞 Support

Jika Anda memiliki pertanyaan atau menemukan bug, silakan buat issue di GitHub repository.

---

Created by Kyzaww
