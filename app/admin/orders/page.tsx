import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { JsonValue } from "@prisma/client/runtime/library";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { redirect } from "next/navigation";
import {
  Clock,
  MapPin,
  Package,
  User,
  Truck,
  Search,
  Filter,
  ArrowLeft
} from "lucide-react";
import AdminSidebar from "@/components/admin/AdminNavbar";
import Link from "next/link";
import { OrdersTable } from "@/components/admin/OrdersTable";

interface OrderItem {
  quantity: number;
  name?: string;
  price?: number;
  menuId?: string;
  id?: string;
}

interface User {
  name: string;
  email: string;
}

interface Order {
  id: string;
  status: string;
  items: JsonValue;
  totalAmount: number;
  address?: string;
  courierId: string | null;
  courier?: User | null;
  user: User;
  createdAt: Date;
  userId: string;
  deliveryTime: string;
  jenisPaket?: string;
}

function getStatusColor(status: string) {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'DIPROSES':
      return 'bg-blue-100 text-blue-800';
    case 'DIKIRIM':
      return 'bg-purple-100 text-purple-800';
    case 'SELESAI':
      return 'bg-green-100 text-green-800';
    case 'DIBATALKAN':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case 'PENDING':
      return 'Menunggu';
    case 'DIPROSES':
      return 'Diproses';
    case 'DIKIRIM':
      return 'Dikirim';
    case 'SELESAI':
      return 'Selesai';
    case 'DIBATALKAN':
      return 'Dibatalkan';
    default:
      return status;
  }
}

function getItemCount(items: JsonValue): number {
  try {
    if (typeof items === 'string') {
      const parsed = JSON.parse(items);
      if (Array.isArray(parsed)) {
        return parsed.reduce((sum: number, item: unknown) => sum + ((item as { quantity?: number })?.quantity || 0), 0);
      } else if (parsed && typeof parsed === 'object') {
        return Object.values(parsed).reduce((sum: number, item: unknown) => sum + ((item as { quantity?: number })?.quantity || 0), 0);
      }
    } else if (Array.isArray(items)) {
      return items.reduce((sum: number, item: unknown) => sum + ((item as { quantity?: number })?.quantity || 0), 0);
    } else if (items && typeof items === 'object') {
      return Object.values(items).reduce((sum: number, item: unknown) => sum + ((item as { quantity?: number })?.quantity || 0), 0);
    }
  } catch (_error) {
    // Failed to parse items, return 0
  }
  return 0;
}

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
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

    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        courier: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const stats = await prisma.order.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
    });

    const statsMap = stats.reduce((acc, stat) => {
      acc[stat.status] = stat._count.status;
      return acc;
    }, {} as Record<string, number>);

    return (
      <div className="min-h-screen bg-slate-50">
        <AdminSidebar />

        {/* Main content with responsive margin */}
        <main className="md:ml-64 min-h-screen transition-all duration-300 ease-in-out">
          {/* Header Section - Mobile Optimized */}
          <div className="bg-white border-b border-slate-200 px-4 md:px-6 py-4 md:py-6 shadow-sm pt-20 md:pt-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3 md:gap-4">
                <Link
                  href="/admin"
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 text-slate-600" />
                </Link>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    All Orders
                  </h1>
                  <p className="text-xs md:text-sm text-slate-600 mt-1 md:mt-2">
                    Manage and monitor all customer orders
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end md:justify-start">
                <div className="text-left md:text-right bg-slate-50 px-3 md:px-4 py-2 rounded-lg border border-slate-200 w-full md:w-auto">
                  <p className="text-xs md:text-sm font-semibold text-slate-800">
                    Total Orders: {orders.length}
                  </p>
                  <p className="text-xs text-slate-500">
                    Last updated: {new Date().toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-4 md:p-8 space-y-6 md:space-y-8">
            {/* Stats Cards - Mobile Optimized Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6">
              <Card className="border-l-4 border-l-yellow-500">
                <CardHeader className="pb-2 px-3 md:px-6 pt-3 md:pt-6">
                  <CardTitle className="text-xs md:text-sm font-medium text-slate-600">Pending</CardTitle>
                </CardHeader>
                <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
                  <div className="text-xl md:text-2xl font-bold text-yellow-600">
                    {statsMap.PENDING || 0}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-2 px-3 md:px-6 pt-3 md:pt-6">
                  <CardTitle className="text-xs md:text-sm font-medium text-slate-600">Processing</CardTitle>
                </CardHeader>
                <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
                  <div className="text-xl md:text-2xl font-bold text-blue-600">
                    {statsMap.DIPROSES || 0}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardHeader className="pb-2 px-3 md:px-6 pt-3 md:pt-6">
                  <CardTitle className="text-xs md:text-sm font-medium text-slate-600">Shipped</CardTitle>
                </CardHeader>
                <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
                  <div className="text-xl md:text-2xl font-bold text-purple-600">
                    {statsMap.DIKIRIM || 0}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="pb-2 px-3 md:px-6 pt-3 md:pt-6">
                  <CardTitle className="text-xs md:text-sm font-medium text-slate-600">Completed</CardTitle>
                </CardHeader>
                <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
                  <div className="text-xl md:text-2xl font-bold text-green-600">
                    {statsMap.SELESAI || 0}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-red-500 col-span-2 md:col-span-1">
                <CardHeader className="pb-2 px-3 md:px-6 pt-3 md:pt-6">
                  <CardTitle className="text-xs md:text-sm font-medium text-slate-600">Cancelled</CardTitle>
                </CardHeader>
                <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
                  <div className="text-xl md:text-2xl font-bold text-red-600">
                    {statsMap.DIBATALKAN || 0}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Orders Table - Mobile Optimized */}
            <Card className="shadow-sm">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 px-4 md:px-6 py-4 md:py-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <Package className="h-4 w-4 md:h-5 md:w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg md:text-xl font-bold text-slate-800">
                        All Orders
                      </CardTitle>
                      <p className="text-xs md:text-sm text-slate-600">
                        Complete list of all customer orders
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2 text-xs md:text-sm">
                      <Filter className="h-3 w-3 md:h-4 md:w-4" />
                      <span className="hidden sm:inline">Filter</span>
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 text-xs md:text-sm">
                      <Search className="h-3 w-3 md:h-4 md:w-4" />
                      <span className="hidden sm:inline">Search</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <OrdersTable
                    orders={orders.map(order => ({
                      ...order,
                      createdAt: order.createdAt.toISOString(),
                    }))}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  } catch (error) {
    console.error('Error loading orders page:', error);
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="p-6 md:p-8 w-full max-w-md">
          <CardContent className="text-center">
            <h2 className="text-lg md:text-xl font-semibold text-slate-800 mb-2">
              Error Loading Orders
            </h2>
            <p className="text-sm md:text-base text-slate-600 mb-4">
              There was an error loading the orders page.
            </p>
            <Link href="/admin">
              <Button className="w-full md:w-auto">Back to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }
}