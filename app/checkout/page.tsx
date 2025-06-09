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

declare global {
  interface Window {
    snap: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  
  const [items, setItems] = useState<CheckoutItem[]>([]);
  const [address, setAddress] = useState<Address>({
    name: "",
    phone: "",
    fullAddress: "",
  });
  const [deliveryTime, setDeliveryTime] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [snapLoaded, setSnapLoaded] = useState(false);

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
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const saveAddress = () => {
    const { name, phone, fullAddress } = address;
    
    if (!name.trim() || !phone.trim() || !fullAddress.trim()) {
      toast.error("❌ Harap lengkapi semua informasi alamat.");
      return;
    }

    // Basic phone validation
    const phoneRegex = /^08\d{8,12}$/;
    if (!phoneRegex.test(phone.replace(/\s+/g, ''))) {
      toast.error("❌ Format nomor telepon tidak valid. Gunakan format 08xxxxxxxxxx");
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

  const [jenisPaket, setJenisPaket] = useState<string>("HARIAN")
  const paketMultiplier = jenisPaket === "HARIAN" ? 1 : jenisPaket === "MINGGUAN" ? 6 : 25;

  const total = items.reduce((acc, item) => acc + item.price * paketMultiplier * item.quantity, 0);

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
        jenisPaket, // Tambahkan jenis paket ke payload
        address: `${address.name}, ${address.phone}, ${address.fullAddress}`,
        paymentMethod: "PENDING", // Will be updated after payment
        notes: note.trim() || null,
      };

      const orderRes = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (!orderRes.ok) {
        const error = await orderRes.json();
        throw new Error(error.error || "Failed to create order");
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
        onSuccess: async function (result: any) {
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
              phone: "",
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
        onError: function (error: any) {
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 md:pt-25">
      {/* Mobile-first container with better spacing */}
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-10 pb-32 sm:pb-24">
        {/* Header with better mobile spacing */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-orange-600">Checkout</h1>
        </div>

        {/* Alamat Pengiriman - Mobile optimized */}
        <section className="bg-white border rounded-xl sm:rounded-2xl shadow-sm mb-4 sm:mb-6 overflow-hidden">
          <div className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Alamat Pengiriman</h2>
            <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4 lg:gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Nama Penerima *</Label>
                <Input
                  id="name"
                  name="name"
                  value={address.name}
                  onChange={handleAddressChange}
                  placeholder="Nama lengkap"
                  className="h-11"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">Nomor Telepon *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={address.phone}
                  onChange={handleAddressChange}
                  placeholder="08xxxxxxxxxx"
                  className="h-11"
                  required
                />
              </div>
              <div className="sm:col-span-2 space-y-2">
                <Label htmlFor="fullAddress" className="text-sm font-medium">Alamat Lengkap *</Label>
                <Textarea
                  id="fullAddress"
                  name="fullAddress"
                  value={address.fullAddress}
                  onChange={handleAddressChange}
                  placeholder="Jalan, No Rumah, Kelurahan, Kecamatan, Kota"
                  rows={3}
                  className="resize-none"
                  required
                />
                <Button
                  variant="link"
                  onClick={fetchCurrentAddress}
                  className="p-0 h-auto text-sm text-orange-600 hover:underline"
                  type="button"
                >
                  📍 Gunakan Lokasi Saat Ini
                </Button>
              </div>
            </div>

            <Button
              onClick={saveAddress}
              className="mt-4 sm:mt-6 w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white h-11"
              type="button"
            >
              Simpan Alamat
            </Button>
          </div>
        </section>

        {/* Waktu Pengiriman - Mobile optimized */}
        <section className="bg-white border rounded-xl sm:rounded-2xl shadow-sm mb-4 sm:mb-6">
          <div className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold">Pilih Waktu Pengiriman *</h2>
            <h2 className="text-sm sm:text-sm font-semibold mb-4 ">Note : Jika order sekarang maka akan dikirim besok</h2>
            <RadioGroup
              value={deliveryTime}
              onValueChange={setDeliveryTime}
              className="space-y-3 sm:space-y-0 sm:flex sm:gap-6 lg:gap-8"
            >
              {[
                { value: "PAGI", label: "Pagi", time: "(05:00)" },
                { value: "SIANG", label: "Siang", time: "(10:00)" },
                { value: "SORE", label: "Sore", time: "(15:00)" }
              ].map((time) => (
                <div key={time.value} className="flex items-center space-x-3">
                  <RadioGroupItem value={time.value} id={time.value} className="mt-0.5" />
                  <Label htmlFor={time.value} className="cursor-pointer flex-1 sm:flex-none">
                    <span className="font-medium">{time.label}</span>
                    <span className="block sm:inline sm:ml-1 text-sm text-gray-600">{time.time}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          
        </section>

        <section className="bg-white border rounded-xl sm:rounded-2xl shadow-sm mb-4 sm:mb-6">
          <div className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold">Pilih Jenis Paket *</h2>
            <h3 className="text-sm font-semibold mb-4 text-gray-700">Note: Hari minggu dan tanggal merah libur</h3>

            <RadioGroup
              value={jenisPaket}
              onValueChange={setJenisPaket}
              className="space-y-3 sm:space-y-0 sm:flex sm:gap-6 lg:gap-8"
            >
              {[
                { value: "HARIAN", label: "Harian (1x/hari)" },
                { value: "MINGGUAN", label: "Mingguan (6x/minggu)" },
                { value: "BULANAN", label: "Bulanan (25x/bulan)" },
              ].map((item) => (
                <div key={item.value} className="flex items-center space-x-3">
                  <RadioGroupItem value={item.value} id={item.value} className="mt-0.5" />
                  <Label htmlFor={item.value} className="cursor-pointer font-medium text-gray-800">
                    {item.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </section>

        {/* Catatan Tambahan - Mobile optimized */}
        <section className="bg-white border rounded-xl sm:rounded-2xl shadow-sm mb-4 sm:mb-6">
          <div className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Catatan Tambahan (Opsional)</h2>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Contoh: Alergi, Catatan Khusus, dll."
              rows={3}
              maxLength={500}
              className="resize-none"
            />
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              {note.length}/500 karakter
            </p>
          </div>
        </section>

        {/* Keranjang - Mobile optimized */}
        {items.length === 0 ? (
          <div className="bg-white rounded-xl sm:rounded-2xl border shadow-sm">
            <div className="text-center py-12 px-4">
              <div className="text-4xl mb-4">🛒</div>
              <p className="text-gray-500 text-base sm:text-lg mb-6">Keranjang Anda kosong.</p>
              <Button 
                onClick={() => router.push("/")}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 h-11"
              >
                Mulai Belanja
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Cart Items - Mobile optimized */}
            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border rounded-xl sm:rounded-2xl shadow-sm overflow-hidden"
                >
                  <div className="p-4">
                    {/* Mobile: Stack layout, Desktop: Flex layout */}
                    <div className="flex gap-3 sm:gap-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg overflow-hidden">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                              No Image
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm sm:text-base line-clamp-2">{item.name}</h3>
                        <p className="text-gray-500 text-xs sm:text-sm mt-1">
                          Rp {item.price.toLocaleString("id-ID")}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600 font-medium mt-1">
                          Subtotal: Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>

                    {/* Quantity Controls and Remove Button */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => decreaseQty(item.id)}
                          className="h-8 w-8 p-0 text-base font-bold"
                          disabled={isLoading}
                        >
                          −
                        </Button>
                        <span className="text-base font-medium min-w-[2rem] text-center">{item.quantity}</span>
                        <Button
                          size="sm"
                          onClick={() => increaseQty(item.id)}
                          className="h-8 w-8 p-0 text-base font-bold bg-orange-500 hover:bg-orange-600"
                          disabled={isLoading}
                        >
                          +
                        </Button>
                      </div>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeItem(item.id)}
                        className="h-8 px-3 text-sm"
                        disabled={isLoading}
                      >
                        🗑️
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Summary - Mobile optimized */}
            <div className="bg-orange-50 border border-orange-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6">
              <div className="text-center sm:text-right space-y-2">
                <p className="text-sm sm:text-base text-gray-700">
                  Total Items: <span className="font-semibold">{items.reduce((acc, item) => acc + item.quantity, 0)}</span>
                </p>
                <p className="text-xl sm:text-2xl font-bold text-orange-600">
                  Total Bayar: Rp {total.toLocaleString("id-ID")}
                </p>
              </div>
            </div>

            {/* Checkout Button - Mobile optimized with fixed position */}
            <div className="sm:text-right">
              <Button
                onClick={handleCheckout}
                disabled={isLoading || !snapLoaded}
                className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white px-6 sm:px-8 py-3 rounded-xl font-semibold transition shadow-md disabled:opacity-50 h-12 text-base"
              >
                {isLoading ? "Memproses..." : "Checkout & Bayar"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}