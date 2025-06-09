import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const type = searchParams.get('type') || 'overview';

    const dateFilter = {
      createdAt: {
        gte: startDate ? new Date(startDate) : undefined,
        lte: endDate ? new Date(endDate) : undefined,
      },
    };

    switch (type) {
      case 'overview':
        return await getOverviewData(dateFilter);
      case 'products':
        return await getProductsData(dateFilter);
      case 'transactions':
        return await getTransactionsData(dateFilter);
      default:
        return NextResponse.json({ error: 'Invalid report type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function getOverviewData(dateFilter: any) {
  // Total Penjualan
  const totalSales = await prisma.order.aggregate({
    where: {
      status: 'SELESAI',
      ...dateFilter,
    },
    _sum: {
      totalAmount: true,
    },
    _count: true,
  });

  // Total Transaksi
  const totalTransactions = await prisma.order.count({
    where: {
      status: 'SELESAI',
      ...dateFilter,
    },
  });

  // Rata-rata Transaksi
  const avgTransaction =
    totalSales._sum.totalAmount && totalTransactions > 0
      ? Math.round(totalSales._sum.totalAmount / totalTransactions)
      : 0;

  // Produk Terjual
  const orders = await prisma.order.findMany({
    where: {
      status: 'SELESAI',
      ...dateFilter,
    },
    select: {
      items: true,
    },
  });

  let totalProductsSold = 0;
  orders.forEach((order) => {
    const items = order.items as any[];
    if (Array.isArray(items)) {
      totalProductsSold += items.reduce((sum, item) => sum + (item.quantity || 0), 0);
    }
  });

  const dailySalesRaw = await prisma.order.findMany({
    where: {
      status: 'SELESAI',
      ...dateFilter,
    },
    select: {
      createdAt: true,
      totalAmount: true,
    },
  });

  const dailySalesMap = new Map<string, number>();

  dailySalesRaw.forEach((order) => {
    const date = order.createdAt.toISOString().split('T')[0]; // yyyy-mm-dd
    const current = dailySalesMap.get(date) || 0;
    dailySalesMap.set(date, current + (order.totalAmount || 0));
  });

  const dailySales = Array.from(dailySalesMap.entries())
    .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
    .map(([date, value]) => ({ date, value }));

  return NextResponse.json({
    totalSales: totalSales._sum.totalAmount || 0,
    totalTransactions,
    avgTransaction,
    totalProductsSold,
    dailySales,
  });
}

async function getProductsData(dateFilter: any) {
  const orders = await prisma.order.findMany({
    where: {
      status: 'SELESAI',
      ...dateFilter,
    },
    select: {
      items: true,
      totalAmount: true,
    },
  });

  const menus = await prisma.menu.findMany({
    include: {
      category: true,
    },
  });

  const menuCategoryMap = new Map();
  menus.forEach((menu) => {
    menuCategoryMap.set(menu.name, menu.category.name);
  });

  const productStats = new Map();

  orders.forEach((order) => {
    const items = order.items as any[];
    if (Array.isArray(items)) {
      items.forEach((item) => {
        const key = item.name;
        const category = menuCategoryMap.get(item.name) || 'Lainnya';

        if (!productStats.has(key)) {
          productStats.set(key, {
            name: key,
            category: category,
            sold: 0,
            revenue: 0,
          });
        }
        const stat = productStats.get(key);
        stat.sold += item.quantity || 0;
        stat.revenue += (item.price * item.quantity) || 0;
      });
    }
  });

  const products = Array.from(productStats.values())
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 10);

  const categoryStats = new Map();
  products.forEach((product) => {
    if (!categoryStats.has(product.category)) {
      categoryStats.set(product.category, 0);
    }
    categoryStats.set(product.category, categoryStats.get(product.category) + product.sold);
  });

  const totalSold = Array.from(categoryStats.values()).reduce((sum, val) => sum + val, 0);
  const categoryPerformance = Array.from(categoryStats.entries()).map(([name, value]) => ({
    name,
    value,
    percentage: totalSold > 0 ? Math.round((value / totalSold) * 100) : 0,
  }));

  return NextResponse.json({
    products,
    categoryPerformance,
  });
}

async function getTransactionsData(dateFilter: any) {
  const transactions = await prisma.order.findMany({
    where: dateFilter,
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 50,
  });

  const formattedTransactions = transactions.map((transaction) => {
    const items = transaction.items as any[];
    const itemCount = Array.isArray(items)
      ? items.reduce((sum, item) => sum + (item.quantity || 0), 0)
      : 0;

    return {
      id: transaction.id,
      invoice: `INV-${transaction.id.slice(-3).padStart(3, '0')}`,
      date: transaction.createdAt,
      customer: transaction.user.name,
      items: itemCount,
      paymentMethod: transaction.paymentMethod,
      total: transaction.totalAmount,
      status: transaction.status,
    };
  });

  return NextResponse.json({
    transactions: formattedTransactions,
  });
}
