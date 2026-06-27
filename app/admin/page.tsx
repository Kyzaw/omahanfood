import AdminSidebar from '@/components/admin/AdminNavbar'
import { StatsCard } from "@/components/admin/StatsCard"
import { OrdersTable } from "@/components/admin/OrdersTable"
import { TopMenus } from "@/components/admin/TopMenus"
import { prisma } from "@/lib/prisma"
import Link from 'next/link'
import { DollarSign, Users, ShoppingCart, UtensilsCrossed, FolderOpen, ClipboardList, Star, Zap, BarChart3, User } from 'lucide-react'

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const [userCount, orderCount, menuCount, categoryCount, totalRevenue, recentOrders, topMenusData] = await Promise.all([
    prisma.user.count(),
    prisma.order.count(),
    prisma.menu.count(),
    prisma.category.count(),
    // Calculate total revenue from all orders
    calculateTotalRevenue(),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 7,
      include: { user: true },
    }),
    // Updated query to get menus with order counts and all required data
    getTopMenusWithOrderCounts(),
  ])

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />

      {/* Main content with responsive spacing */}
      <main className="md:ml-64 min-h-screen transition-all duration-300 ease-in-out">
        {/* Header Section */}
        <div className="bg-white border-b border-slate-200 px-4 md:px-6 py-4 md:py-6 mt-16 md:mt-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
                Dashboard Overview
              </h1>
              <p className="text-sm text-slate-500 mt-1 md:mt-2">
                Monitor your catering performance and manage operations
              </p>
            </div>
            <div className="flex items-center justify-end">
              <div className="text-right bg-slate-50 px-3 md:px-4 py-2 rounded-lg border border-slate-200">
                <p className="text-xs md:text-sm font-semibold text-slate-800">
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
                <p className="text-xs text-slate-500">
                  {new Date().toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 md:p-8 space-y-6 md:space-y-8 bg-slate-50 min-h-screen">
          {/* Stats Cards - Responsive grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6">
            <StatsCard
              title="Total Revenue"
              value={Math.round(totalRevenue / 1)}
              icon={<DollarSign className="w-5 h-5 md:w-7 md:h-7 text-emerald-600" />}
            />
            <StatsCard
              title="Total Users"
              value={userCount}
              icon={<Users className="w-5 h-5 md:w-7 md:h-7 text-blue-600" />}
            />
            <StatsCard
              title="Total Orders"
              value={orderCount}
              icon={<ShoppingCart className="w-5 h-5 md:w-7 md:h-7 text-orange-600" />}
            />
            <StatsCard
              title="Menu Items"
              value={menuCount}
              icon={<UtensilsCrossed className="w-5 h-5 md:w-7 md:h-7 text-purple-600" />}
            />
            <div className="col-span-2 sm:col-span-1">
              <StatsCard
                title="Categories"
                value={categoryCount}
                icon={<FolderOpen className="w-5 h-5 md:w-7 md:h-7 text-amber-600" />}
              />
            </div>
          </div>

          {/* Charts Section - Stack on mobile */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
            {/* Recent Orders */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
              <div className="px-4 md:px-6 py-4 md:py-5 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-8 md:w-10 h-8 md:h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <ClipboardList className="text-blue-600 w-4 md:w-5 h-4 md:h-5" />
                    </div>
                    <h2 className="text-lg md:text-xl font-bold text-slate-800">
                      Recent Orders
                    </h2>
                  </div>
                  <Link href="/admin/orders" className="text-xs md:text-sm text-blue-600 hover:text-blue-700 font-semibold px-2 md:px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors">
                    View All
                  </Link>
                </div>
              </div>
              <div className="p-3 md:p-6">
                <div className="overflow-x-auto">
                  <OrdersTable
                    orders={recentOrders.map(order => ({
                      ...order,
                      createdAt: order.createdAt.toISOString(),
                    }))}
                  />
                </div>
              </div>
            </div>

            {/* Top Performing Menus */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
              <div className="px-4 md:px-6 py-4 md:py-5 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-8 md:w-10 h-8 md:h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <Star className="text-emerald-600 w-4 md:w-5 h-4 md:h-5" />
                    </div>
                    <h2 className="text-lg md:text-xl font-bold text-slate-800">
                      Top Performing Menus
                    </h2>
                  </div>
                  <Link href="/admin/topmenus" className="text-xs md:text-sm text-green-600 hover:text-green-700 font-semibold px-2 md:px-3 py-1 rounded-lg hover:bg-green-50 transition-colors">
                    View All
                  </Link>
                </div>
              </div>
              <div className="p-0">
                <TopMenus menus={topMenusData} />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
            <div className="px-4 md:px-6 py-4 md:py-5 border-b border-slate-100">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 md:w-10 h-8 md:h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Zap className="text-purple-600 w-4 md:w-5 h-4 md:h-5" />
                </div>
                <h2 className="text-lg md:text-xl font-bold text-slate-800">
                  Quick Actions
                </h2>
              </div>
            </div>
            <div className="p-4 md:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                <Link href="/admin/menu/add" className="group flex items-center justify-center p-4 md:p-6 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-100 transition-all duration-300 hover:shadow-md">
                  <div className="text-center">
                    <div className="flex justify-center mb-2 md:mb-3 group-hover:scale-110 transition-transform">
                      <UtensilsCrossed className="w-6 md:w-8 h-6 md:h-8 text-blue-600" />
                    </div>
                    <span className="text-xs md:text-sm font-semibold text-blue-700">Add Menu Item</span>
                  </div>
                </Link>

                <Link href="/admin/reports" className="group flex items-center justify-center p-4 md:p-6 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-100 transition-all duration-300 hover:shadow-md">
                  <div className="text-center">
                    <div className="flex justify-center mb-2 md:mb-3 group-hover:scale-110 transition-transform">
                      <BarChart3 className="w-6 md:w-8 h-6 md:h-8 text-emerald-600" />
                    </div>
                    <span className="text-xs md:text-sm font-semibold text-emerald-700">View Reports</span>
                  </div>
                </Link>

                <Link href="/admin/users" className="group flex items-center justify-center p-4 md:p-6 bg-purple-50 hover:bg-purple-100 rounded-xl border border-purple-100 transition-all duration-300 hover:shadow-md sm:col-span-2 lg:col-span-1">
                  <div className="text-center">
                    <div className="flex justify-center mb-2 md:mb-3 group-hover:scale-110 transition-transform">
                      <User className="w-6 md:w-8 h-6 md:h-8 text-purple-600" />
                    </div>
                    <span className="text-xs md:text-sm font-semibold text-purple-700">Manage Users</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

// Helper function to calculate total revenue
async function calculateTotalRevenue() {
  try {
    const orders = await prisma.order.findMany({
      select: {
        totalAmount: true,
        status: true
      }
    })

    // Calculate total revenue from completed orders only
    const totalRevenue = orders
      .filter(order => order.status === 'SELESAI' || order.status === 'DIKIRIM')
      .reduce((sum, order) => sum + (order.totalAmount || 0), 0)

    return totalRevenue
  } catch (error) {
    console.error('Error calculating total revenue:', error)
    return 0
  }
}

interface OrderItem {
  menuId?: string;
  id?: string;
  name: string;
  quantity?: number;
  price: number;
}

async function getTopMenusWithOrderCounts() {
  try {
    // Ambil semua menu beserta data terkait
    const menus = await prisma.menu.findMany({
      include: {
        category: {
          select: { name: true }
        },
        reviews: {
          select: { rating: true }
        }
      }
    });

    // Ambil semua order dengan field 'items'
    const orders = await prisma.order.findMany({
      select: { items: true }
    });

    // Map untuk menyimpan jumlah order per menuId
    const menuOrderCounts = new Map<string, number>();

    orders.forEach(order => {
      try {
        // Parse items jika berupa string JSON
        const items: Record<string, OrderItem> | OrderItem[] = typeof order.items === 'string'
          ? JSON.parse(order.items)
          : order.items;

        if (Array.isArray(items)) {
          // Jika items berupa array
          items.forEach((item: OrderItem) => {
            const menuId = item.menuId || item.id;
            if (menuId) {
              menuOrderCounts.set(menuId, (menuOrderCounts.get(menuId) || 0) + (item.quantity || 1));
            }
          });
        } else if (items && typeof items === 'object') {
          // Jika items berupa objek dengan nilai OrderItem
          Object.entries(items).forEach(([_, value]) => {
            const orderItem = value as OrderItem;
            const menuId = orderItem.menuId || orderItem.id;
            if (menuId) {
              menuOrderCounts.set(menuId, (menuOrderCounts.get(menuId) || 0) + (orderItem.quantity || 1));
            }
          });
        }
      } catch (error) {
        console.warn('Failed to parse order items:', error);
      }
    });

    // Tambahkan orderCount ke masing-masing menu
    const menusWithOrderCounts = menus.map(menu => ({
      ...menu,
      orderCount: menuOrderCounts.get(menu.id) || 0
    }));

    // Urutkan berdasarkan orderCount terbesar dan ambil 10 teratas
    return menusWithOrderCounts
      .sort((a, b) => b.orderCount - a.orderCount)
      .slice(0, 10);

  } catch (error) {
    console.error('Error fetching top menus:', error);
    return [];
  }
}