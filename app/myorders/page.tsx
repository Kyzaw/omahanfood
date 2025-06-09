import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { redirect } from "next/navigation";
import { Clock, MapPin, CreditCard, Package, User } from "lucide-react";

// Helper function to get status color
function getStatusColor(status: string) {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "DIBAYAR":
      return "bg-blue-100 text-blue-800";
    case "DIMASAK":
      return "bg-orange-100 text-orange-800";
    case "SIAP_KIRIM":
      return "bg-purple-100 text-purple-800";
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
function parseAddressString(addressString: string) {
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
      <div className="container mx-auto p-4 max-w-4xl md:pt-35">
        <div className="text-center py-12">
          <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Pesanan Saya</h2>
          <p className="text-gray-500 mb-6">Belum ada pesanan yang sedang diproses.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl md:pt-35">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Pesanan Saya</h1>
        <p className="text-gray-600">Pantau status pesanan Anda</p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          // Parse items from JSON
          const items = Array.isArray(order.items) ? order.items : [];
          const itemCount = items.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);

          return (
            <Card key={order.id} className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
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
                  <Clock className="h-4 w-4 mr-1" />
                  {new Date(order.createdAt).toLocaleString("id-ID", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Order Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <Package className="h-4 w-4 mt-0.5 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Total Item</p>
                        <p className="text-sm text-gray-600">{itemCount} item</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 mt-0.5 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Alamat Pengiriman</p>
                        {(() => {
                          try {
                            // First try to parse as JSON
                            const addressData = JSON.parse(order.address);
                            if (typeof addressData === 'object' && addressData !== null) {
                              return (
                                <div className="text-sm text-gray-600 space-y-1">
                                  {addressData.nama && (
                                    <p><span className="font-medium">Nama:</span> {addressData.nama}</p>
                                  )}
                                  {addressData.noHp && (
                                    <p><span className="font-medium">No HP:</span> {addressData.noHp}</p>
                                  )}
                                  {addressData.alamat && (
                                    <p><span className="font-medium">Alamat:</span> {addressData.alamat}</p>
                                  )}
                                </div>
                              );
                            }
                          } catch (error) {
                            // If not JSON, try to parse as delimited string
                            const parsedAddress = parseAddressString(order.address);
                            
                            if (parsedAddress) {
                              return (
                                <div className="text-sm text-gray-600 space-y-1">
                                  {parsedAddress.nama && (
                                    <p><span className="font-medium">Nama:</span> {parsedAddress.nama}</p>
                                  )}
                                  {parsedAddress.noHp && (
                                    <p><span className="font-medium">No HP:</span> {parsedAddress.noHp}</p>
                                  )}
                                  {parsedAddress.alamat && (
                                    <p><span className="font-medium">Alamat:</span> {parsedAddress.alamat}</p>
                                  )}
                                </div>
                              );
                            }
                          }
                          
                          // Fallback to showing as single string
                          return <p className="text-sm text-gray-600">{order.address}</p>;
                        })()}
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
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <CreditCard className="h-4 w-4 mt-0.5 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Metode Pembayaran</p>
                        <p className="text-sm text-gray-600">{order.paymentMethod}</p>
                      </div>
                    </div>

                    {order.courier && (
                      <div className="flex items-start space-x-2">
                        <User className="h-4 w-4 mt-0.5 text-gray-400" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Kurir</p>
                          <p className="text-sm text-gray-600">{order.courier.name}</p>
                        </div>
                      </div>
                    )}

                    {order.paidAt && (
                      <div className="flex items-start space-x-2">
                        <Clock className="h-4 w-4 mt-0.5 text-gray-400" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Dibayar Pada</p>
                          <p className="text-sm text-gray-600">
                            {new Date(order.paidAt).toLocaleString("id-ID", {
                              dateStyle: "short",
                              timeStyle: "short",
                            })}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                {items.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="text-sm font-medium mb-2">Detail Pesanan</h4>
                      <div className="space-y-2">
                        {items.map((item: any, index: number) => (
                          <div key={index} className="flex justify-between items-center text-sm">
                            <div className="flex-1">
                              <span className="font-medium">{item.name || 'Item'}</span>
                              <span className="text-gray-500 ml-2">x{item.quantity || 1}</span>
                            </div>
                            <span className="font-medium">
                              Rp {((item.price || 0) * (item.quantity || 1)).toLocaleString()}
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
                    <Separator />
                    <div>
                      <h4 className="text-sm font-medium mb-1">Catatan</h4>
                      <p className="text-sm text-gray-600">{order.notes}</p>
                    </div>
                  </>
                )}

                {/* Total */}
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total Pembayaran</span>
                  <span className="text-lg font-bold text-primary">
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