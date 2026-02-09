"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Package, ShoppingCart, Plus, Minus, Trash2, CheckCircle } from "lucide-react";

interface CheckoutItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
}

interface Address {
  name: string;
  phone: string;
  fullAddress: string;
}

interface MidtransResult {
  payment_type: string;
  transaction_status?: string;
  order_id?: string;
  status_message?: string;
}

interface MidtransSnap {
  pay: (token: string, options: {
    onSuccess: (result: MidtransResult) => void;
    onError: (error: Error) => void;
    onClose: () => void;
  }) => void;
}

declare global {
  interface Window {
    snap: MidtransSnap;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [items, setItems] = useState<CheckoutItem[]>([]);
  const [address, setAddress] = useState<Address>({
    name: "",
    phone: "+62",
    fullAddress: "",
  });
  const [deliveryTime, setDeliveryTime] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [snapLoaded, setSnapLoaded] = useState(false);
  const [jenisPaket, setJenisPaket] = useState<string>("HARIAN");
  const [phoneError, setPhoneError] = useState<string>("");

  const paketMultiplier = jenisPaket === "HARIAN" ? 1 : jenisPaket === "MINGGUAN" ? 6 : 25;
  const total = items.reduce((acc, item) => acc + item.price * paketMultiplier * item.quantity, 0);

  // Phone validation function
  const validatePhoneNumber = (phone: string): boolean => {
    // Check if starts with +62
    if (!phone.startsWith('+62')) {
      setPhoneError("Nomor telepon harus diawali dengan +62");
      return false;
    }

    // Check total length (max 13 characters: +62 + max 13 digits)
    if (phone.length > 15) {
      setPhoneError("Nomor telepon maksimal 13 karakter");
      return false;
    }

    // Check minimum length (min 12 characters: +62 + min 7 digits)
    if (phone.length < 12) {
      setPhoneError("Nomor telepon minimal 10 karakter");
      return false;
    }

    // Check if only digits after +62
    const digits = phone.substring(3);
    if (!/^\d+$/.test(digits)) {
      setPhoneError("Nomor telepon hanya boleh mengandung angka setelah +62");
      return false;
    }

    setPhoneError("");
    return true;
  };

  // Load Midtrans Snap
  useEffect(() => {
    const loadSnapScript = () => {
      if (window.snap) {
        setSnapLoaded(true);
        return;
      }

      const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js";
      const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT;

      if (!clientKey) {
        console.error("Midtrans client key not found");
        return;
      }

      const script = document.createElement('script');
      script.src = snapScript;
      script.setAttribute('data-client-key', clientKey);
      script.async = true;

      script.onload = () => setSnapLoaded(true);
      script.onerror = () => {
        console.error("Failed to load Midtrans Snap script");
        toast.error("❌ Gagal memuat sistem pembayaran");
      };

      document.body.appendChild(script);

      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    };

    loadSnapScript();
  }, []);

  // Load checkout data from localStorage
  useEffect(() => {
    const storedItems = localStorage.getItem("checkoutItems");
    const storedAddress = localStorage.getItem("shippingAddress");

    if (storedItems) {
      try {
        setItems(JSON.parse(storedItems));
      } catch (error) {
        console.error("Error parsing checkout items:", error);
        localStorage.removeItem("checkoutItems");
      }
    }

    if (storedAddress) {
      try {
        setAddress(JSON.parse(storedAddress));
      } catch (error) {
        console.error("Error parsing address:", error);
        localStorage.removeItem("shippingAddress");
      }
    }
  }, []);

  const updateLocalStorage = (newItems: CheckoutItem[]) => {
    localStorage.setItem("checkoutItems", JSON.stringify(newItems));
    setItems(newItems);
    window.dispatchEvent(new Event("checkoutUpdated"));
  };

  const handleAddressChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Special handling for phone input
    if (name === 'phone') {
      // Prevent deleting the +62 prefix
      if (value.length < 3) {
        return; // Don't allow deletion below +62
      }

      // Only allow digits after +62
      const prefix = value.substring(0, 3);
      const digits = value.substring(3).replace(/[^\d]/g, '');

      // Limit to 15 characters total (+62 + max 10 digits)
      if (digits.length > 12) {
        return; // Don't allow more digits
      }

      const cleanedValue = prefix + digits;

      setAddress((prev) => ({ ...prev, [name]: cleanedValue }));
      validatePhoneNumber(cleanedValue);
    } else {
      setAddress((prev) => ({ ...prev, [name]: value }));
    }
  };

  const saveAddress = () => {
    const { name, phone, fullAddress } = address;

    if (!name.trim() || !phone.trim() || !fullAddress.trim()) {
      toast.error("❌ Harap lengkapi semua informasi alamat.");
      return;
    }

    // Validate phone number before saving
    if (!validatePhoneNumber(phone)) {
      toast.error("❌ " + phoneError);
      return;
    }

    localStorage.setItem("shippingAddress", JSON.stringify(address));
    toast.success("✅ Alamat pengiriman disimpan.");
  };

  const fetchCurrentAddress = () => {
    if (!navigator.geolocation) {
      toast.error("❌ Geolocation tidak didukung di browser ini.");
      return;
    }

    toast.loading("📍 Mengambil lokasi...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=id`
          );

          if (!res.ok) throw new Error("Failed to fetch address");

          const data = await res.json();
          const fullAddress = data.display_name || "";

          setAddress((prev) => ({ ...prev, fullAddress }));
          toast.dismiss();
          toast.success("✅ Alamat berhasil diambil dari lokasi.");
        } catch (error) {
          toast.dismiss();
          toast.error("❌ Gagal mengambil alamat dari lokasi.");
          console.error("Geocoding error:", error);
        }
      },
      (error) => {
        toast.dismiss();
        toast.error("❌ Gagal mengambil lokasi. Pastikan izin lokasi diaktifkan.");
        console.error("Geolocation error:", error);
      },
      {
        timeout: 10000,
        enableHighAccuracy: true
      }
    );
  };

  const increaseQty = (id: string) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateLocalStorage(updated);
  };

  const decreaseQty = (id: string) => {
    const updated = items
      .map((item) =>
        item.id === id ? { ...item, quantity: Math.max(0, item.quantity - 1) } : item
      )
      .filter((item) => item.quantity > 0);
    updateLocalStorage(updated);
  };

  const removeItem = (id: string) => {
    const updated = items.filter((item) => item.id !== id);
    updateLocalStorage(updated);
    toast.success("✅ Item dihapus dari keranjang");
  };

  const validateCheckoutData = () => {
    if (!session?.user?.id) {
      toast.error("❌ Anda harus login terlebih dahulu.");
      return false;
    }

    if (items.length === 0) {
      toast.error("❌ Keranjang Anda kosong.");
      return false;
    }

    const { name, phone, fullAddress } = address;
    if (!name.trim() || !phone.trim() || !fullAddress.trim()) {
      toast.error("❌ Harap lengkapi alamat pengiriman terlebih dahulu.");
      return false;
    }

    // Validate phone number format
    if (!validatePhoneNumber(phone)) {
      toast.error("❌ " + phoneError);
      return false;
    }

    if (!deliveryTime) {
      toast.error("❌ Harap pilih waktu pengiriman.");
      return false;
    }

    if (!snapLoaded) {
      toast.error("❌ Sistem pembayaran belum siap. Silakan coba lagi.");
      return false;
    }

    return true;
  };

  const handleCheckout = async () => {
    if (!validateCheckoutData()) return;

    setIsLoading(true);

    try {
      const updatedItems = items.map(({ id, name, price, quantity }) => ({
        id,
        name,
        price,
        quantity: quantity * paketMultiplier,
      }));

      // Hitung total baru
      const totalAmount = updatedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

      // Create order
      const orderPayload = {
        userId: session?.user?.id,
        deliveryTime: deliveryTime.toUpperCase(),
        items: updatedItems,
        totalAmount,
        jenisPaket,
        address: `${address.name}, ${address.phone}, ${address.fullAddress}`,
        paymentMethod: "PENDING",
        notes: note.trim() || null,
      };

      const orderRes = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (!orderRes.ok) {
        const error = await orderRes.json();
        throw new Error(error.details ? `${error.error}: ${error.details}` : (error.error || "Failed to create order"));
      }


      const { orderId } = await orderRes.json();

      // Create payment token
      const transactionRes = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, totalAmount }),
      });

      if (!transactionRes.ok) {
        throw new Error("Failed to create payment token");
      }

      const { token } = await transactionRes.json();

      // Open Midtrans payment popup
      window.snap.pay(token, {
        onSuccess: async function (result: MidtransResult) {
          try {
            const paymentMethod = result.payment_type || "unknown";

            const updateRes = await fetch("/api/order/payment-method", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderId, paymentMethod }),
            });

            if (!updateRes.ok) {
              throw new Error("Failed to update payment method");
            }

            toast.success("✅ Pembayaran berhasil! Terima kasih telah memesan.");

            // Clear checkout data
            localStorage.removeItem("checkoutItems");
            localStorage.removeItem("shippingAddress");
            setItems([]);
            setAddress({
              name: "",
              phone: "+62",
              fullAddress: ""
            });
            setDeliveryTime("");
            setNote("");

            // Redirect to success page or orders page
            setTimeout(() => {
              router.push("/");
            }, 2000);
          } catch (error) {
            console.error("Payment update error:", error);
            toast.error("❌ Pembayaran berhasil tetapi gagal memperbarui status. Silakan hubungi customer service.");
          }
        },
        onError: function (error: Error) {
          console.error("Payment error:", error);
          toast.error("❌ Pembayaran gagal. Silakan coba lagi.");
        },
        onClose: function () {
          toast("⚠️ Pembayaran dibatalkan.");
        },
      });

    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(`❌ ${error instanceof Error ? error.message : "Terjadi kesalahan saat checkout"}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 pb-15 sm:pt-24 md:pt-28">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="text-center lg:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">Checkout</h1>
              <p className="text-gray-600 text-sm sm:text-base">Lengkapi detail pesanan Anda untuk melanjutkan</p>
            </div>

            {/* Delivery Address Card */}
            <Card className="bg-white/95 backdrop-blur-xl border border-gray-100 shadow-lg">
              <CardHeader className="pb-4 px-4 sm:px-6">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                  Alamat Pengiriman
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 px-4 sm:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                      Nama Penerima <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={address.name}
                      onChange={handleAddressChange}
                      placeholder="Nama lengkap"
                      className="h-10 sm:h-11 border-gray-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl text-sm"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">
                      Nomor Telepon <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={address.phone}
                      onChange={handleAddressChange}
                      placeholder="+628123456789"
                      className={`h-10 sm:h-11 border-gray-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl text-sm ${phoneError ? 'border-red-500 focus:border-red-500' : ''}`}
                      required
                    />
                    {phoneError && (
                      <p className="text-xs text-red-500 mt-1">{phoneError}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fullAddress" className="text-sm font-semibold text-gray-700">
                    Alamat Lengkap <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="fullAddress"
                    name="fullAddress"
                    value={address.fullAddress}
                    onChange={handleAddressChange}
                    placeholder="Jalan, No Rumah, Kelurahan, Kecamatan, Kota"
                    rows={3}
                    className="resize-none border-gray-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl text-sm"
                    required
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Button
                    variant="outline"
                    onClick={fetchCurrentAddress}
                    className="flex items-center gap-2 border-orange-200 text-orange-600 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 rounded-xl transition-all duration-300 hover:scale-105 text-sm h-10 sm:h-11"
                    type="button"
                  >
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm">Gunakan Lokasi Saat Ini</span>
                  </Button>
                  <Button
                    onClick={saveAddress}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-sm h-10 sm:h-11"
                    type="button"
                  >
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="text-xs sm:text-sm">Simpan Alamat</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <Card className="bg-white/95 backdrop-blur-xl border border-gray-100 shadow-lg">
                <CardHeader className="pb-4 px-4 sm:px-6">
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                    Waktu Pengiriman
                  </CardTitle>
                  <p className="text-xs sm:text-sm text-gray-600">Order sekarang, dikirim besok</p>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  <RadioGroup
                    value={deliveryTime}
                    onValueChange={setDeliveryTime}
                    className="space-y-3"
                  >
                    {[
                      { value: "PAGI", label: "Pagi", time: "05:00 WIB", desc: "Sarapan pagi" },
                      { value: "SIANG", label: "Siang", time: "10:00 WIB", desc: "Makan siang" },
                      { value: "SORE", label: "Sore", time: "15:00 WIB", desc: "Makan sore" }
                    ].map((time) => (
                      <div key={time.value} className="flex items-center space-x-3 p-3 rounded-xl border border-gray-200 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 transition-all duration-300 hover:scale-105">
                        <RadioGroupItem value={time.value} id={time.value} className="text-orange-500" />
                        <Label htmlFor={time.value} className="cursor-pointer flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-semibold text-gray-900 text-sm">{time.label}</span>
                              <p className="text-xs sm:text-sm text-gray-600">{time.desc}</p>
                            </div>
                            <span className="text-xs sm:text-sm font-semibold text-orange-600">{time.time}</span>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>

              <Card className="bg-white/95 backdrop-blur-xl border border-gray-100 shadow-lg">
                <CardHeader className="pb-4 px-4 sm:px-6">
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    <Package className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                    Jenis Paket
                  </CardTitle>
                  <p className="text-xs sm:text-sm text-gray-600">Hari minggu & tanggal merah libur</p>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  <RadioGroup
                    value={jenisPaket}
                    onValueChange={setJenisPaket}
                    className="space-y-3"
                  >
                    {[
                      { value: "HARIAN", label: "Harian", desc: "1x pengiriman per hari", multiplier: 1 },
                      { value: "MINGGUAN", label: "Mingguan", desc: "6x pengiriman per minggu", multiplier: 6 },
                      { value: "BULANAN", label: "Bulanan", desc: "25x pengiriman per bulan", multiplier: 25 }
                    ].map((item) => (
                      <div key={item.value} className="flex items-center space-x-3 p-3 rounded-xl border border-gray-200 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 transition-all duration-300 hover:scale-105">
                        <RadioGroupItem value={item.value} id={item.value} className="text-orange-500" />
                        <Label htmlFor={item.value} className="cursor-pointer flex-1">
                          <div>
                            <span className="font-semibold text-gray-900 text-sm">{item.label}</span>
                            <p className="text-xs sm:text-sm text-gray-600">{item.desc}</p>
                          </div>
                        </Label>
                        <Badge variant="outline" className="text-orange-600 border-orange-200 bg-gradient-to-r from-orange-50 to-red-50 text-xs">
                          ×{item.multiplier}
                        </Badge>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            {/* Additional Notes */}
            <Card className="bg-white/95 backdrop-blur-xl border border-gray-100 shadow-lg">
              <CardHeader className="pb-4 px-4 sm:px-6">
                <CardTitle className="text-lg font-semibold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Catatan Tambahan</CardTitle>
                <p className="text-xs sm:text-sm text-gray-600">Alergi, preferensi, atau instruksi khusus</p>
              </CardHeader>
              <CardContent className="px-4 sm:px-6">
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Contoh: Tidak pakai sambal, Alergi kacang, dll."
                  rows={3}
                  maxLength={500}
                  className="resize-none border-gray-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl text-sm"
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-gray-500">
                    {note.length}/500 karakter
                  </p>
                  <Badge variant="secondary" className="text-xs bg-gradient-to-r from-orange-50 to-red-50 text-orange-600 border-orange-200">
                    Opsional
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Cart Items */}
            <Card className="bg-white/95 backdrop-blur-xl border border-gray-100 shadow-lg">
              <CardHeader className="pb-4 px-4 sm:px-6">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                  Keranjang Belanja
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-6">
                {items.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <ShoppingCart className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500" />
                    </div>
                    <p className="text-gray-500 text-base sm:text-lg mb-4 sm:mb-6 font-medium">Keranjang Anda kosong</p>
                    <Button
                      onClick={() => router.push("/")}
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-sm h-10 sm:h-11 px-4 sm:px-6"
                    >
                      Mulai Belanja
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item, index) => (
                      <div key={item.id}>
                        <div className="flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-gradient-to-r from-orange-50/50 to-red-50/50 hover:from-orange-50 hover:to-red-50 transition-all duration-300">
                          <div className="flex-shrink-0">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-xl overflow-hidden shadow-sm">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="object-cover w-full h-full"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <Package className="w-6 h-6 sm:w-8 sm:h-8" />
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm sm:text-base">{item.name}</h3>
                            <p className="text-gray-600 text-xs sm:text-sm mt-1">
                              Rp {item.price.toLocaleString("id-ID")}
                            </p>
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => decreaseQty(item.id)}
                                  className="h-7 w-7 sm:h-8 sm:w-8 p-0 border-gray-200 hover:bg-gray-50 rounded-xl transition-all duration-300 hover:scale-105"
                                  disabled={isLoading}
                                >
                                  <Minus className="w-3 h-3" />
                                </Button>
                                <span className="font-semibold min-w-[2rem] text-center text-gray-900 text-sm">{item.quantity}</span>
                                <Button
                                  size="sm"
                                  onClick={() => increaseQty(item.id)}
                                  className="h-7 w-7 sm:h-8 sm:w-8 p-0 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-xl transition-all duration-300 hover:scale-105"
                                  disabled={isLoading}
                                >
                                  <Plus className="w-3 h-3" />
                                </Button>
                              </div>
                              <div className="flex items-center gap-2 sm:gap-3">
                                <span className="font-bold text-orange-600 text-sm sm:text-base">
                                  Rp {(item.price * item.quantity * paketMultiplier).toLocaleString("id-ID")}
                                </span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => removeItem(item.id)}
                                  className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-red-500 border-red-200 hover:bg-red-50 rounded-xl transition-all duration-300 hover:scale-105"
                                  disabled={isLoading}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                        {index < items.length - 1 && <Separator className="my-4 bg-gradient-to-r from-orange-200 to-red-200" />}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 sm:top-28 md:top-32 space-y-4 sm:space-y-6">
              {/* Order Summary Card */}
              <Card className="bg-white/95 backdrop-blur-xl border border-gray-100 shadow-lg">
                <CardHeader className="pb-4 px-4 sm:px-6">
                  <CardTitle className="text-lg font-semibold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Ringkasan Pesanan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 px-4 sm:px-6">
                  {items.length > 0 && (
                    <>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 font-medium">Total Items</span>
                          <span className="font-semibold">{items.reduce((acc, item) => acc + item.quantity, 0)} produk</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 font-medium">Jenis Paket</span>
                          <span className="font-semibold capitalize">{jenisPaket.toLowerCase()}</span>
                        </div>
                      </div>
                      <Separator className="bg-gradient-to-r from-orange-200 to-red-200" />
                      <div className="flex justify-between items-center">
                        <span className="text-gray-900 font-bold">Total Pembayaran</span>
                        <div className="text-right">
                          <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                            Rp {total.toLocaleString("id-ID")}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Termasuk biaya pengiriman
                          </p>
                        </div>
                      </div>
                      <Separator className="bg-gradient-to-r from-orange-200 to-red-200" />
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="font-medium">Pembayaran aman & terpercaya</span>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Checkout Button */}
              {items.length > 0 && (
                <Button
                  onClick={handleCheckout}
                  disabled={isLoading || !snapLoaded}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base shadow-lg hover:shadow-xl disabled:opacity-50 transition-all duration-300 hover:scale-105"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Memproses...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <span>Checkout & Bayar</span>
                      <span className="text-sm font-bold">→</span>
                    </span>
                  )}
                </Button>
              )}

              {/* Security Badge */}
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 rounded-full text-xs sm:text-sm font-semibold shadow-md border border-green-100">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>100% Aman & Terjamin</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
