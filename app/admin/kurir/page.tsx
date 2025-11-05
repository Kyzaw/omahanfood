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
  UserPlus,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { revalidatePath } from "next/cache";
import AdminSidebar from "@/components/admin/AdminNavbar";

interface OrderItem {
  quantity: number;
  // Add other item properties as needed
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
}

interface Courier {
  id: string;
  name: string;
  email: string;
}

// Server action untuk assign kurir ke pesanan
async function assignCourierToOrder(formData: FormData) {
  "use server";

  try {
    const orderId = formData.get("orderId") as string;
    const courierId = formData.get("courierId") as string;

    const session = await auth();
    const userId = session?.user?.id;
    const userRole = session?.user?.role;

    if (!userId || userRole !== 'ADMIN') {
      throw new Error("Unauthorized - Admin access required");
    }

    if (!orderId) {
      throw new Error("Order ID is required");
    }

    if (!courierId || courierId === 'none') {
      throw new Error("Please select a courier");
    }

    // Verify courier exists and has correct role
    const courier = await prisma.user.findFirst({
      where: {
        id: courierId,
        role: 'KURIR',
      },
    });

    if (!courier) {
      throw new Error("Selected courier not found or invalid");
    }

    // Verify order exists and can be assigned
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    // Update order to assign the courier
    await prisma.order.update({
      where: { id: orderId },
      data: { 
        courierId,
        status: 'SIAP_KIRIM',
       },
    });

    revalidatePath("/admin/kurir");
  } catch (error) {
    console.error("Error assigning courier:", error);
    throw error;
  }
}

// Server action untuk unassign kurir
async function unassignCourierFromOrder(orderId: string) {
  "use server";
  
  try {
    const session = await auth();
    const userId = session?.user?.id;
    const userRole = session?.user?.role;

    if (!userId || userRole !== 'ADMIN') {
      throw new Error("Unauthorized - Admin access required");
    }

    if (!orderId) {
      throw new Error("Order ID is required");
    }

    // Verify order exists
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    // Remove courier assignment
    await prisma.order.update({
      where: { id: orderId },
      data: { courierId: null },
    });

    revalidatePath("/admin/kurir");
  } catch (error) {
    console.error("Error unassigning courier:", error);
    throw error;
  }
}

// Helper function to get status color
function getStatusColor(status: string) {
  switch (status) {
    case "MENUNGGU_PEMBAYARAN":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "DIBAYAR":
      return "bg-blue-100 text-blue-800 border-blue-300";
    case "SIAP_KIRIM":
      return "bg-purple-100 text-purple-800 border-purple-300";
    case "DIKIRIM":
      return "bg-indigo-100 text-indigo-800 border-indigo-300";
    case "SELESAI":
      return "bg-green-100 text-green-800 border-green-300";
    case "DIBATALKAN":
      return "bg-red-100 text-red-800 border-red-300";
    default:
      return "bg-slate-100 text-slate-800 border-slate-300";
  }
}

// Helper function to get status label
function getStatusLabel(status: string) {
  switch (status) {
    case "MENUNGGU_PEMBAYARAN":
      return "Menunggu Pembayaran";
    case "DIBAYAR":
      return "Sudah Dibayar";
    case "SIAP_KIRIM":
      return "Siap Dikirim";
    case "DIKIRIM":
      return "Sedang Dikirim";
    case "SELESAI":
      return "Selesai";
    case "DIBATALKAN":
      return "Dibatalkan";
    default:
      return status;
  }
}

// Helper function to safely count quantities
function getItemCount(items: JsonValue): number {
  if (!items || !Array.isArray(items)) {
    return 0;
  }
  
  return items.reduce<number>((sum, item) => {
    if (item && typeof item === 'object' && 'quantity' in item && typeof item.quantity === 'number') {
      return sum + item.quantity;
    }
    return sum;
  }, 0);
}

// Component for courier assignment
function CourierAssignmentForm({ order, couriers }: { order: Order, couriers: Courier[] }) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
      {!order.courierId ? (
        <form action={assignCourierToOrder} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full">
          <input type="hidden" name="orderId" value={order.id} />
          <Select name="courierId" required>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Pilih Kurir" />
            </SelectTrigger>
            <SelectContent>
              {couriers.map((courier) => (
                <SelectItem key={courier.id} value={courier.id}>
                  {courier.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="submit" size="sm" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700">
            <UserPlus className="h-4 w-4 mr-1" />
            Assign
          </Button>
        </form>
      ) : (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full">
          <div className="flex items-center text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg border border-green-200 flex-1 sm:flex-initial">
            <CheckCircle className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">{order.courier?.name || 'Kurir Ditugaskan'}</span>
          </div>
          <form action={unassignCourierFromOrder.bind(null, order.id)}>
            <Button type="submit" size="sm" variant="outline" className="w-full sm:w-auto text-red-600 hover:bg-red-50 border-red-200">
              Unassign
            </Button>
          </form>
        </div>
      )}
    </div>
  );
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

    const couriers = await prisma.user.findMany({
      where: {
        role: 'KURIR',
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: {
        name: "asc",
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

    const unassignedOrders = orders.filter(order => !order.courierId);
    const assignedOrders = orders.filter(order => order.courierId);

    return (
      <div className="min-h-screen bg-slate-50">
        <AdminSidebar />
        
        {/* Main content with responsive spacing */}
        <main className="md:ml-64 min-h-screen transition-all duration-300 ease-in-out">
          {/* Header Section */}
          <div className="bg-white border-b border-slate-200 px-4 md:px-6 py-4 md:py-6 shadow-sm mt-16 md:mt-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Orders & Courier Management
                </h1>
                <p className="text-sm text-slate-600 mt-1 md:mt-2">
                  Assign couriers to paid orders and manage deliveries
                </p>
              </div>
              <div className="flex items-center justify-end">
                <div className="text-right bg-slate-50 px-3 md:px-4 py-2 rounded-lg border border-slate-200">
                  <p className="text-xs md:text-sm font-semibold text-slate-800">
                    {orders.length} Total Orders
                  </p>
                  <p className="text-xs text-slate-500">
                    {couriers.length} Couriers Available
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-4  md:p-8 space-y-6 md:space-y-8">
            {/* Statistics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
              <Card className="hover:shadow-md transition-shadow bg-white border border-slate-200">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <div className="p-2 bg-red-100 rounded-lg flex-shrink-0">
                      <AlertCircle className="h-4 w-4 md:h-6 md:w-6 text-red-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs md:text-sm font-medium text-slate-600 truncate">Belum Assign</p>
                      <p className="text-lg md:text-2xl font-bold text-slate-900">{unassignedOrders.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow bg-white border border-slate-200">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                      <CheckCircle className="h-4 w-4 md:h-6 md:w-6 text-green-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs md:text-sm font-medium text-slate-600 truncate">Sudah Assign</p>
                      <p className="text-lg md:text-2xl font-bold text-slate-900">{assignedOrders.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow bg-white border border-slate-200">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                      <Package className="h-4 w-4 md:h-6 md:w-6 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs md:text-sm font-medium text-slate-600 truncate">Siap Kirim</p>
                      <p className="text-lg md:text-2xl font-bold text-slate-900">{statsMap.SIAP_KIRIM || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow bg-white border border-slate-200">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <div className="p-2 bg-indigo-100 rounded-lg flex-shrink-0">
                      <Truck className="h-4 w-4 md:h-6 md:w-6 text-indigo-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs md:text-sm font-medium text-slate-600 truncate">Selesai</p>
                      <p className="text-lg md:text-2xl font-bold text-slate-900">{statsMap.SELESAI || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow bg-white border border-slate-200 col-span-2 sm:col-span-1">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
                      <User className="h-4 w-4 md:h-6 md:w-6 text-purple-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs md:text-sm font-medium text-slate-600 truncate">Total Kurir</p>
                      <p className="text-lg md:text-2xl font-bold text-slate-900">{couriers.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Show message if no couriers available */}
            {couriers.length === 0 && (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 md:h-6 md:w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-yellow-800 font-medium text-sm md:text-base">
                        Tidak ada kurir yang tersedia
                      </p>
                      <p className="text-yellow-700 text-sm mt-1">
                        Silakan tambahkan kurir terlebih dahulu sebelum melakukan assignment.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Unassigned Orders Section */}
            {unassignedOrders.length > 0 && (
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertCircle className="h-5 w-5 md:h-6 md:w-6 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-red-700">
                      Pesanan Belum Ditugaskan
                    </h2>
                    <p className="text-sm text-red-600">{unassignedOrders.length} pesanan menunggu assignment</p>
                  </div>
                </div>
                
                <div className="space-y-3 md:space-y-4">
                  {unassignedOrders.map((order) => {
                    const itemCount = getItemCount(order.items);

                    return (
                      <Card key={order.id} className="border-l-4 border-l-red-500 shadow-sm hover:shadow-md transition-shadow bg-white">
                        <CardHeader className="pb-3 md:pb-4">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <CardTitle className="text-base md:text-lg font-semibold">
                              Order #{order.id.slice(-8).toUpperCase()}
                            </CardTitle>
                            <Badge 
                              className={`${getStatusColor(order.status)} border text-xs w-fit`}
                              variant="secondary"
                            >
                              {getStatusLabel(order.status)}
                            </Badge>
                          </div>
                          <div className="flex items-center text-xs md:text-sm text-slate-500">
                            <Clock className="h-3 w-3 md:h-4 md:w-4 mr-2 flex-shrink-0" />
                            {new Date(order.createdAt).toLocaleString("id-ID", {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4 md:space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                            {/* Customer Info */}
                            <div className="space-y-2">
                              <h4 className="font-semibold text-slate-900 text-sm">Pelanggan</h4>
                              <div className="p-3 bg-slate-50 rounded-lg">
                                <p className="font-medium text-slate-900 text-sm truncate">{order.user.name}</p>
                                <p className="text-xs text-slate-600 truncate">{order.user.email}</p>
                              </div>
                            </div>

                            {/* Order Info */}
                            <div className="space-y-2">
                              <h4 className="font-semibold text-slate-900 text-sm">Detail Pesanan</h4>
                              <div className="p-3 bg-slate-50 rounded-lg">
                                <p className="text-sm text-slate-600">{itemCount} item</p>
                                <p className="text-base md:text-lg font-bold text-green-600">
                                  Rp {order.totalAmount.toLocaleString('id-ID')}
                                </p>
                              </div>
                            </div>

                            {/* Assignment */}
                            <div className="space-y-2 md:col-span-1">
                              <h4 className="font-semibold text-slate-900 text-sm">Assign Kurir</h4>
                              <div className="p-3 bg-slate-50 rounded-lg">
                                {couriers.length > 0 ? (
                                  <CourierAssignmentForm order={order} couriers={couriers} />
                                ) : (
                                  <p className="text-sm text-slate-500">Tidak ada kurir tersedia</p>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Address */}
                          {order.address && (
                            <div className="flex items-start space-x-3 pt-3 md:pt-4 border-t border-slate-200">
                              <MapPin className="h-4 w-4 md:h-5 md:w-5 mt-0.5 text-slate-400 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-slate-900 text-sm">Alamat Pengiriman</p>
                                <p className="text-sm text-slate-600 mt-1 break-words">{order.address}</p>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Assigned Orders Section */}
            <div className="space-y-4 md:space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-green-700">
                    Pesanan Sudah Ditugaskan
                  </h2>
                  <p className="text-sm text-green-600">{assignedOrders.length} pesanan telah di-assign</p>
                </div>
              </div>

              {assignedOrders.length === 0 ? (
                <Card className="bg-white">
                  <CardContent className="p-8 md:p-12 text-center">
                    <div className="p-4 bg-slate-100 rounded-full w-fit mx-auto mb-4">
                      <Package className="h-12 w-12 md:h-16 md:w-16 text-slate-400" />
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold text-slate-900 mb-2">Belum Ada Pesanan Ditugaskan</h3>
                    <p className="text-slate-500 text-sm md:text-base">Assign kurir ke pesanan yang sudah dibayar untuk memulai pengiriman.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3 md:space-y-4">
                  {assignedOrders.map((order) => {
                    const itemCount = getItemCount(order.items);

                    return (
                      <Card key={order.id} className="border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow bg-white">
                        <CardHeader className="pb-3 md:pb-4">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <CardTitle className="text-base md:text-lg font-semibold">
                              Order #{order.id.slice(-8).toUpperCase()}
                            </CardTitle>
                            <Badge 
                              className={`${getStatusColor(order.status)} border text-xs w-fit`}
                              variant="secondary"
                            >
                              {getStatusLabel(order.status)}
                            </Badge>
                          </div>
                          <div className="flex items-center text-xs md:text-sm text-slate-500">
                            <Clock className="h-3 w-3 md:h-4 md:w-4 mr-2 flex-shrink-0" />
                            {new Date(order.createdAt).toLocaleString("id-ID", {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-3 md:space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                            {/* Customer */}
                            <div className="space-y-2">
                              <h4 className="font-semibold text-slate-900 text-sm">Pelanggan</h4>
                              <div className="p-3 bg-slate-50 rounded-lg">
                                <p className="font-medium text-slate-900 text-sm truncate">{order.user.name}</p>
                              </div>
                            </div>

                            {/* Courier */}
                            <div className="space-y-2">
                              <h4 className="font-semibold text-slate-900 text-sm">Kurir</h4>
                              <div className="p-3 bg-green-50 rounded-lg">
                                <p className="font-medium text-green-700 text-sm truncate">{order.courier?.name || 'N/A'}</p>
                              </div>
                            </div>

                            {/* Order Details */}
                            <div className="space-y-2">
                              <h4 className="font-semibold text-slate-900 text-sm">Pesanan</h4>
                              <div className="p-3 bg-slate-50 rounded-lg">
                                <p className="text-sm text-slate-600">{itemCount} item</p>
                                <p className="font-bold text-green-600 text-sm md:text-base">
                                  Rp {order.totalAmount.toLocaleString('id-ID')}
                                </p>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="space-y-2">
                              <h4 className="font-semibold text-slate-900 text-sm">Aksi</h4>
                              <div className="p-3 bg-slate-50 rounded-lg">
                                <CourierAssignmentForm order={order} couriers={couriers} />
                              </div>
                            </div>
                          </div>

                          {/* Address */}
                          {order.address && (
                            <div className="flex items-start space-x-3 pt-3 border-t border-slate-200">
                              <MapPin className="h-4 w-4 md:h-5 md:w-5 mt-0.5 text-slate-400 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-slate-900 text-sm">Alamat Pengiriman</p>
                                <p className="text-sm text-slate-600 mt-1 break-words">{order.address}</p>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  } catch (error) {
    console.error("Error loading admin orders page:", error);
    
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="border-red-200 bg-red-50 max-w-lg w-full">
          <CardContent className="p-6 md:p-8 text-center">
            <AlertCircle className="mx-auto h-12 w-12 md:h-16 md:w-16 text-red-500 mb-4" />
            <h2 className="text-lg md:text-xl font-semibold text-red-700 mb-2">Terjadi Kesalahan</h2>
            <p className="text-red-600 text-sm md:text-base">
              Gagal memuat data pesanan. Silakan refresh halaman atau hubungi administrator.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
}