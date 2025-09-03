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
import AdminSidebar from "@/components/AdminNavbar";
import Link from "next/link";
import { OrdersTable } from "@/components/OrdersTable";

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
        return parsed.reduce((sum: number, item: any) => sum + ((item?.quantity) || 0), 0);
      } else if (parsed && typeof parsed === 'object') {
        return Object.values(parsed).reduce((sum: number, item: any) => sum + ((item?.quantity) || 0), 0);
      }
    } else if (Array.isArray(items)) {
      return items.reduce((sum: number, item: any) => sum + ((item?.quantity) || 0), 0);
    } else if (items && typeof items === 'object') {
      return Object.values(items).reduce((sum: number, item: any) => sum + ((item?.quantity) || 0), 0);
    }
  } catch (error) {
    console.warn('Failed to parse items:', error);
  }
  return 0;
}

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
                    All Orders
                  </h1>
                  <p className="text-sm text-slate-600 mt-2">
                    Manage and monitor all customer orders
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
                  <p className="text-sm font-semibold text-slate-800">
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
          <div className="p-8 space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              <Card className="border-l-4 border-l-yellow-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">Pending</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">
                    {statsMap.PENDING || 0}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">Processing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {statsMap.DIPROSES || 0}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-purple-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">Shipped</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">
                    {statsMap.DIKIRIM || 0}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">Completed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {statsMap.SELESAI || 0}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-red-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">Cancelled</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {statsMap.DIBATALKAN || 0}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Orders Table */}
            <Card className="shadow-sm">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <Package className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-slate-800">
                        All Orders
                      </CardTitle>
                      <p className="text-sm text-slate-600">
                        Complete list of all customer orders
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
                <OrdersTable
                  orders={orders.map(order => ({
                    ...order,
                    createdAt: order.createdAt.toISOString(),
                  }))}
                />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  } catch (error) {
    console.error('Error loading orders page:', error);
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="p-8">
          <CardContent className="text-center">
            <h2 className="text-xl font-semibold text-slate-800 mb-2">
              Error Loading Orders
            </h2>
            <p className="text-slate-600 mb-4">
              There was an error loading the orders page.
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
