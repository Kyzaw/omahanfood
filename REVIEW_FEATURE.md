# Fitur Rating & Review untuk Menu

## Overview
Fitur ini memungkinkan customer untuk memberikan rating (1-5 bintang) dan komentar untuk setiap menu yang telah mereka pesan dan selesai.

## Model Database

### Review Model
```prisma
model Review {
  id        String   @id @default(cuid())
  rating    Int      // 1-5 stars
  comment   String?
  user      User     @relation(fields: [userId], references: [id])
  userId    String
  menu      Menu     @relation(fields: [menuId], references: [id])
  menuId    String
  order     Order    @relation(fields: [orderId], references: [id])
  orderId   String
  createdAt DateTime @default(now())
  
  @@unique([orderId, menuId]) // Prevent duplicate reviews
}
```

**Fitur Utama:**
- `orderId` - Menghubungkan review dengan order tertentu
- `@@unique([orderId, menuId])` - Mencegah customer memberikan review duplikat untuk menu yang sama dalam satu order

## API Endpoints

### POST /api/reviews
Membuat review baru untuk menu yang telah dipesan.

**Request Body:**
```json
{
  "orderId": "string",
  "menuId": "string",
  "rating": 1-5,
  "comment": "string (optional)"
}
```

**Validasi:**
- User harus login
- Order harus milik user yang login
- Order status harus "SELESAI"
- Belum pernah review menu tersebut di order yang sama
- Rating harus antara 1-5

**Response:**
```json
{
  "id": "string",
  "rating": 5,
  "comment": "string",
  "userId": "string",
  "menuId": "string",
  "orderId": "string",
  "createdAt": "timestamp",
  "user": {
    "name": "string"
  },
  "menu": {
    "name": "string"
  }
}
```

### GET /api/reviews?menuId={menuId}
Mendapatkan semua review untuk menu tertentu.

**Response:**
```json
{
  "reviews": [...],
  "averageRating": 4.5,
  "totalReviews": 10
}
```

### GET /api/reviews?orderId={orderId}
Mendapatkan semua review untuk order tertentu.

**Response:**
```json
{
  "reviews": [...]
}
```

### GET /api/order/history
Mendapatkan riwayat order yang sudah selesai untuk user yang login.

**Response:**
```json
{
  "orders": [
    {
      "id": "string",
      "status": "SELESAI",
      "items": [...],
      "reviews": [...]
    }
  ]
}
```

## Halaman & Komponen

### 1. Order History Page (`/orderhistory`)
Menampilkan semua pesanan yang sudah selesai dengan tombol untuk memberikan review.

**Fitur:**
- List semua order dengan status "SELESAI"
- Tombol "Beri Review" untuk setiap menu
- Tombol berubah menjadi "Sudah Review" jika sudah direview
- Menampilkan detail order lengkap

### 2. ReviewDialog Component
Dialog modal untuk memberikan rating dan komentar.

**Fitur:**
- Star rating interaktif (1-5 bintang)
- Textarea untuk komentar (maksimal 500 karakter)
- Validasi rating wajib diisi
- Toast notification untuk sukses/error

### 3. ReviewList Component
Menampilkan daftar review untuk menu tertentu.

**Fitur:**
- Rating summary dengan rata-rata bintang
- Total jumlah review
- List review dengan nama user, tanggal, rating, dan komentar
- Avatar placeholder untuk user

### 4. Menu Detail Page (`/menu/[id]`)
Halaman detail menu yang menampilkan informasi menu dan review.

**Fitur:**
- Gambar menu
- Informasi menu (nama, kategori, deskripsi, harga)
- Rating summary
- Daftar semua review

## Cara Penggunaan

### Untuk Customer:

1. **Pesan Menu**
   - Pilih menu dan checkout
   - Tunggu hingga order selesai (status "SELESAI")

2. **Beri Review**
   - Buka halaman "History" di navbar
   - Klik tombol "Beri Review" pada menu yang ingin direview
   - Pilih rating (1-5 bintang)
   - Tulis komentar (opsional)
   - Klik "Kirim Review"

3. **Lihat Review**
   - Buka halaman detail menu
   - Scroll ke bagian "Rating & Review"
   - Lihat rating rata-rata dan semua review

### Untuk Developer:

1. **Menjalankan Migration**
   ```bash
   npx prisma migrate dev
   ```

2. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

3. **Testing**
   - Buat order dengan status "SELESAI"
   - Akses `/orderhistory`
   - Test submit review
   - Cek review muncul di `/menu/[id]`

## Validasi & Constraint

1. **Rating**: Harus integer antara 1-5
2. **Comment**: Opsional, maksimal 500 karakter
3. **Unique Constraint**: Satu user hanya bisa review satu menu sekali per order
4. **Order Status**: Hanya order dengan status "SELESAI" yang bisa direview
5. **Authorization**: User hanya bisa review order miliknya sendiri

## UI/UX Features

- **Interactive Star Rating**: Hover effect dan animasi
- **Real-time Validation**: Validasi client-side sebelum submit
- **Toast Notifications**: Feedback sukses/error yang jelas
- **Responsive Design**: Bekerja di mobile dan desktop
- **Loading States**: Indikator loading saat fetch data
- **Empty States**: Pesan informatif jika belum ada review

## Navigation

Review feature dapat diakses melalui:
- **Desktop Navbar**: Link "History" dengan icon History
- **Mobile Navbar**: Belum ditambahkan (bisa ditambahkan jika diperlukan)
- **Direct URL**: `/orderhistory`

## Future Enhancements

Beberapa fitur yang bisa ditambahkan:
1. Edit/delete review
2. Review images upload
3. Helpful/like button untuk review
4. Filter review by rating
5. Sort review (newest, highest rating, etc.)
6. Review moderation untuk admin
7. Email notification saat ada review baru
8. Review reminder setelah order selesai
