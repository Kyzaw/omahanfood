"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Clock, MapPin, Package, Star, CheckCircle2, CreditCard, History, ShoppingBag } from "lucide-react";
import { ReviewDialog } from "@/components/ReviewDialog";

interface OrderItem {
  id: string;  // This is the menuId
  name: string;
  quantity: number;
  price: number;
}

interface Review {
  menuId: string;
}

interface Order {
  id: string;
  status: string;
  deliveryTime: string;
  items: OrderItem[];
  totalAmount: number;
  address: string;
  paymentMethod: string;
  createdAt: string;
  reviews: Review[];
}

type DeliveryTime = "PAGI" | "SIANG" | "SORE";

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

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewDialog, setReviewDialog] = useState<{
    open: boolean;
    orderId: string;
    menuId: string;
    menuName: string;
  }>({
    open: false,
    orderId: "",
    menuId: "",
    menuName: "",
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/order/history");
      const data = await response.json();

      if (response.ok) {
        console.log("Fetched orders:", data.orders);
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReviewClick = (orderId: string, menuId: string, menuName: string) => {
    setReviewDialog({
      open: true,
      orderId,
      menuId,
      menuName,
    });
  };

  const hasReviewed = (orderId: string, menuId: string) => {
    const order = orders.find((o) => o.id === orderId);
    return order?.reviews?.some((r) => r.menuId === menuId) || false;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#faf9f7]">
        <div className="hidden md:block h-16" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 md:py-10 min-h-[70vh] flex items-center justify-center">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <History className="h-8 w-8 text-stone-300 animate-pulse" />
            </div>
            <p className="text-stone-500 font-medium">Memuat riwayat pesanan...</p>
          </div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-[#faf9f7]">
        <div className="hidden md:block h-16" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 md:py-10 min-h-[70vh] flex items-center justify-center">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <History className="h-8 w-8 text-stone-300" />
            </div>
            <h2 className="text-2xl font-bold text-stone-800 mb-2">Belum Ada Riwayat</h2>
            <p className="text-stone-500 mb-6 max-w-sm mx-auto text-sm">
              Pesanan yang telah selesai akan muncul di sini.
            </p>
            <Link href="/" className="inline-flex items-center px-5 py-2.5 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors text-sm font-semibold shadow-sm shadow-orange-200">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Mulai Belanja
            </Link>
          </div>
        </div>
        <div className="md:hidden h-20" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <div className="hidden md:block h-16" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 md:py-10 pb-24 md:pb-10">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-800 tracking-tight">Riwayat Pesanan</h1>
          <p className="text-stone-500 mt-1 text-sm">Pesanan yang telah selesai</p>
          <div className="mt-3 flex items-center gap-2 text-sm">
            <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 border border-emerald-100 font-medium">
              {orders.length} Pesanan Selesai
            </Badge>
          </div>
        </div>

        <div className="space-y-6">
          {orders.map((order) => {
            const items = Array.isArray(order.items) ? order.items : [];
            const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

            return (
              <Card
                key={order.id}
                className="bg-white border border-stone-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                {/* Success indicator bar */}
                <div className="h-1 bg-emerald-500" />

                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-bold text-stone-800 mb-2">
                        Order #{order.id.slice(-8).toUpperCase()}
                      </CardTitle>
                      <div className="flex items-center text-xs text-stone-400">
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
                      className="bg-green-50 text-green-700 border-green-200 border px-4 py-2 font-semibold flex items-center gap-2"
                      variant="secondary"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Selesai
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
                          <Clock className="h-5 w-5 text-blue-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Waktu Pengiriman</p>
                          <p className="text-base font-semibold text-gray-900 mt-0.5">
                            {getDeliveryTimeLabel(
                              order.deliveryTime as DeliveryTime
                            )}
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
                          <p className="text-base font-semibold text-gray-900 mt-0.5">
                            {order.paymentMethod}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items with Review Buttons */}
                  {items.length > 0 && (
                    <>
                      <Separator className="my-6" />
                      <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-5 rounded-xl border border-orange-100">
                        <div className="flex items-center gap-2 mb-4">
                          <ShoppingBag className="h-5 w-5 text-orange-600" />
                          <h4 className="text-base font-bold text-gray-900">Detail Pesanan</h4>
                        </div>
                        <div className="space-y-3">
                          {items.map((item, index) => {
                            const menuId = item.id;
                            const reviewed = hasReviewed(order.id, menuId);

                            return (
                              <div
                                key={index}
                                className="flex justify-between items-center gap-4 bg-white p-4 rounded-lg shadow-sm"
                              >
                                <div className="flex-1">
                                  <div className="flex justify-between items-start mb-2">
                                    <div>
                                      <span className="font-semibold text-gray-900">
                                        {item.name || "Item"}
                                      </span>
                                      <span className="text-orange-600 font-medium ml-2">
                                        ×{item.quantity}
                                      </span>
                                    </div>
                                    <span className="font-bold text-gray-900">
                                      Rp {(item.price * item.quantity).toLocaleString()}
                                    </span>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant={reviewed ? "reviewed" : "review"}
                                    onClick={() =>
                                      handleReviewClick(
                                        order.id,
                                        menuId,
                                        item.name
                                      )
                                    }
                                    disabled={reviewed}
                                    className="flex items-center gap-1.5 mt-2"
                                  >
                                    <Star className={`h-4 w-4 ${reviewed ? "fill-green-500" : ""}`} />
                                    {reviewed ? "Sudah Review" : "Beri Review"}
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Total */}
                  <Separator className="my-6" />
                  <div className="flex justify-between items-center bg-stone-800 p-4 rounded-xl">
                    <span className="text-sm font-semibold text-stone-300">
                      Total Pembayaran
                    </span>
                    <span className="text-lg font-bold text-white">
                      Rp {order.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Review Dialog */}
        <ReviewDialog
          open={reviewDialog.open}
          onOpenChange={(open) =>
            setReviewDialog({ ...reviewDialog, open })
          }
          orderId={reviewDialog.orderId}
          menuId={reviewDialog.menuId}
          menuName={reviewDialog.menuName}
        />
      </div>
    </div>
  );
}
