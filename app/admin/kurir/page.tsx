import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
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
  CheckCircle,
  Sidebar
} from "lucide-react";
import { revalidatePath } from "next/cache";
import AdminSidebar from "@/components/AdminNavbar";

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
      return "bg-yellow-100 text-yellow-800";
    case "DIBAYAR":
      return "bg-blue-100 text-blue-800";
    case "SIAP_KIRIM":
      return "bg-purple-100 text-purple-800";
    case "DIKIRIM":
      return "bg-indigo-100 text-indigo-800";
    case "SELESAI":
      return "bg-green-100 text-green-800";
    case "DIBATALKAN":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
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

// Component for courier assignment
function CourierAssignmentForm({ order, couriers }: { order: any, couriers: any[] }) {
  return (
    <div className="flex items-center gap-2">
      {!order.courierId ? (
        <form action={assignCourierToOrder} className="flex items-center gap-2">
          <input type="hidden" name="orderId" value={order.id} />
          <Select name="courierId" required>
            <SelectTrigger className="w-48">
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
          <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700">
            <UserPlus className="h-4 w-4 mr-1" />
            Assign
          </Button>
        </form>
      ) : (
        <div className="flex items-center gap-2">
          <div className="flex items-center text-sm text-green-700 bg-green-50 px-2 py-1 rounded">
            <CheckCircle className="h-4 w-4 mr-1" />
            {order.courier?.name || 'Kurir Ditugaskan'}
          </div>
          <form action={unassignCourierFromOrder.bind(null, order.id)}>
            <Button type="submit" size="sm" variant="outline" className="text-red-600 hover:bg-red-50">
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
      <div className="flex">
        {/* Fixed Sidebar */}
        <AdminSidebar />
        
        {/* Main Content with proper margin */}
        <div className="ml-96 min-h-screen">
          <div className="p-6">
            {/* Header */}
            <div className="mb-8">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Kelola Pesanan & Kurir</h1>
                <p className="text-gray-600">Assign kurir ke pesanan yang sudah dibayar</p>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <AlertCircle className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Belum Assign</p>
                      <p className="text-2xl font-bold text-gray-900">{unassignedOrders.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Sudah Assign</p>
                      <p className="text-2xl font-bold text-gray-900">{assignedOrders.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Package className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Siap Kirim</p>
                      <p className="text-2xl font-bold text-gray-900">{statsMap.SIAP_KIRIM || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Truck className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Sudah Dikirim</p>
                      <p className="text-2xl font-bold text-gray-900">{statsMap.SELESAI || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <User className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Kurir</p>
                      <p className="text-2xl font-bold text-gray-900">{couriers.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Show message if no couriers available */}
            {couriers.length === 0 && (
              <Card className="mb-8 border-yellow-200 bg-yellow-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-6 w-6 text-yellow-600" />
                    <p className="text-yellow-800 font-medium">
                      Tidak ada kurir yang tersedia. Silakan tambahkan kurir terlebih dahulu sebelum melakukan assignment.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Unassigned Orders Section */}
            {unassignedOrders.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-red-700">
                      Pesanan Belum Ditugaskan
                    </h2>
                    <p className="text-sm text-red-600">{unassignedOrders.length} pesanan menunggu assignment</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {unassignedOrders.map((order) => {
                    const items = Array.isArray(order.items) ? order.items : [];
                    const itemCount = items.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);

                    return (
                      <Card key={order.id} className="border-l-4 border-l-red-500 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-4">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-semibold">
                              Order #{order.id.slice(-8).toUpperCase()}
                            </CardTitle>
                            <Badge 
                              className={`${getStatusColor(order.status)} border-0`}
                              variant="secondary"
                            >
                              {getStatusLabel(order.status)}
                            </Badge>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-6">
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Customer Info */}
                            <div className="space-y-2">
                              <h4 className="font-semibold text-gray-900">Pelanggan</h4>
                              <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="font-medium text-gray-900">{order.user.name}</p>
                                <p className="text-sm text-gray-600">{order.user.email}</p>
                              </div>
                            </div>

                            {/* Order Info */}
                            <div className="space-y-2">
                              <h4 className="font-semibold text-gray-900">Detail Pesanan</h4>
                              <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-600">{itemCount} item</p>
                                <p className="text-lg font-bold text-green-600">
                                  Rp {order.totalAmount.toLocaleString('id-ID')}
                                </p>
                              </div>
                            </div>

                            {/* Assignment */}
                            <div className="space-y-2">
                              <h4 className="font-semibold text-gray-900">Assign Kurir</h4>
                              <div className="p-3 bg-gray-50 rounded-lg">
                                {couriers.length > 0 ? (
                                  <CourierAssignmentForm order={order} couriers={couriers} />
                                ) : (
                                  <p className="text-sm text-gray-500">Tidak ada kurir tersedia</p>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Address */}
                          {order.address && (
                            <div className="flex items-start space-x-3 pt-4 border-t border-gray-200">
                              <MapPin className="h-5 w-5 mt-0.5 text-gray-400" />
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">Alamat Pengiriman</p>
                                <p className="text-sm text-gray-600 mt-1">{order.address}</p>
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
            <div className="pb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-green-700">
                    Pesanan Sudah Ditugaskan
                  </h2>
                  <p className="text-sm text-green-600">{assignedOrders.length} pesanan telah di-assign</p>
                </div>
              </div>

              {assignedOrders.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <div className="p-4 bg-gray-100 rounded-full w-fit mx-auto mb-4">
                      <Package className="h-16 w-16 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Belum Ada Pesanan Ditugaskan</h3>
                    <p className="text-gray-500">Assign kurir ke pesanan yang sudah dibayar untuk memulai pengiriman.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {assignedOrders.map((order) => {
                    const items = Array.isArray(order.items) ? order.items : [];
                    const itemCount = items.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);

                    return (
                      <Card key={order.id} className="border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-4">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-semibold">
                              Order #{order.id.slice(-8).toUpperCase()}
                            </CardTitle>
                            <Badge 
                              className={`${getStatusColor(order.status)} border-0`}
                              variant="secondary"
                            >
                              {getStatusLabel(order.status)}
                            </Badge>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-2" />
                            {new Date(order.createdAt).toLocaleString("id-ID", {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                            {/* Customer */}
                            <div className="space-y-2">
                              <h4 className="font-semibold text-gray-900">Pelanggan</h4>
                              <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="font-medium text-gray-900">{order.user.name}</p>
                              </div>
                            </div>

                            {/* Courier */}
                            <div className="space-y-2">
                              <h4 className="font-semibold text-gray-900">Kurir</h4>
                              <div className="p-3 bg-green-50 rounded-lg">
                                <p className="font-medium text-green-700">{order.courier?.name || 'N/A'}</p>
                              </div>
                            </div>

                            {/* Order Details */}
                            <div className="space-y-2">
                              <h4 className="font-semibold text-gray-900">Pesanan</h4>
                              <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-600">{itemCount} item</p>
                                <p className="font-bold text-green-600">
                                  Rp {order.totalAmount.toLocaleString('id-ID')}
                                </p>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="space-y-2">
                              <h4 className="font-semibold text-gray-900">Aksi</h4>
                              <div className="p-3 bg-gray-50 rounded-lg">
                                <CourierAssignmentForm order={order} couriers={couriers} />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading admin orders page:", error);
    
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="border-red-200 bg-red-50 max-w-lg">
          <CardContent className="p-8 text-center">
            <AlertCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-red-700 mb-2">Terjadi Kesalahan</h2>
            <p className="text-red-600">
              Gagal memuat data pesanan. Silakan refresh halaman atau hubungi administrator.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
}