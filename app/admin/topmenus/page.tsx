import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { JsonValue } from "@prisma/client/runtime/library";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { 
  Star,
  TrendingUp,
  Package,
  ArrowLeft,
  Search,
  Filter,
  Eye,
  ShoppingCart
} from "lucide-react";
import AdminSidebar from "@/components/AdminNavbar";
import Link from "next/link";

interface OrderItem {
  menuId?: string;
  id?: string;
  name: string;
  quantity?: number;
  price: number;
}

interface MenuWithOrderCount {
  id: string;
  name: string;
  price: number;
  description: string | null;
  image: string | null;
  categoryId: string;
  category: { name: string } | null;
  orderCount: number;
  createdAt: Date;
}

export default async function TopMenusPage() {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    const userRole = session?.user?.role;

    if (!userId) {
      return redirect("/login");
    }

    if (userRole !== 'ADMIN') {
      return redirect("/");
    }

    // Get all menus with order counts and related data
    const topMenusData = await getTopMenusWithOrderCounts();

    // Filter only menus that have been ordered
    const orderedMenus = topMenusData.filter(menu => menu.orderCount > 0);

    // Calculate total orders across all menus
    const totalOrders = orderedMenus.reduce((sum, menu) => sum + menu.orderCount, 0);

    // Get top 3 performing menus for stats
    const top3Menus = orderedMenus.slice(0, 3);

    return (
      <div className="min-h-screen bg-slate-50">
        <AdminSidebar />
        
        <main className="ml-64 min-h-screen transition-all duration-300 ease-in-out">
          {/* Header Section */}
          <div className="bg-white border-b border-slate-200 px-6 py-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link 
                  href="/admin" 
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 text-slate-600" />
                </Link>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    Top Performing Menus
                  </h1>
                  <p className="text-sm text-slate-600 mt-2">
                    Analyze menu performance and popularity metrics
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
                  <p className="text-sm font-semibold text-slate-800">
                    Ordered Menus: {orderedMenus.length}
                  </p>
                  <p className="text-xs text-slate-500">
                    Total Orders: {totalOrders}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-8 space-y-8">
            {/* Top 3 Stats Cards */}
            {top3Menus.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {top3Menus.map((menu, index) => (
                  <Card key={menu.id} className={`border-l-4 ${
                    index === 0 ? 'border-l-yellow-500' : 
                    index === 1 ? 'border-l-gray-400' : 
                    'border-l-orange-600'
                  }`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium text-slate-600">
                          #{index + 1} {index === 0 ? '' : index === 1 ? '' : ''}
                        </CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          {menu.orderCount} orders
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <h3 className="font-semibold text-slate-800 truncate">
                          {menu.name}
                        </h3>
                        <p className="text-sm text-slate-600">
                          {menu.category?.name || 'No Category'}
                        </p>
                        <p className="text-sm font-semibold text-green-600 whitespace-nowrap">
                          Rp {menu.price.toLocaleString('id-ID')}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Menu Performance Table */}
            <Card className="shadow-sm">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-slate-800">
                        All Ordered Menus
                      </CardTitle>
                      <p className="text-sm text-slate-600">
                        Complete list of menus that have been ordered by customers
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Filter className="h-4 w-4" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Search className="h-4 w-4" />
                      Search
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {orderedMenus.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Rank</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Menu</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Category</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Price</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Orders</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {orderedMenus.map((menu, index) => (
                          <tr key={menu.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">
                                  {index === 0 ? '' : index === 1 ? '' : index === 2 ? '' : ``}
                                </span>
                                <span className="text-sm font-medium text-slate-600">
                                  {index + 1}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-start gap-3">
                                {menu.image ? (
                                  <img 
                                    src={menu.image} 
                                    alt={menu.name}
                                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                                  />
                                ) : (
                                  <div className="w-12 h-12 rounded-lg bg-slate-200 flex items-center justify-center flex-shrink-0">
                                    <Package className="h-6 w-6 text-slate-400" />
                                  </div>
                                )}
                                <div className="min-w-0 flex-1">
                                  <h3 className="font-semibold text-slate-800 mb-1">{menu.name}</h3>
                                  <p className="text-sm text-slate-500 leading-relaxed">
                                    {menu.description || 'No description available'}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <Badge variant="outline" className="text-xs">
                                {menu.category?.name || 'Uncategorized'}
                              </Badge>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-right">
                                <span className="font-semibold text-green-600 whitespace-nowrap">
                                  Rp {menu.price.toLocaleString('id-ID')}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <ShoppingCart className="h-4 w-4 text-blue-500" />
                                <span className="font-semibold text-blue-600">
                                  {menu.orderCount}
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">No Ordered Menus</h3>
                    <p className="text-slate-600">No menus have been ordered yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Additional Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Best Performing Category */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-blue-600" />
                    Best Performing Category
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const categoryStats = orderedMenus.reduce((acc, menu) => {
                      const categoryName = menu.category?.name || 'Uncategorized';
                      if (!acc[categoryName]) {
                        acc[categoryName] = { count: 0, orders: 0 };
                      }
                      acc[categoryName].count += 1;
                      acc[categoryName].orders += menu.orderCount;
                      return acc;
                    }, {} as Record<string, { count: number; orders: number }>);

                    const bestCategory = Object.entries(categoryStats)
                      .sort(([,a], [,b]) => b.orders - a.orders)[0];

                    return bestCategory ? (
                      <div className="space-y-2">
                        <h3 className="font-semibold text-lg">{bestCategory[0]}</h3>
                        <p className="text-slate-600">
                          {bestCategory[1].orders} total orders from {bestCategory[1].count} menu items
                        </p>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ 
                              width: `${(bestCategory[1].orders / totalOrders) * 100}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-slate-500">No data available</p>
                    );
                  })()}
                </CardContent>
              </Card>

              {/* Performance Summary */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    Performance Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Average Orders per Menu:</span>
                      <span className="font-semibold">
                        {orderedMenus.length > 0 ? Math.round(totalOrders / orderedMenus.length) : 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Top Menu Orders:</span>
                      <span className="font-semibold text-green-600">
                        {orderedMenus[0]?.orderCount || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Total Revenue Potential:</span>
                      <span className="font-semibold text-green-600">
                        Rp {orderedMenus.reduce((sum, menu) => sum + (menu.price * menu.orderCount), 0).toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Most Popular Menu:</span>
                      <span className="font-semibold text-slate-800">
                        {orderedMenus[0]?.name || 'N/A'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    );
  } catch (error) {
    console.error('Error loading top menus page:', error);
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="p-8">
          <CardContent className="text-center">
            <h2 className="text-xl font-semibold text-slate-800 mb-2">
              Error Loading Top Menus
            </h2>
            <p className="text-slate-600 mb-4">
              There was an error loading the top menus page.
            </p>
            <Link href="/admin">
              <Button>Back to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }
}

async function getTopMenusWithOrderCounts(): Promise<MenuWithOrderCount[]> {
  try {
    // Ambil semua menu beserta data terkait
    const menus = await prisma.menu.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        description: true,
        image: true,
        categoryId: true,
        createdAt: true,
        category: {
          select: { name: true }
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

    // Urutkan berdasarkan orderCount terbesar
    return menusWithOrderCounts
      .sort((a, b) => b.orderCount - a.orderCount);

  } catch (error) {
    console.error('Error fetching top menus:', error);
    return [];
  }
}
