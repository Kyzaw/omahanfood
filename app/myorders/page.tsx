import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Clock, MapPin, CreditCard, Package, User, CheckCircle2, Truck, ChefHat, ShoppingBag, AlertCircle, RefreshCw } from "lucide-react";


interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface AddressData {
  nama: string;
  noHp: string;
  alamat: string;
}

type OrderStatus = 'PENDING' | 'DIBAYAR' | 'DIMASAK' | 'SIAP_KIRIM' | 'DIKIRIM' | 'SELESAI';
type DeliveryTime = 'PAGI' | 'SIANG' | 'SORE';

interface JsonOrderItem {
  name?: string | null;
  quantity?: number | string | null;
  price?: number | string | null;
}

// Type guard to check if an item is a valid order item from JSON
function isValidOrderItem(item: unknown): item is JsonOrderItem {
  if (typeof item !== 'object' || item === null) {
    return false;
  }

  const jsonItem = item as Record<string, unknown>;
  return (
    'name' in jsonItem ||
    'quantity' in jsonItem ||
    'price' in jsonItem
  );
}

// Helper function to get status color
function getStatusColor(status: OrderStatus) {
  switch (status) {
    case "PENDING":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case "DIBAYAR":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "DIMASAK":
      return "bg-orange-50 text-orange-700 border-orange-200";
    case "SIAP_KIRIM":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "DIKIRIM":
      return "bg-indigo-50 text-indigo-700 border-indigo-200";
    case "SELESAI":
      return "bg-green-50 text-green-700 border-green-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
}

// Helper function to get status icon
function getStatusIcon(status: OrderStatus) {
  switch (status) {
    case "PENDING":
      return AlertCircle;
    case "DIBAYAR":
      return CheckCircle2;
    case "DIMASAK":
      return ChefHat;
    case "SIAP_KIRIM":
      return Package;
    case "DIKIRIM":
      return Truck;
    case "SELESAI":
      return CheckCircle2;
    default:
      return Package;
  }
}

// Helper function to get order progress
function getOrderProgress(status: OrderStatus): number {
  switch (status) {
    case "PENDING":
      return 0;
    case "DIBAYAR":
      return 20;
    case "DIMASAK":
      return 40;
    case "SIAP_KIRIM":
      return 60;
    case "DIKIRIM":
      return 80;
    case "SELESAI":
      return 100;
    default:
      return 0;
  }
}

// Helper function to get status label
function getStatusLabel(status: OrderStatus) {
  switch (status) {
    case "PENDING":
      return "Menunggu Pembayaran";
    case "DIBAYAR":
      return "Sudah Dibayar";
    case "DIMASAK":
      return "Sedang Dimasak";
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

function getDeliveryTimeLabel(deliveryTime: DeliveryTime) {
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
  // Try different patterns to extract name, phone, and address

  // Pattern 1: "Nama | 08123456789 | Jl. Address"
  const pattern1 = addressString.split(' | ');
  if (pattern1.length === 3) {
    return {
      nama: pattern1[0].trim(),
      noHp: pattern1[1].trim(),
      alamat: pattern1[2].trim()
    };
  }

  // Pattern 2: "Nama, 08123456789, Jl. Address"
  const pattern2 = addressString.split(', ');
  if (pattern2.length >= 3) {
    return {
      nama: pattern2[0].trim(),
      noHp: pattern2[1].trim(),
      alamat: pattern2.slice(2).join(', ').trim()
    };
  }

  // Pattern 3: "Nama - 08123456789 - Jl. Address"
  const pattern3 = addressString.split(' - ');
  if (pattern3.length === 3) {
    return {
      nama: pattern3[0].trim(),
      noHp: pattern3[1].trim(),
      alamat: pattern3[2].trim()
    };
  }

  // Pattern 4: Extract phone number with regex and split accordingly
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

  // Pattern 5: Try to extract phone from anywhere in the string
  if (phoneMatch && phoneMatch.length > 0) {
    const phone = phoneMatch[0];
    const withoutPhone = addressString.replace(phone, '').trim();

    // Split remaining text, assume first part is name, rest is address
    const parts = withoutPhone.split(/[,|-]/).map(p => p.trim()).filter(p => p);

    if (parts.length >= 2) {
      return {
        nama: parts[0],
        noHp: phone,
        alamat: parts.slice(1).join(', ')
      };
    } else if (parts.length === 1) {
      return {
        nama: parts[0],
        noHp: phone,
        alamat: ''
      };
    }
  }

  // If no pattern matches, return null to show as single string
  return null;
}

export default async function MyOrdersPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return redirect("/login");
  }

  const orders = await prisma.order.findMany({
    where: {
      userId,
      status: {
        not: "SELESAI",
      },
    },
    include: {
      courier: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (orders.length === 0) {
    return (
      <div className="container mx-auto p-4 max-w-4xl md:pt-35 min-h-[70vh] flex items-center justify-center">
        <div className="text-center py-12">
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-gradient-to-br from-orange-100 to-orange-50 rounded-full blur-2xl opacity-50"></div>
            </div>
            <ShoppingBag className="relative mx-auto h-20 w-20 text-orange-400 mb-4" strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Belum Ada Pesanan</h2>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">Anda belum memiliki pesanan yang sedang diproses. Mulai pesan makanan favorit Anda sekarang!</p>
          <Link href="/" className="inline-flex items-center px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium shadow-sm">
            <ShoppingBag className="h-5 w-5 mr-2" />
            Mulai Belanja
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-5xl mb-23 md:pt-35">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Package className="h-6 w-6 text-orange-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">Pesanan Saya</h1>
        </div>
        <p className="text-gray-600 text-lg">Pantau dan kelola pesanan Anda dengan mudah</p>
        <div className="mt-4 flex items-center gap-2 text-sm">
          <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
            {orders.length} Pesanan Aktif
          </Badge>
        </div>
      </div>

      <div className="space-y-6">
        {orders.map((order) => {
          // Parse items from JSON and validate the structure
          const rawItems = Array.isArray(order.items) ? order.items : [];
          const parsedItems = rawItems.map((item) => {
            if (isValidOrderItem(item)) {
              return {
                name: String(item.name || ''),
                quantity: Number(item.quantity || 1),
                price: Number(item.price || 0)
              } satisfies OrderItem;
            }
            return { name: '', quantity: 1, price: 0 } satisfies OrderItem;
          });

          const items = parsedItems;
          const itemCount = items.reduce((sum: number, item) => sum + item.quantity, 0);
          const StatusIcon = getStatusIcon(order.status as OrderStatus);
          const progress = getOrderProgress(order.status as OrderStatus);

          return (
            <Card key={order.id} className="shadow-md hover:shadow-xl transition-all duration-300 border-2 border-gray-100 overflow-hidden">
              {/* Progress bar */}
              <div className="h-1.5 bg-gray-100">
                <div
                  className="h-full bg-gradient-to-r from-orange-400 to-orange-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <CardHeader className="pb-4 bg-gradient-to-br from-gray-50 to-white">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-xl font-bold text-gray-900">
                        Order #{order.id.slice(-8).toUpperCase()}
                      </CardTitle>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1.5" />
                      {new Date(order.createdAt).toLocaleString("id-ID", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  <Badge
                    className={`${getStatusColor(order.status as OrderStatus)} border px-4 py-2 font-semibold flex items-center gap-2`}
                    variant="secondary"
                  >
                    <StatusIcon className="h-4 w-4" />
                    {getStatusLabel(order.status as OrderStatus)}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-6 pt-6">
                {/* Order Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Package className="h-5 w-5 text-orange-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Item</p>
                        <p className="text-base font-semibold text-gray-900 mt-0.5">{itemCount} item</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <MapPin className="h-5 w-5 text-red-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Alamat Pengiriman</p>
                        {(() => {
                          try {
                            const addressData = JSON.parse(order.address);
                            if (typeof addressData === 'object' && addressData !== null) {
                              return (
                                <p className="text-sm text-gray-900 font-medium leading-relaxed">
                                  {addressData.alamat || order.address}
                                </p>
                              );
                            }
                          } catch {
                            // If not JSON, try to parse as delimited string
                            const parsedAddress = parseAddressString(order.address);

                            if (parsedAddress && parsedAddress.alamat) {
                              return (
                                <p className="text-sm text-gray-900 font-medium leading-relaxed">
                                  {parsedAddress.alamat}
                                </p>
                              );
                            }
                          }

                          // Fallback to showing as single string
                          return <p className="text-sm text-gray-900 font-medium leading-relaxed">{order.address}</p>;
                        })()}
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Clock className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Waktu Pengiriman</p>
                        <p className="text-base font-semibold text-gray-900 mt-0.5">
                          {getDeliveryTimeLabel(order.deliveryTime as DeliveryTime)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <CreditCard className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Metode Pembayaran</p>
                        <p className="text-base font-semibold text-gray-900 mt-0.5">{order.paymentMethod}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-3 rounded-lg bg-orange-50 border border-orange-100">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <RefreshCw className="h-5 w-5 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-orange-600 uppercase tracking-wide">Paket & Progress</p>
                        <p className="text-base font-semibold text-gray-900 mt-0.5 capitalize">
                          Paket {order.jenisPaket.toLowerCase()} ({order.deliveredCount}/{order.totalDeliveries})
                        </p>
                        {order.nextDeliveryDate && order.deliveredCount < order.totalDeliveries && (
                          <p className="text-xs text-orange-600 font-medium mt-1">
                            Pengiriman berikutnya: {new Date(order.nextDeliveryDate).toLocaleDateString('id-ID', {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'short'
                            })}
                          </p>
                        )}
                      </div>
                    </div>

                    {order.courier && (
                      <div className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          <User className="h-5 w-5 text-purple-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Kurir</p>
                          <p className="text-base font-semibold text-gray-900 mt-0.5">{order.courier.name}</p>
                        </div>
                      </div>
                    )}
                  </div>

                </div>

                {/* Order Items */}
                {items.length > 0 && (
                  <>
                    <Separator className="my-6" />
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-5 rounded-xl border border-orange-100">
                      <div className="flex items-center gap-2 mb-4">
                        <ShoppingBag className="h-5 w-5 text-orange-600" />
                        <h4 className="text-base font-bold text-gray-900">Detail Pesanan</h4>
                      </div>
                      <div className="space-y-3">
                        {items.map((item, index: number) => (
                          <div key={index} className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm">
                            <div className="flex-1">
                              <span className="font-semibold text-gray-900">{item.name || 'Item'}</span>
                              <span className="text-orange-600 font-medium ml-2">×{item.quantity}</span>
                            </div>
                            <span className="font-bold text-gray-900">
                              Rp {(item.price * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Notes */}
                {order.notes && (
                  <>
                    <Separator className="my-6" />
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-blue-600" />
                        Catatan Pesanan
                      </h4>
                      <p className="text-sm text-gray-700 italic">{order.notes}</p>
                    </div>
                  </>
                )}

                {/* Total */}
                <Separator className="my-6" />
                <div className="flex justify-between items-center bg-gradient-to-r from-orange-500 to-orange-600 p-5 rounded-xl shadow-lg">
                  <span className="text-lg font-bold text-white">Total Pembayaran</span>
                  <span className="text-2xl font-bold text-white">
                    Rp {order.totalAmount.toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}