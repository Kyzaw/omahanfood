"use client"

import React, { useState, useEffect } from "react";
import { LayoutGrid, Plus, Minus, ShoppingCart, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  image?: string;
}

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  categoryName: string;
  image?: string;
}

function CategoryList({
  categories,
  selectedCategory,
  onSelectCategory,
}: {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryName: string | null) => void;
}) {
  if (!categories.length) return null;

  return (
    <section className="mb-10">
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-stone-800 tracking-tight">
          Jelajahi Menu
        </h2>
        <p className="text-stone-500 mt-1">
          Pilih kategori atau lihat semua menu kami
        </p>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {/* All Items Button */}
        <button
          onClick={() => onSelectCategory(null)}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap border transition-all duration-200 ${
            selectedCategory === null
              ? "bg-orange-500 text-white border-orange-500 shadow-sm shadow-orange-200"
              : "bg-white text-stone-600 border-stone-200 hover:border-stone-300 hover:bg-stone-50"
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          Semua
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.name)}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap border transition-all duration-200 ${
              selectedCategory === cat.name
                ? "bg-orange-500 text-white border-orange-500 shadow-sm shadow-orange-200"
                : "bg-white text-stone-600 border-stone-200 hover:border-stone-300 hover:bg-stone-50"
            }`}
          >
            {cat.image && (
              <div className="w-5 h-5 rounded-md overflow-hidden">
                <Image src={cat.image} alt={cat.name} width={20} height={20} className="w-full h-full object-cover" />
              </div>
            )}
            {cat.name}
          </button>
        ))}
      </div>
    </section>
  );
}

function MenuList({ menuItems }: { menuItems: MenuItem[] }) {
  const [quantities, setQuantities] = useState<{ [id: string]: number }>({});

  useEffect(() => {
    const stored = localStorage.getItem("checkoutItems");
    if (stored) {
      const parsed: (MenuItem & { quantity: number })[] = JSON.parse(stored);
      const qtyMap: { [id: string]: number } = {};
      parsed.forEach((item) => {
        qtyMap[item.id] = item.quantity;
      });
      setQuantities(qtyMap);
    }
  }, []);

  const updateLocalStorage = (items: (MenuItem & { quantity: number })[]) => {
    localStorage.setItem("checkoutItems", JSON.stringify(items));
    window.dispatchEvent(new Event("checkoutUpdated"));
  };

  const handleAdd = (item: MenuItem) => {
    const stored = localStorage.getItem("checkoutItems");
    const checkoutItems: (MenuItem & { quantity: number })[] = stored ? JSON.parse(stored) : [];
    const existingIndex = checkoutItems.findIndex((x) => x.id === item.id);
    if (existingIndex !== -1) {
      checkoutItems[existingIndex].quantity += 1;
    } else {
      checkoutItems.push({ ...item, quantity: 1 });
    }
    updateLocalStorage(checkoutItems);
    setQuantities((prev) => ({ ...prev, [item.id]: (prev[item.id] || 0) + 1 }));
    toast.success(`${item.name} ditambahkan ke keranjang`);
  };

  const handleIncrease = (item: MenuItem) => {
    const stored = localStorage.getItem("checkoutItems");
    const checkoutItems: (MenuItem & { quantity: number })[] = stored ? JSON.parse(stored) : [];
    const index = checkoutItems.findIndex((x) => x.id === item.id);
    if (index !== -1) checkoutItems[index].quantity += 1;
    updateLocalStorage(checkoutItems);
    setQuantities((prev) => ({ ...prev, [item.id]: (prev[item.id] || 0) + 1 }));
  };

  const handleDecrease = (item: MenuItem) => {
    const stored = localStorage.getItem("checkoutItems");
    const checkoutItems: (MenuItem & { quantity: number })[] = stored ? JSON.parse(stored) : [];
    const index = checkoutItems.findIndex((x) => x.id === item.id);
    if (index !== -1) {
      checkoutItems[index].quantity -= 1;
      if (checkoutItems[index].quantity <= 0) checkoutItems.splice(index, 1);
    }
    updateLocalStorage(checkoutItems);
    setQuantities((prev) => {
      const newQty = { ...prev };
      if ((newQty[item.id] || 0) <= 1) delete newQty[item.id];
      else newQty[item.id] -= 1;
      return newQty;
    });
  };

  if (!menuItems.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mb-4">
          <ShoppingCart className="w-8 h-8 text-stone-300" />
        </div>
        <h3 className="text-lg font-semibold text-stone-600 mb-1">Tidak ada menu ditemukan</h3>
        <p className="text-sm text-stone-400">Coba pilih kategori lain</p>
      </div>
    );
  }

  return (
    <section className="pb-24 md:pb-8">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-stone-500">{menuItems.length} menu ditemukan</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {menuItems.map((item) => {
          const qty = quantities[item.id] || 0;
          return (
            <div
              key={item.id}
              className="group bg-white rounded-xl border border-stone-100 hover:border-stone-200 overflow-hidden transition-all duration-300 hover:shadow-md"
            >
              {/* Image */}
              <div className="relative h-44 bg-stone-50 overflow-hidden">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-50 to-stone-100">
                    <span className="text-4xl font-bold text-stone-200">
                      {item.name.charAt(0)}
                    </span>
                  </div>
                )}

                {/* Badge & Actions Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Category Badge */}
                <span className="absolute top-3 left-3 text-[11px] font-medium bg-white/90 backdrop-blur-sm text-stone-600 px-2.5 py-1 rounded-lg">
                  {item.categoryName}
                </span>

                {/* View Detail */}
                <Link
                  href={`/menu/${item.id}`}
                  className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white"
                >
                  <Eye className="w-4 h-4 text-stone-600" />
                </Link>

                {/* Quantity Badge */}
                {qty > 0 && (
                  <span className="absolute bottom-3 right-3 bg-orange-500 text-white text-xs font-bold w-7 h-7 rounded-lg flex items-center justify-center shadow-sm">
                    {qty}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-stone-800 mb-1 line-clamp-1 group-hover:text-orange-600 transition-colors">
                  {item.name}
                </h3>
                <p className="text-xs text-stone-400 mb-3 line-clamp-2 leading-relaxed">
                  {item.description || "Hidangan lezat dari bahan pilihan"}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-orange-600">
                    Rp {item.price.toLocaleString("id-ID")}
                  </span>

                  {qty > 0 ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDecrease(item)}
                        className="w-8 h-8 rounded-lg border border-stone-200 flex items-center justify-center hover:bg-stone-50 transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5 text-stone-500" />
                      </button>
                      <span className="text-sm font-bold text-stone-800 w-5 text-center">{qty}</span>
                      <button
                        onClick={() => handleIncrease(item)}
                        className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center hover:bg-orange-600 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5 text-white" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAdd(item)}
                      className="flex items-center gap-1.5 bg-orange-50 hover:bg-orange-100 text-orange-600 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors border border-orange-100 hover:border-orange-200"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Tambah</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default function MenuPage({
  categories,
  menuItems,
}: {
  categories: Category[];
  menuItems: MenuItem[];
}) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredMenu = selectedCategory
    ? menuItems.filter((item) => item.categoryName === selectedCategory)
    : menuItems;

  return (
    <div>
      <CategoryList
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <MenuList menuItems={filteredMenu} />
    </div>
  );
}
