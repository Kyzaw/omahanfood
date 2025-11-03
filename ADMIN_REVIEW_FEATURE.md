# Fitur Admin Review Management

## Overview
Halaman admin untuk mengelola dan memonitor semua review dari customer, termasuk statistik, filter, dan kemampuan untuk menghapus review yang tidak sesuai.

## Fitur Utama

### 1. **Dashboard Statistik**
Menampilkan overview lengkap tentang review:

#### **Kartu Statistik:**
- **Total Reviews**: Jumlah total review dan berapa yang memiliki komentar
- **Rating Rata-rata**: Rating keseluruhan dengan visualisasi bintang
- **Review Baru**: Jumlah review dalam 7 hari terakhir
- **Rating Rendah**: Alert untuk review dengan rating 1-2 bintang

#### **Distribusi Rating:**
- Grafik bar horizontal untuk setiap rating (1-5 bintang)
- Menampilkan jumlah dan persentase untuk setiap rating
- Visualisasi gradient orange-red untuk bar

### 2. **Tabel Review Management**

#### **Kolom Tabel:**
- **Menu**: Gambar dan nama menu yang direview
- **Customer**: Nama dan email customer
- **Rating**: Badge warna dan visualisasi bintang
  - 4-5 bintang: Hijau
  - 3 bintang: Kuning
  - 1-2 bintang: Merah
- **Komentar**: Preview komentar (truncated)
- **Tanggal**: Tanggal dan waktu review dibuat
- **Aksi**: Tombol delete

#### **Fitur Filter & Search:**
- **Search Bar**: Cari berdasarkan nama menu, customer, atau komentar
- **Filter Rating**: Dropdown untuk filter berdasarkan rating (1-5 bintang atau semua)
- **Results Counter**: Menampilkan jumlah hasil filter

### 3. **Delete Review**

#### **Konfirmasi Dialog:**
- Alert dialog sebelum menghapus
- Menampilkan nama customer dan menu
- Tombol Batal dan Hapus (merah)
- Loading state saat proses delete

#### **Validasi:**
- Hanya admin yang bisa delete
- Konfirmasi sebelum menghapus
- Toast notification untuk feedback

## Struktur File

```
app/
├── admin/
│   └── reviews/
│       └── page.tsx              # Main admin reviews page
├── api/
│   └── admin/
│       └── reviews/
│           └── [id]/
│               └── route.ts      # DELETE API endpoint
components/
├── admin/
│   └── ReviewsTable.tsx          # Table component with filters
└── AdminNavbar.tsx               # Updated with Reviews link
```

## API Endpoints

### DELETE /api/admin/reviews/[id]
Menghapus review berdasarkan ID (Admin only).

**Authorization:** Admin role required

**Response Success:**
```json
{
  "message": "Review deleted successfully"
}
```

**Response Error:**
```json
{
  "error": "Unauthorized" | "Review not found" | "Failed to delete review"
}
```

## Komponen

### 1. AdminReviewsPage (`/app/admin/reviews/page.tsx`)

**Server Component** yang fetch data review dan statistik.

**Features:**
- Fetch semua review dengan relasi (user, menu, order)
- Calculate statistics (total, average, distribution)
- Pass data ke ReviewsTable component

**Statistik yang dihitung:**
```typescript
- totalReviews: number
- averageRating: number
- ratingDistribution: { 1: number, 2: number, 3: number, 4: number, 5: number }
- reviewsWithComments: number
- lowRatingReviews: number (rating 1-2)
- recentReviews: number (last 7 days)
```

### 2. ReviewsTable (`/components/admin/ReviewsTable.tsx`)

**Client Component** untuk menampilkan dan mengelola review.

**State Management:**
```typescript
- reviews: Review[]              // List of reviews
- filterRating: string           // Filter by rating
- searchQuery: string            // Search query
- deleteDialogOpen: boolean      // Delete dialog state
- selectedReview: Review | null  // Review to delete
- isDeleting: boolean            // Loading state
```

**Functions:**
```typescript
- handleDeleteClick(review)      // Open delete dialog
- handleDeleteConfirm()          // Confirm and delete review
- getRatingColor(rating)         // Get color based on rating
- getRatingBadge(rating)         // Get badge style based on rating
```

**Filter Logic:**
```typescript
const filteredReviews = reviews.filter((review) => {
  const matchesRating = filterRating === "all" || review.rating === parseInt(filterRating);
  const matchesSearch = searchQuery === "" || 
    review.menu.name.includes(searchQuery) ||
    review.user.name.includes(searchQuery) ||
    review.comment?.includes(searchQuery);
  return matchesRating && matchesSearch;
});
```

## UI/UX Design

### **Color Scheme:**
- **Rating Tinggi (4-5)**: Green (success)
- **Rating Sedang (3)**: Yellow (warning)
- **Rating Rendah (1-2)**: Red (danger)

### **Responsive Design:**
- Desktop: Full table view
- Mobile: Scrollable table dengan touch-friendly buttons

### **Loading States:**
- Skeleton loaders untuk initial load
- Button disabled state saat delete
- Toast notifications untuk feedback

### **Empty States:**
- "Tidak ada review ditemukan" jika filter tidak ada hasil
- Icon dan pesan informatif

## Security & Validation

### **Authorization:**
```typescript
// Check admin role
if (!session?.user || session.user.role !== "ADMIN") {
  redirect("/");
}
```

### **API Protection:**
```typescript
// Verify admin in API route
if (!session?.user?.id || session.user.role !== "ADMIN") {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

### **Delete Validation:**
- Check if review exists before delete
- Confirm dialog sebelum delete
- Error handling dengan try-catch

## Cara Penggunaan

### **Untuk Admin:**

1. **Akses Halaman Review**
   - Login sebagai admin
   - Klik "Reviews" di sidebar
   - Lihat dashboard statistik

2. **Filter & Search Review**
   - Gunakan search bar untuk cari review
   - Pilih filter rating dari dropdown
   - Lihat hasil yang difilter

3. **Delete Review**
   - Klik tombol trash di kolom aksi
   - Konfirmasi di dialog
   - Review akan terhapus dan tabel refresh

4. **Monitor Rating Rendah**
   - Perhatikan kartu "Rating Rendah"
   - Filter review dengan rating 1-2
   - Tindak lanjut dengan customer atau menu

### **Best Practices:**

1. **Monitor Regular**
   - Check review baru setiap hari
   - Perhatikan trend rating menurun
   - Respond ke rating rendah

2. **Delete Policy**
   - Hanya delete review spam atau offensive
   - Jangan delete review negatif yang valid
   - Document alasan delete

3. **Action Items**
   - Rating rendah → Improve menu quality
   - Banyak komentar negatif → Review menu
   - Trend positif → Promote menu

## Integrasi dengan Fitur Lain

### **Dashboard Admin:**
- Tambahkan widget review summary
- Link ke halaman review detail

### **Menu Management:**
- Tampilkan rating di menu list
- Link ke review untuk menu tertentu

### **Customer Management:**
- Lihat review history per customer
- Identify frequent reviewers

## Future Enhancements

### **Fitur Tambahan:**
1. **Review Response**
   - Admin bisa reply ke review
   - Customer notification

2. **Review Moderation**
   - Flag inappropriate reviews
   - Approval system untuk review

3. **Analytics**
   - Review trends over time
   - Rating correlation dengan sales
   - Sentiment analysis

4. **Export Data**
   - Export review ke CSV/Excel
   - Generate review reports

5. **Bulk Actions**
   - Delete multiple reviews
   - Bulk approve/reject

6. **Advanced Filters**
   - Filter by date range
   - Filter by menu category
   - Filter by customer

7. **Review Insights**
   - Most reviewed menus
   - Best/worst performing menus
   - Customer satisfaction score

## Troubleshooting

### **Review tidak muncul:**
- Check database connection
- Verify Prisma schema
- Check include relations

### **Delete tidak berhasil:**
- Verify admin role
- Check API endpoint
- Review error logs

### **Filter tidak bekerja:**
- Check filter logic
- Verify state management
- Console log filtered results

## Performance Optimization

### **Database Queries:**
```typescript
// Use select untuk limit data
include: {
  user: { select: { name: true, email: true } },
  menu: { select: { name: true, image: true } },
}
```

### **Client-Side:**
- Debounce search input
- Pagination untuk large datasets
- Virtual scrolling untuk performance

### **Caching:**
- Cache statistics
- Revalidate on delete
- Use React Query untuk data fetching
