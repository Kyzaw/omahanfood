import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { redirect } from "next/navigation";
import {
  Clock,
  MapPin,
  CreditCard,
  Package,
  User,
  Phone,
  CheckCircle,
  Truck,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import { revalidatePath } from "next/cache";
import CourierNavbar from "@/components/kurir/CourierNavbar";

type OrderStatus = 'SIAP_KIRIM' | 'DIKIRIM' | 'SELESAI';
type DeliveryTime = 'PAGI' | 'SIANG' | 'SORE';

interface OrderItem {
  name: string;
  quantity: number;
}

interface AddressData {
  nama: string;
  noHp: string;
  alamat: string;
}

interface OrderUser {
  name: string;
  email: string;
}

interface Order {
  id: string;
  status: OrderStatus;
  courierId: string | null;
  userId: string;
  items: OrderItem[];
  address: string;
  deliveryTime: DeliveryTime;
  totalAmount: number;
  notes?: string;
  createdAt: Date;
  user: OrderUser;
}

async function updateOrderStatus(orderId: string, newStatus: OrderStatus) {
  "use server";

  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      courierId: userId,
    },
  });

  if (!order) {
    throw new Error("Order not found or not assigned to you");
  }

  if (newStatus === 'SELESAI') {
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        deliveredCount: { increment: 1 },
      }
    });

    if (updatedOrder.deliveredCount < updatedOrder.totalDeliveries) {
      // If there are more deliveries, set back to PENDING or SIAP_KIRIM for next day
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'DIBAYAR',
          nextDeliveryDate: (() => {
            const date = new Date();
            date.setDate(date.getDate() + 1);
            if (date.getDay() === 0) date.setDate(date.getDate() + 1); // Skip Sunday
            return date;
          })(),
        },

      });
    } else {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'SELESAI',
        },
      });
    }
  } else {
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: newStatus,
      },
    });
  }


  revalidatePath("/kurir");
}

// Helper function to get status color
function getStatusColor(status: string) {
  switch (status) {
    case "SIAP_KIRIM":
      return "bg-blue-100 text-blue-800";
    case "DIKIRIM":
      return "bg-indigo-100 text-indigo-800";
    case "SELESAI":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

// Helper function to get status label
function getStatusLabel(status: string) {
  switch (status) {
    case "SIAP_KIRIM":
      return "Siap Dikirim";
    case "DIKIRIM":
      return "Sedang Dikirim";
    case "SELESAI":
      return "Selesai";
    default:
      return status;
  }
}

// Helper function to get delivery time label
function getDeliveryTimeLabel(deliveryTime: string) {
  switch (deliveryTime) {
    case "PAGI":
      return "Pagi (08:00 - 12:00)";
    case "SIANG":
      return "Siang (12:00 - 16:00)";
    case "SORE":
      return "Sore (16:00 - 20:00)";
    default:
      return deliveryTime;
  }
}

// Helper function to parse address string
function parseAddressString(addressString: string): AddressData | null {
  try {
    // First try to parse as JSON
    const addressData = JSON.parse(addressString);
    if (typeof addressData === 'object' && addressData !== null) {
      return addressData as AddressData;
    }
  } catch {
    // If not JSON, try to parse as delimited string
    const phoneRegex = /(\+62|62|0)[\s-]?8[1-9][0-9]{6,10}/g;
    const phoneMatch = addressString.match(phoneRegex);

    if (phoneMatch && phoneMatch.length > 0) {
      const phone = phoneMatch[0];
      const parts = addressString.split(phone);

      if (parts.length === 2) {
        const beforePhone = parts[0].trim().replace(/[,|-]$/, '').trim();
        const afterPhone = parts[1].trim().replace(/^[,|-]/, '').trim();

        return {
          nama: beforePhone || '',
          noHp: phone,
          alamat: afterPhone || ''
        };
      }
    }

    // Pattern: "Nama | 08123456789 | Jl. Address"
    const pattern1 = addressString.split(' | ');
    if (pattern1.length === 3) {
      return {
        nama: pattern1[0].trim(),
        noHp: pattern1[1].trim(),
        alamat: pattern1[2].trim()
      };
    }

    // Pattern: "Nama, 08123456789, Jl. Address"
    const pattern2 = addressString.split(', ');
    if (pattern2.length >= 3) {
      return {
        nama: pattern2[0].trim(),
        noHp: pattern2[1].trim(),
        alamat: pattern2.slice(2).join(', ').trim()
      };
    }
  }

  return null;
}

// Component for status update buttons
function StatusUpdateButtons({ order }: { order: Order }) {
  const currentStatus = order.status;

  return (
    <div className="flex flex-wrap gap-2">
      {currentStatus === "SIAP_KIRIM" && (
        <form action={updateOrderStatus.bind(null, order.id, "DIKIRIM")}>
          <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Truck className="h-4 w-4 mr-1" />
            Mulai Kirim
          </Button>
        </form>
      )}

      {currentStatus === "DIKIRIM" && (
        <form action={updateOrderStatus.bind(null, order.id, "SELESAI")}>
          <Button type="submit" size="sm" className="bg-green-600 hover:bg-green-700">
            <CheckCircle className="h-4 w-4 mr-1" />
            Selesai Kirim
          </Button>
        </form>
      )}
    </div>
  );
}

export default async function CourierDashboard() {
  const session = await auth();
  const userId = session?.user?.id;
  const userRole = session?.user?.role;

  if (!userId) {
    return redirect("/login");
  }

  if (userRole !== 'KURIR') {
    return redirect("/")
  }

  const ordersWithoutFilter = await prisma.order.findMany({
    where: {
      courierId: userId,
    },
    include: {
      user: {
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

  // Transform the items from JSON to proper type with safer type checking
  const transformedOrders = ordersWithoutFilter.map((order) => {
    let parsedItems: OrderItem[] = [];

    if (Array.isArray(order.items)) {
      parsedItems = order.items.map((item) => {
        if (item && typeof item === 'object' && 'name' in item && 'quantity' in item) {
          return {
            name: String(item.name || ''),
            quantity: Number(item.quantity || 1)
          };
        }
        return { name: '', quantity: 1 };
      });
    }

    return {
      ...order,
      items: parsedItems
    } as Order;
  });

  // Get statistics
  const stats = await prisma.order.groupBy({
    by: ['status'],
    where: {
      courierId: userId,
    },
    _count: {
      status: true,
    },
  });

  const statsMap = stats.reduce((acc, stat) => {
    acc[stat.status] = stat._count.status;
    return acc;
  }, {} as Record<string, number>);

  const displayOrders = transformedOrders;
  const ongoingOrders = displayOrders.filter((order) =>
    order.status === 'SIAP_KIRIM' || order.status === 'DIKIRIM'
  );
  const completedOrders = displayOrders.filter((order) =>
    order.status === 'SELESAI'
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <CourierNavbar />
      <div className="container mx-auto p-4 max-w-6xl py-8">


        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Kurir</h1>
          <p className="text-gray-600">Kelola pengiriman pesanan Anda</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Package className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Siap Kirim</p>
                  <p className="text-2xl font-bold">{statsMap.SIAP_KIRIM || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Truck className="h-8 w-8 text-indigo-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Sedang Kirim</p>
                  <p className="text-2xl font-bold">{statsMap.DIKIRIM || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Selesai</p>
                  <p className="text-2xl font-bold">{statsMap.SELESAI || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <RefreshCw className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Aktif</p>
                  <p className="text-2xl font-bold">{displayOrders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders List */}
        {displayOrders.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak Ada Pesanan</h3>
              <p className="text-gray-500">Belum ada pesanan yang ditugaskan kepada Anda.</p>
              <div className="mt-4 text-sm text-gray-400">
                <p>Pastikan pesanan di database memiliki courierId yang sesuai dengan ID Anda: {userId}</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              Semua Pesanan Anda ({displayOrders.length})
            </h2>
            {ongoingOrders.map((order: Order) => {
              const items = Array.isArray(order.items) ? order.items : [];
              const itemCount = items.reduce((sum: number, item: OrderItem) => sum + (item.quantity || 0), 0);
              const addressData = parseAddressString(order.address);

              return (
                <Card key={order.id} className="shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold">
                        Order #{order.id.slice(-8).toUpperCase()}
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge
                          className={`${getStatusColor(order.status)} border-0`}
                          variant="secondary"
                        >
                          {getStatusLabel(order.status)}
                        </Badge>
                        {order.status === "SIAP_KIRIM" && (
                          <AlertCircle className="h-5 w-5 text-orange-500" />
                        )}
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
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
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Customer Info */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900">Informasi Pelanggan</h4>

                        <div className="flex items-start space-x-2">
                          <User className="h-4 w-4 mt-0.5 text-gray-400" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">Nama</p>
                            <p className="text-sm text-gray-600">{order.user.name}</p>
                          </div>
                        </div>

                        {addressData ? (
                          <>
                            {addressData.nama && (
                              <div className="flex items-start space-x-2">
                                <User className="h-4 w-4 mt-0.5 text-gray-400" />
                                <div className="flex-1">
                                  <p className="text-sm font-medium">Penerima</p>
                                  <p className="text-sm text-gray-600">{addressData.nama}</p>
                                </div>
                              </div>
                            )}

                            {addressData.noHp && (
                              <div className="flex items-start space-x-2">
                                <Phone className="h-4 w-4 mt-0.5 text-gray-400" />
                                <div className="flex-1">
                                  <p className="text-sm font-medium">No HP</p>
                                  <p className="text-sm text-gray-600">
                                    <a href={`tel:${addressData.noHp}`} className="text-blue-600 hover:underline">
                                      {addressData.noHp}
                                    </a>
                                  </p>
                                </div>
                              </div>
                            )}

                            {addressData.alamat && (
                              <div className="flex items-start space-x-2">
                                <MapPin className="h-4 w-4 mt-0.5 text-gray-400" />
                                <div className="flex-1">
                                  <p className="text-sm font-medium">Alamat</p>
                                  <p className="text-sm text-gray-600">{addressData.alamat}</p>
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="flex items-start space-x-2">
                            <MapPin className="h-4 w-4 mt-0.5 text-gray-400" />
                            <div className="flex-1">
                              <p className="text-sm font-medium">Alamat</p>
                              <p className="text-sm text-gray-600">{order.address}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Order Details */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900">Detail Pesanan</h4>

                        <div className="flex items-start space-x-2">
                          <Package className="h-4 w-4 mt-0.5 text-gray-400" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">Total Item</p>
                            <p className="text-sm text-gray-600">{itemCount} item</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-2">
                          <Clock className="h-4 w-4 mt-0.5 text-gray-400" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">Waktu Pengiriman</p>
                            <p className="text-sm text-gray-600">
                              {getDeliveryTimeLabel(order.deliveryTime)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-2">
                          <CreditCard className="h-4 w-4 mt-0.5 text-gray-400" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">Total Pembayaran</p>
                            <p className="text-sm font-semibold text-green-600">
                              Rp {order.totalAmount.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    {items.length > 0 && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="text-sm font-medium mb-2">Item Pesanan</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {items.map((item: OrderItem, index: number) => (
                              <div key={index} className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded">
                                <div className="flex-1">
                                  <span className="font-medium">{item.name || 'Item'}</span>
                                  <span className="text-gray-500 ml-2">x{item.quantity || 1}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {/* Notes */}
                    {order.notes && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="text-sm font-medium mb-1">Catatan</h4>
                          <p className="text-sm text-gray-600 bg-yellow-50 p-2 rounded border-l-4 border-yellow-400">
                            {order.notes}
                          </p>
                        </div>
                      </>
                    )}

                    {/* Action Buttons */}
                    <Separator />
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        Update status pesanan sesuai dengan progress pengiriman
                      </div>
                      <StatusUpdateButtons order={order} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            {completedOrders.length > 0 && (
              <>
                <Separator className="my-6" />
                <h2 className="text-xl font-semibold">Pesanan Selesai ({completedOrders.length})</h2>
                {completedOrders.map((order: Order) => {
                  const items = Array.isArray(order.items) ? order.items : [];
                  const itemCount = items.reduce((sum: number, item: OrderItem) => sum + (item.quantity || 0), 0);
                  const addressData = parseAddressString(order.address);

                  return (
                    <Card key={order.id} className="shadow-sm hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg font-semibold">
                            Order #{order.id.slice(-8).toUpperCase()}
                          </CardTitle>
                          <div className="flex items-center space-x-2">
                            <Badge
                              className={`${getStatusColor(order.status)} border-0`}
                              variant="secondary"
                            >
                              {getStatusLabel(order.status)}
                            </Badge>
                            {order.status === "SIAP_KIRIM" && (
                              <AlertCircle className="h-5 w-5 text-orange-500" />
                            )}
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
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
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Customer Info */}
                          <div className="space-y-3">
                            <h4 className="font-semibold text-gray-900">Informasi Pelanggan</h4>

                            <div className="flex items-start space-x-2">
                              <User className="h-4 w-4 mt-0.5 text-gray-400" />
                              <div className="flex-1">
                                <p className="text-sm font-medium">Nama</p>
                                <p className="text-sm text-gray-600">{order.user.name}</p>
                              </div>
                            </div>

                            {addressData ? (
                              <>
                                {addressData.nama && (
                                  <div className="flex items-start space-x-2">
                                    <User className="h-4 w-4 mt-0.5 text-gray-400" />
                                    <div className="flex-1">
                                      <p className="text-sm font-medium">Penerima</p>
                                      <p className="text-sm text-gray-600">{addressData.nama}</p>
                                    </div>
                                  </div>
                                )}

                                {addressData.noHp && (
                                  <div className="flex items-start space-x-2">
                                    <Phone className="h-4 w-4 mt-0.5 text-gray-400" />
                                    <div className="flex-1">
                                      <p className="text-sm font-medium">No HP</p>
                                      <p className="text-sm text-gray-600">
                                        <a href={`tel:${addressData.noHp}`} className="text-blue-600 hover:underline">
                                          {addressData.noHp}
                                        </a>
                                      </p>
                                    </div>
                                  </div>
                                )}

                                {addressData.alamat && (
                                  <div className="flex items-start space-x-2">
                                    <MapPin className="h-4 w-4 mt-0.5 text-gray-400" />
                                    <div className="flex-1">
                                      <p className="text-sm font-medium">Alamat</p>
                                      <p className="text-sm text-gray-600">{addressData.alamat}</p>
                                    </div>
                                  </div>
                                )}
                              </>
                            ) : (
                              <div className="flex items-start space-x-2">
                                <MapPin className="h-4 w-4 mt-0.5 text-gray-400" />
                                <div className="flex-1">
                                  <p className="text-sm font-medium">Alamat</p>
                                  <p className="text-sm text-gray-600">{order.address}</p>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Order Details */}
                          <div className="space-y-3">
                            <h4 className="font-semibold text-gray-900">Detail Pesanan</h4>

                            <div className="flex items-start space-x-2">
                              <Package className="h-4 w-4 mt-0.5 text-gray-400" />
                              <div className="flex-1">
                                <p className="text-sm font-medium">Total Item</p>
                                <p className="text-sm text-gray-600">{itemCount} item</p>
                              </div>
                            </div>

                            <div className="flex items-start space-x-2">
                              <Clock className="h-4 w-4 mt-0.5 text-gray-400" />
                              <div className="flex-1">
                                <p className="text-sm font-medium">Waktu Pengiriman</p>
                                <p className="text-sm text-gray-600">
                                  {getDeliveryTimeLabel(order.deliveryTime)}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start space-x-2">
                              <CreditCard className="h-4 w-4 mt-0.5 text-gray-400" />
                              <div className="flex-1">
                                <p className="text-sm font-medium">Total Pembayaran</p>
                                <p className="text-sm font-semibold text-green-600">
                                  Rp {order.totalAmount.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Order Items */}
                        {items.length > 0 && (
                          <>
                            <Separator />
                            <div>
                              <h4 className="text-sm font-medium mb-2">Item Pesanan</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {items.map((item: OrderItem, index: number) => (
                                  <div key={index} className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded">
                                    <div className="flex-1">
                                      <span className="font-medium">{item.name || 'Item'}</span>
                                      <span className="text-gray-500 ml-2">x{item.quantity || 1}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </>
                        )}

                        {/* Notes */}
                        {order.notes && (
                          <>
                            <Separator />
                            <div>
                              <h4 className="text-sm font-medium mb-1">Catatan</h4>
                              <p className="text-sm text-gray-600 bg-yellow-50 p-2 rounded border-l-4 border-yellow-400">
                                {order.notes}
                              </p>
                            </div>
                          </>
                        )}

                        {/* Action Buttons */}
                        <Separator />
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-500">
                            Update status pesanan sesuai dengan progress pengiriman
                          </div>
                          <StatusUpdateButtons order={order} />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}