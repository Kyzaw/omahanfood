const { PrismaClient } = require('./app/generated/prisma');
const crypto = require('crypto');

const prisma = new PrismaClient();

function generateCuid() {
  return 'cm' + crypto.randomBytes(11).toString('hex');
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const CUSTOMER_NAMES = [
  'Siti Nurhaliza',
  'Ahmad Fauzi',
  'Dewi Lestari',
  'Dian Sastrowardoyo',
  'Dimas Anggara',
  'Anisa Rahma',
  'Bayu Skak',
  'Fajar Nugraha',
  'Gita Gutawa',
  'Hendra Setiawan',
  'Indah Permatasari',
  'Joko Anwar',
  'Kartika Putri',
  'Lukman Sardi',
  'Maya Septha',
  'Nadia Vega',
  'Raditya Dika',
  'Sari Nila',
  'Teguh Prakoso',
  'Bambang Soediro',
  'Rina Wulandari',
  'Aris Munandar',
  'Mega Utami',
  'Budi Santoso',
  'Putri Handayani',
  'Eko Prasetyo',
  'Fitriani Indah',
  'Gilang Ramadhan',
  'Hani Wijaya',
  'Irfan Hakim'
];

const BOGOR_ADDRESSES = [
  'Jl. Pajajaran No. 24, Baranangsiang, Bogor Timur, Kota Bogor, Jawa Barat',
  'Perumahan Baranangsiang Indah Blok C2/15, Katulampa, Kota Bogor, Jawa Barat',
  'Jl. Surya Kencana No. 112, Babakan Pasar, Bogor Tengah, Kota Bogor, Jawa Barat',
  'Jl. Pandu Raya No. 45, Tegal Gundil, Bogor Utara, Kota Bogor, Jawa Barat',
  'Jl. Sholeh Iskandar No. 88, Kedungbadak, Tanah Sareal, Kota Bogor, Jawa Barat',
  'Komplek IPB Baranangsiang Blok B No. 10, Tegallega, Bogor Tengah, Kota Bogor',
  'Jl. Bangbarung Raya No. 18, Bantarjati, Bogor Utara, Kota Bogor, Jawa Barat',
  'Perumahan Yasmin Sektor 3 No. 42, Curugmekar, Bogor Barat, Kota Bogor',
  'Jl. Pahlawan No. 33, Empang, Bogor Selatan, Kota Bogor, Jawa Barat',
  'Jl. Ahmad Yani No. 56, Tanah Sareal, Tanah Sareal, Kota Bogor, Jawa Barat',
  'Perumahan Cimanggu Permai Blok B1/12, Kedung Waringin, Tanah Sareal, Kota Bogor',
  'Jl. Dr. Sumeru No. 67, Menteng, Bogor Barat, Kota Bogor, Jawa Barat',
  'Jl. R.E. Martadinata No. 21, Cibogor, Bogor Tengah, Kota Bogor, Jawa Barat',
  'Perumahan Bantarjati Indah No. 9, Bantarjati, Bogor Utara, Kota Bogor',
  'Jl. Cikaret Raya No. 74, Harapan Jaya, Cibinong, Kabupaten Bogor, Jawa Barat',
  'Perumahan Pakuan Hill Cluster Edelweiss No. 16, Cipaku, Bogor Selatan, Kota Bogor',
  'Jl. Malabar Ujung No. 14, Tegallega, Bogor Tengah, Kota Bogor, Jawa Barat',
  'Jl. Pemuda No. 29, Tanah Sareal, Kota Bogor, Jawa Barat',
  'Perumahan Villa Duta Blok C No. 5, Baranangsiang, Bogor Timur, Kota Bogor',
  'Jl. Batutulis No. 50, Batutulis, Bogor Selatan, Kota Bogor, Jawa Barat'
];

const ORDER_NOTES = [
  'Tolong sambal dipisah ya',
  'Kirim sebelum jam 12.00 siang, terima kasih',
  'Jangan terlalu pedas',
  'Titip di pos satpam depan perumahan',
  'Pagar hitam, tolong bel bila sudah sampai',
  'Nasi tolong agak pulen',
  'Sendok dan tisu diperbanyak ya',
  'Untuk makan siang kantor meeting',
  'Sayur dipisah kuahnya',
  'Tolong pastikan makanan masih hangat',
  null,
  null,
  null
];

const REVIEW_COMMENTS = [
  'Rasanya sangat enak dan bumbunya meresap sampai ke dalam. Keluarga di rumah suka sekali!',
  'Paket dietnya sangat membantu defisit kalori, rasanya tetap nikmat dan selalu fresh.',
  'Porsi sangat pas untuk makan siang kantor. Praktis dan packing higienis.',
  'Tumpengnya cantik banget, cocok untuk syukuran. Rasanya gurih dan lauknya lengkap.',
  'Lauknya bervariasi setiap hari, jadi nggak bosen makan catering di Omahan Food.',
  'Pengiriman selalu tepat waktu sebelum jam istirahat siang. Kurir juga ramah.',
  'Menu sehat tapi rasanya tidak hambar, recommended banget buat yang lagi jaga pola makan!',
  'Harga sangat terjangkau dengan kualitas rasa masakan rumahan premium.',
  'Nasi pulen, lauk pauk higienis dan kemasannya rapi sekali.',
  'Sudah langganan sebulan lebih, konsistensi rasa dan pelayanannya jempolan.',
  'Paket personalnya pas di kantong, porsi mengenyangkan dan bergizi seimbang.',
  'Ayamnya empuk, sambalnya mantap dan pas pedasnya.',
  'Sangat membantu untuk pekerja kantoran yang nggak sempat masak sendiri.',
  'Tumpeng mininya menarik dan rasanya juara! Tamu-tamu kantor pada memuji.',
  'Sayurnya fresh dan kriuk, packaging rapi tanpa tumpah.'
];

async function seed() {
  console.log('🚀 Memulai proses seeding data transaksi...');

  // 1. Ambil menus dan categories
  const menus = await prisma.menu.findMany();
  if (menus.length === 0) {
    throw new Error('Menu tidak ditemukan dalam database!');
  }
  console.log(`✅ Ditemukan ${menus.length} menu.`);

  // 2. Ambil kurir
  const courier = await prisma.user.findFirst({
    where: { role: 'KURIR' }
  });
  const courierId = courier ? courier.id : null;
  console.log(`✅ Courier ID: ${courierId || 'None'}`);

  // 3. Pastikan user customer cukup banyak
  let users = await prisma.user.findMany({
    where: { role: 'USER' }
  });

  const existingEmails = new Set(users.map(u => u.email));
  const newUsersToCreate = [];

  for (const name of CUSTOMER_NAMES) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '.');
    const email = `${slug}@gmail.com`;
    if (!existingEmails.has(email)) {
      newUsersToCreate.push({
        name,
        email,
        role: 'USER',
      });
      existingEmails.add(email);
    }
  }

  if (newUsersToCreate.length > 0) {
    console.log(`📝 Menambahkan ${newUsersToCreate.length} pengguna customer baru...`);
    for (const u of newUsersToCreate) {
      const created = await prisma.user.create({ data: u });
      users.push(created);
    }
  }
  console.log(`✅ Total customer users aktif: ${users.length}`);

  // 4. Siapkan data transaksi
  // Kita ingin transaksi mencakup:
  // - Hari ini (7 Okt 2026): 15 transaksi
  // - 7 hari terakhir (1 Okt - 6 Okt 2026): 15-20 transaksi per hari (~100 transaksi)
  // - 30 hari terakhir (8 Sep - 30 Sep 2026): 5-10 transaksi per hari (~140 transaksi)
  // - 12 bulan terakhir (Nov 2025 - Agu 2026): 10-15 transaksi per bulan (~120 transaksi)
  // Total ~375 transaksi!

  const paymentMethods = ['qris', 'bank_transfer', 'gopay', 'shopeepay', 'cod'];
  const deliveryTimes = ['PAGI', 'SIANG', 'SORE'];
  const jenisPaketList = ['HARIAN', 'HARIAN', 'HARIAN', 'HARIAN', 'MINGGUAN', 'BULANAN'];

  const ordersData = [];
  const reviewsToCreate = [];

  // Helper untuk membuat 1 order
  function createOrderConfig(date, forcedStatus = null) {
    const user = getRandomElement(users);
    const jenisPaket = getRandomElement(jenisPaketList);
    const deliveryTime = getRandomElement(deliveryTimes);
    const paymentMethod = getRandomElement(paymentMethods);
    const note = getRandomElement(ORDER_NOTES);
    const addressTemplate = getRandomElement(BOGOR_ADDRESSES);
    const phone = `+628${getRandomInt(11, 23)}${getRandomInt(1000000, 9999999)}`;
    const fullAddress = `${user.name}, ${phone}, ${addressTemplate}`;

    const totalDeliveries = jenisPaket === 'HARIAN' ? 1 : jenisPaket === 'MINGGUAN' ? 6 : 25;
    const paketMultiplier = jenisPaket === 'HARIAN' ? 1 : jenisPaket === 'MINGGUAN' ? 6 : 25;

    // Pilih 1 - 3 menu berbeda
    const numItems = getRandomInt(1, 3);
    const shuffledMenus = [...menus].sort(() => 0.5 - Math.random());
    const selectedMenus = shuffledMenus.slice(0, numItems);

    const items = selectedMenus.map(m => {
      const baseQty = getRandomInt(1, 2);
      const totalQty = baseQty * paketMultiplier;
      return {
        id: m.id,
        menuId: m.id,
        name: m.name,
        price: m.price,
        quantity: totalQty
      };
    });

    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    let status = forcedStatus;
    if (!status) {
      status = 'SELESAI'; // Default untuk data historis
    }

    const deliveredCount = status === 'SELESAI' 
      ? totalDeliveries 
      : status === 'DIKIRIM' 
        ? Math.max(1, Math.floor(totalDeliveries / 2)) 
        : 0;

    const paidAt = (status === 'SELESAI' || status === 'DIKIRIM' || status === 'DIMASAK' || status === 'SIAP_KIRIM' || status === 'DIBAYAR')
      ? new Date(date.getTime() + getRandomInt(60, 900) * 1000)
      : null;

    const orderId = generateCuid();

    // Review untuk sebagian order SELESAI
    if (status === 'SELESAI' && Math.random() < 0.25) {
      const reviewedMenu = getRandomElement(selectedMenus);
      const ratingWeights = [5, 5, 5, 5, 4, 4, 3];
      const rating = getRandomElement(ratingWeights);
      const comment = getRandomElement(REVIEW_COMMENTS);
      const reviewDate = new Date(date.getTime() + getRandomInt(3600, 86400) * 1000);

      reviewsToCreate.push({
        id: generateCuid(),
        rating,
        comment,
        userId: user.id,
        menuId: reviewedMenu.id,
        orderId: orderId,
        createdAt: reviewDate
      });
    }

    return {
      id: orderId,
      userId: user.id,
      courierId: courierId,
      status: status,
      deliveryTime: deliveryTime,
      items: items,
      jenisPaket: jenisPaket,
      totalDeliveries: totalDeliveries,
      deliveredCount: deliveredCount,
      nextDeliveryDate: status === 'SELESAI' ? null : new Date(date.getTime() + 86400000),
      totalAmount: totalAmount,
      address: fullAddress,
      paymentMethod: paymentMethod,
      paidAt: paidAt,
      notes: note,
      createdAt: date,
    };
  }

  // --- HARI INI (7 Oktober 2026) ---
  console.log('📅 Membuat data transaksi untuk Hari Ini (7 Okt 2026)...');
  const todayStatusOptions = [
    'SELESAI', 'SELESAI', 'SELESAI', 'SELESAI', 'SELESAI', 'SELESAI',
    'DIKIRIM', 'DIKIRIM', 'DIMASAK', 'SIAP_KIRIM', 'DIBAYAR'
  ];
  for (let i = 0; i < 16; i++) {
    const hour = getRandomInt(8, 18);
    const minute = getRandomInt(0, 59);
    const date = new Date(Date.UTC(2026, 9, 7, hour, minute, 0));
    const status = getRandomElement(todayStatusOptions);
    ordersData.push(createOrderConfig(date, status));
  }

  // --- 7 HARI TERAKHIR (30 Sep - 6 Okt 2026) ---
  console.log('📅 Membuat data transaksi untuk 7 Hari Terakhir...');
  for (let day = 6; day >= 1; day--) {
    const ordersPerDay = getRandomInt(14, 20);
    for (let i = 0; i < ordersPerDay; i++) {
      const hour = getRandomInt(7, 20);
      const minute = getRandomInt(0, 59);
      const date = new Date(Date.UTC(2026, 9, day, hour, minute, 0));
      ordersData.push(createOrderConfig(date, 'SELESAI'));
    }
  }

  // Tambahkan transaksi 30 Sep 2026
  for (let i = 0; i < 15; i++) {
    const hour = getRandomInt(7, 20);
    const minute = getRandomInt(0, 59);
    const date = new Date(Date.UTC(2026, 8, 30, hour, minute, 0));
    ordersData.push(createOrderConfig(date, 'SELESAI'));
  }

  // --- BULAN TERAKHIR (1 Sep - 29 Sep 2026) ---
  console.log('📅 Membuat data transaksi untuk Bulan September 2026 (30 Days View)...');
  for (let day = 1; day <= 29; day++) {
    const ordersPerDay = getRandomInt(5, 9);
    for (let i = 0; i < ordersPerDay; i++) {
      const hour = getRandomInt(7, 20);
      const minute = getRandomInt(0, 59);
      const date = new Date(Date.UTC(2026, 8, day, hour, minute, 0));
      ordersData.push(createOrderConfig(date, 'SELESAI'));
    }
  }

  // --- 1 TAHUN TERAKHIR (Nov 2025 - Agu 2026) ---
  console.log('📅 Membuat data transaksi historis (1 Year View: Nov 2025 - Agu 2026)...');
  const pastMonths = [
    { year: 2025, month: 10, days: 30, count: 12 }, // Nov 2025
    { year: 2025, month: 11, days: 31, count: 14 }, // Des 2025
    { year: 2026, month: 0, days: 31, count: 14 },  // Jan 2026
    { year: 2026, month: 1, days: 28, count: 15 },  // Feb 2026
    { year: 2026, month: 2, days: 31, count: 16 },  // Mar 2026
    { year: 2026, month: 3, days: 30, count: 17 },  // Apr 2026
    { year: 2026, month: 4, days: 31, count: 18 },  // Mei 2026
    { year: 2026, month: 5, days: 30, count: 19 },  // Jun 2026
    { year: 2026, month: 6, days: 31, count: 20 },  // Jul 2026
    { year: 2026, month: 7, days: 31, count: 22 },  // Agu 2026
  ];

  for (const m of pastMonths) {
    for (let i = 0; i < m.count; i++) {
      const day = getRandomInt(1, m.days);
      const hour = getRandomInt(7, 20);
      const minute = getRandomInt(0, 59);
      const date = new Date(Date.UTC(m.year, m.month, day, hour, minute, 0));
      ordersData.push(createOrderConfig(date, 'SELESAI'));
    }
  }

  console.log(`📦 Siap menyisipkan ${ordersData.length} data order ke database...`);

  // Insert orders in chunks of 50
  const CHUNK_SIZE = 50;
  for (let i = 0; i < ordersData.length; i += CHUNK_SIZE) {
    const chunk = ordersData.slice(i, i + CHUNK_SIZE);
    await prisma.order.createMany({
      data: chunk
    });
    console.log(`  Progress: ${Math.min(i + CHUNK_SIZE, ordersData.length)} / ${ordersData.length} orders tersimpan`);
  }

  // Insert reviews
  console.log(`⭐ Menyisipkan ${reviewsToCreate.length} review ke database...`);
  for (let i = 0; i < reviewsToCreate.length; i += CHUNK_SIZE) {
    const chunk = reviewsToCreate.slice(i, i + CHUNK_SIZE);
    await prisma.review.createMany({
      data: chunk
    });
    console.log(`  Progress: ${Math.min(i + CHUNK_SIZE, reviewsToCreate.length)} / ${reviewsToCreate.length} reviews tersimpan`);
  }

  // Hitung ringkasan statistik
  const totalOrders = await prisma.order.count();
  const completedOrders = await prisma.order.count({ where: { status: 'SELESAI' } });
  const totalRevenue = await prisma.order.aggregate({
    where: { status: 'SELESAI' },
    _sum: { totalAmount: true }
  });
  const totalReviews = await prisma.review.count();

  console.log('\n=============================================');
  console.log('🎉 SEEDING TRANSAKSI BERHASIL LENGKAP!');
  console.log(`📊 Total Order di Database: ${totalOrders}`);
  console.log(`✅ Order Selesai: ${completedOrders}`);
  console.log(`💰 Total Omset/Revenue: Rp ${(totalRevenue._sum.totalAmount || 0).toLocaleString('id-ID')}`);
  console.log(`⭐ Total Review Pelanggan: ${totalReviews}`);
  console.log('=============================================\n');
}

seed()
  .catch((err) => {
    console.error('❌ Terjadi kesalahan saat seeding:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
