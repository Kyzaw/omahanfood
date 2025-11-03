"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Package, Star } from "lucide-react";
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
      <div className="container mx-auto p-4 max-w-4xl md:pt-35">
        <div className="text-center py-12">
          <p className="text-gray-500">Memuat riwayat pesanan...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto p-4 max-w-4xl md:pt-35">
        <div className="text-center py-12">
          <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Riwayat Pesanan
          </h2>
          <p className="text-gray-500 mb-6">
            Belum ada pesanan yang selesai.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl mb-23 md:pt-35">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Riwayat Pesanan
        </h1>
        <p className="text-gray-600">
          Pesanan yang telah selesai dan dapat direview
        </p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const items = Array.isArray(order.items) ? order.items : [];
          const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

          return (
            <Card
              key={order.id}
              className="shadow-sm hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">
                    Order #{order.id.slice(-8).toUpperCase()}
                  </CardTitle>
                  <Badge className="bg-green-100 text-green-800 border-0">
                    Selesai
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
                      <Clock className="h-4 w-4 mt-0.5 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Waktu Pengiriman</p>
                        <p className="text-sm text-gray-600">
                          {getDeliveryTimeLabel(
                            order.deliveryTime as DeliveryTime
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 mt-0.5 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Metode Pembayaran</p>
                        <p className="text-sm text-gray-600">
                          {order.paymentMethod}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items with Review Buttons */}
                {items.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="text-sm font-medium mb-3">
                        Detail Pesanan
                      </h4>
                      <div className="space-y-3">
                        {items.map((item, index) => {
                          const menuId = item.id;  // Use the id field which contains menuId
                          const reviewed = hasReviewed(order.id, menuId);

                          return (
                            <div
                              key={index}
                              className="flex justify-between items-center gap-4"
                            >
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <span className="font-medium text-sm">
                                      {item.name || "Item"}
                                    </span>
                                    <span className="text-gray-500 ml-2 text-sm">
                                      x{item.quantity}
                                    </span>
                                  </div>
                                  <span className="font-medium text-sm">
                                    Rp{" "}
                                    {(item.price * item.quantity).toLocaleString()}
                                  </span>
                                </div>
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
                                className="flex items-center gap-1"
                              >
                                <Star className={`h-3 w-3 ${reviewed ? "fill-green-500" : ""}`} />
                                {reviewed ? "Sudah Review" : "Beri Review"}
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}

                {/* Total */}
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">
                    Total Pembayaran
                  </span>
                  <span className="text-lg font-bold text-primary">
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
  );
}
