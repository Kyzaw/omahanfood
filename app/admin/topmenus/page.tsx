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
  ShoppingCart,
  Award
} from "lucide-react";
import AdminSidebar from "@/components/admin/AdminNavbar";
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

    const topMenusData = await getTopMenusWithOrderCounts();
    const orderedMenus = topMenusData.filter(menu => menu.orderCount > 0);
    const totalOrders = orderedMenus.reduce((sum, menu) => sum + menu.orderCount, 0);
    const top3Menus = orderedMenus.slice(0, 3);

    return (
      <div className="min-h-screen bg-slate-50">
        <AdminSidebar />
        
        {/* Main content with responsive spacing */}
        <main className="md:ml-64 min-h-screen transition-all duration-300 ease-in-out">
          {/* Header Section */}
          <div className="bg-white border-b border-slate-200 px-4 md:px-6 py-4 md:py-6 shadow-sm mt-16 md:mt-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3 md:gap-4">
                <Link 
                  href="/admin" 
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"
                >
                  <ArrowLeft className="h-4 w-4 md:h-5 md:w-5 text-slate-600" />
                </Link>
                <div className="min-w-0 flex-1">
                  <h1 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    Top Performing Menus
                  </h1>
                  <p className="text-xs md:text-sm text-slate-600 mt-1 md:mt-2">
                    Analyze menu performance and popularity metrics
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end">
                <div className="text-right bg-slate-50 px-3 md:px-4 py-2 rounded-lg border border-slate-200">
                  <p className="text-xs md:text-sm font-semibold text-slate-800">
                    {orderedMenus.length} Menus
                  </p>
                  <p className="text-xs text-slate-500">
                    {totalOrders} Orders
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-4 md:p-8 space-y-6 md:space-y-8">
            {/* Top 3 Stats Cards */}
            {top3Menus.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-5 h-5 text-yellow-500" />
                  <h2 className="text-lg md:text-xl font-bold text-slate-800">Top Performers</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {top3Menus.map((menu, index) => (
                    <Card key={menu.id} className={`border-l-4 shadow-sm hover:shadow-md transition-shadow ${
                      index === 0 ? 'border-l-yellow-500 bg-gradient-to-br from-yellow-50 to-white' : 
                      index === 1 ? 'border-l-slate-400 bg-gradient-to-br from-slate-50 to-white' : 
                      'border-l-orange-600 bg-gradient-to-br from-orange-50 to-white'
                    }`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">
                              {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                            </span>
                            <CardTitle className="text-sm font-medium text-slate-600">
                              #{index + 1} Best Seller
                            </CardTitle>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {menu.orderCount} orders
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <h3 className="font-semibold text-slate-800 truncate text-base">
                          {menu.name}
                        </h3>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-600">
                            {menu.category?.name || 'No Category'}
                          </span>
                          <span className="text-sm font-bold text-green-600">
                            Rp {menu.price.toLocaleString('id-ID')}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Menu Performance - Desktop Table / Mobile Cards */}
            <Card className="shadow-sm border border-slate-200">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 px-4 md:px-6 py-4 md:py-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-8 md:w-10 h-8 md:h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="h-4 md:h-5 w-4 md:w-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-base md:text-xl font-bold text-slate-800">
                        All Ordered Menus
                      </CardTitle>
                      <p className="text-xs md:text-sm text-slate-600">
                        Complete list sorted by popularity
                      </p>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center gap-2">
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
                  <>
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Rank</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Menu</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Category</th>
                            <th className="px-4 py-3 text-right text-xs font-bold text-slate-600 uppercase">Price</th>
                            <th className="px-4 py-3 text-center text-xs font-bold text-slate-600 uppercase">Orders</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {orderedMenus.map((menu, index) => (
                            <tr key={menu.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-4 py-4">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">
                                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : ''}
                                  </span>
                                  <span className="text-sm font-semibold text-slate-700">
                                    {index + 1}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                <div className="flex items-start gap-3">
                                  {menu.image ? (
                                    <img 
                                      src={menu.image} 
                                      alt={menu.name}
                                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-slate-200"
                                    />
                                  ) : (
                                    <div className="w-12 h-12 rounded-lg bg-slate-200 flex items-center justify-center flex-shrink-0">
                                      <Package className="h-6 w-6 text-slate-400" />
                                    </div>
                                  )}
                                  <div className="min-w-0 flex-1">
                                    <h3 className="font-semibold text-slate-800 mb-1 line-clamp-1">{menu.name}</h3>
                                    <p className="text-sm text-slate-500 line-clamp-2">
                                      {menu.description || 'No description'}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                <Badge variant="outline" className="text-xs">
                                  {menu.category?.name || 'Uncategorized'}
                                </Badge>
                              </td>
                              <td className="px-4 py-4 text-right">
                                <span className="font-bold text-green-600 text-sm">
                                  Rp {menu.price.toLocaleString('id-ID')}
                                </span>
                              </td>
                              <td className="px-4 py-4">
                                <div className="flex items-center justify-center gap-2">
                                  <ShoppingCart className="h-4 w-4 text-blue-500" />
                                  <span className="font-bold text-blue-600 text-sm">
                                    {menu.orderCount}
                                  </span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden p-4 space-y-3">
                      {orderedMenus.map((menu, index) => (
                        <div
                          key={menu.id}
                          className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start gap-3 mb-3">
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="text-xl">
                                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                              </span>
                            </div>
                            {menu.image ? (
                              <img 
                                src={menu.image} 
                                alt={menu.name}
                                className="w-16 h-16 rounded-lg object-cover flex-shrink-0 border border-slate-200"
                              />
                            ) : (
                              <div className="w-16 h-16 rounded-lg bg-slate-200 flex items-center justify-center flex-shrink-0">
                                <Package className="h-8 w-8 text-slate-400" />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <h3 className="font-semibold text-slate-800 mb-1 text-sm line-clamp-2">
                                {menu.name}
                              </h3>
                              <Badge variant="outline" className="text-xs">
                                {menu.category?.name || 'Uncategorized'}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                            <div className="flex items-center gap-2">
                              <ShoppingCart className="h-4 w-4 text-blue-500" />
                              <span className="text-sm font-bold text-blue-600">
                                {menu.orderCount} orders
                              </span>
                            </div>
                            <div className="text-base font-bold text-green-600">
                              Rp {menu.price.toLocaleString('id-ID')}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="p-8 md:p-12 text-center">
                    <Package className="h-12 w-12 md:h-16 md:w-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg md:text-xl font-semibold text-slate-800 mb-2">No Ordered Menus</h3>
                    <p className="text-slate-600 text-sm md:text-base">No menus have been ordered yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Additional Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
              {/* Best Performing Category */}
              <Card className="shadow-sm border border-slate-200">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                    <Package className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    <span>Best Performing Category</span>
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
                      <div className="space-y-3">
                        <h3 className="font-bold text-lg md:text-xl text-slate-900">{bestCategory[0]}</h3>
                        <p className="text-sm md:text-base text-slate-600">
                          {bestCategory[1].orders} total orders from {bestCategory[1].count} menu items
                        </p>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all" 
                            style={{ 
                              width: `${Math.min((bestCategory[1].orders / totalOrders) * 100, 100)}%` 
                            }}
                          ></div>
                        </div>
                        <p className="text-sm text-slate-500">
                          {Math.round((bestCategory[1].orders / totalOrders) * 100)}% of total orders
                        </p>
                      </div>
                    ) : (
                      <p className="text-slate-500">No data available</p>
                    );
                  })()}
                </CardContent>
              </Card>

              {/* Performance Summary */}
              <Card className="shadow-sm border border-slate-200">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                    <Star className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                    <span>Performance Summary</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Avg Orders per Menu:</span>
                      <span className="font-bold text-slate-900">
                        {orderedMenus.length > 0 ? Math.round(totalOrders / orderedMenus.length) : 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Top Menu Orders:</span>
                      <span className="font-bold text-green-600">
                        {orderedMenus[0]?.orderCount || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-slate-600">Revenue Potential:</span>
                      <span className="font-bold text-green-600 text-right">
                        Rp {orderedMenus.reduce((sum, menu) => sum + (menu.price * menu.orderCount), 0).toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="flex justify-between items-start pt-3 border-t border-slate-200">
                      <span className="text-sm text-slate-600">Most Popular:</span>
                      <span className="font-bold text-slate-800 text-right truncate max-w-[60%]">
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="p-6 md:p-8 max-w-md w-full">
          <CardContent className="text-center">
            <h2 className="text-lg md:text-xl font-semibold text-slate-800 mb-2">
              Error Loading Top Menus
            </h2>
            <p className="text-slate-600 mb-6 text-sm md:text-base">
              There was an error loading the top menus page.
            </p>
            <Link href="/admin">
              <Button className="w-full sm:w-auto">Back to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }
}

async function getTopMenusWithOrderCounts(): Promise<MenuWithOrderCount[]> {
  try {
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

    const orders = await prisma.order.findMany({
      select: { items: true }
    });

    const menuOrderCounts = new Map<string, number>();

    orders.forEach(order => {
      try {
        const items: Record<string, OrderItem> | OrderItem[] = typeof order.items === 'string'
          ? JSON.parse(order.items)
          : order.items;

        if (Array.isArray(items)) {
          items.forEach((item: OrderItem) => {
            const menuId = item.menuId || item.id;
            if (menuId) {
              menuOrderCounts.set(menuId, (menuOrderCounts.get(menuId) || 0) + (item.quantity || 1));
            }
          });
        } else if (items && typeof items === 'object') {
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

    const menusWithOrderCounts = menus.map(menu => ({
      ...menu,
      orderCount: menuOrderCounts.get(menu.id) || 0
    }));

    return menusWithOrderCounts.sort((a, b) => b.orderCount - a.orderCount);

  } catch (error) {
    console.error('Error fetching top menus:', error);
    return [];
  }
}