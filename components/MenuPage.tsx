"use client"

import React, { useState, useEffect } from "react";
import { LayoutGrid, Plus, Minus, ShoppingCart } from "lucide-react";

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

import { toast } from "sonner";

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
    <section className="my-12">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-3">
          Explore Our Menu
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Discover our carefully curated selection of delicious dishes from various categories
        </p>
      </div>

      <div className="flex gap-4 overflow-x-auto px-4 py-6 scrollbar-hide">
        <div
          onClick={() => onSelectCategory(null)}
          className={`flex flex-col items-center min-w-[90px] cursor-pointer transition-all duration-300 hover:scale-105 ${
            selectedCategory === null 
              ? "transform scale-105" 
              : "hover:transform hover:scale-105"
          }`}
        >
          <div className={`w-24 h-24 rounded-2xl overflow-hidden shadow-lg flex items-center justify-center transition-all duration-300 ${
            selectedCategory === null 
              ? "bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-xl" 
              : "bg-white border-2 border-gray-200 text-gray-600 hover:border-orange-300"
          }`}>
            <LayoutGrid size={28} />
          </div>
          <span className={`text-sm font-semibold mt-3 transition-colors ${
            selectedCategory === null ? "text-orange-600" : "text-gray-700"
          }`}>
            All Items
          </span>
          {selectedCategory === null && (
            <div className="w-8 h-1 bg-orange-500 rounded-full mt-1"></div>
          )}
        </div>
        
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => onSelectCategory(cat.name)}
            className={`flex flex-col items-center min-w-[90px] cursor-pointer transition-all duration-300 hover:scale-105 ${
              selectedCategory === cat.name 
                ? "transform scale-105" 
                : ""
            }`}
          >
            <div className={`w-24 h-24 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 ${
              selectedCategory === cat.name 
                ? "ring-4 ring-orange-400 shadow-xl" 
                : "hover:shadow-xl"
            }`}>
              {cat.image ? (
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className={`w-full h-full flex items-center justify-center text-sm font-medium ${
                  selectedCategory === cat.name
                    ? "bg-gradient-to-br from-orange-500 to-red-500 text-white"
                    : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600"
                }`}>
                  {cat.name.slice(0, 3)}
                </div>
              )}
            </div>
            <span className={`text-sm font-semibold mt-3 text-center transition-colors ${
              selectedCategory === cat.name ? "text-orange-600" : "text-gray-700"
            }`}>
              {cat.name}
            </span>
            {selectedCategory === cat.name && (
              <div className="w-8 h-1 bg-orange-500 rounded-full mt-1"></div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function MenuList({ menuItems }: { menuItems: MenuItem[] }) {
  const [quantities, setQuantities] = useState<{ [id: string]: number }>({});

  useEffect(() => {
    // Initialize quantities from localStorage
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
    let checkoutItems: (MenuItem & { quantity: number })[] = stored ? JSON.parse(stored) : [];

    const existingIndex = checkoutItems.findIndex((x) => x.id === item.id);
    if (existingIndex !== -1) {
      checkoutItems[existingIndex].quantity += 1;
    } else {
      checkoutItems.push({ ...item, quantity: 1 });
    }

    updateLocalStorage(checkoutItems);
    setQuantities((prev) => ({ ...prev, [item.id]: (prev[item.id] || 0) + 1 }));

    toast.success(` ${item.name} added to checkout`);
  };

  const handleIncrease = (item: MenuItem) => {
    const stored = localStorage.getItem("checkoutItems");
    let checkoutItems: (MenuItem & { quantity: number })[] = stored ? JSON.parse(stored) : [];

    const index = checkoutItems.findIndex((x) => x.id === item.id);
    if (index !== -1) {
      checkoutItems[index].quantity += 1;
    }

    updateLocalStorage(checkoutItems);
    setQuantities((prev) => ({ ...prev, [item.id]: (prev[item.id] || 0) + 1 }));
  };

  const handleDecrease = (item: MenuItem) => {
    const stored = localStorage.getItem("checkoutItems");
    let checkoutItems: (MenuItem & { quantity: number })[] = stored ? JSON.parse(stored) : [];

    const index = checkoutItems.findIndex((x) => x.id === item.id);
    if (index !== -1) {
      checkoutItems[index].quantity -= 1;
      if (checkoutItems[index].quantity <= 0) {
        checkoutItems.splice(index, 1);
      }
    }

    updateLocalStorage(checkoutItems);
    setQuantities((prev) => {
      const newQty = { ...prev };
      if ((newQty[item.id] || 0) <= 1) {
        delete newQty[item.id];
      } else {
        newQty[item.id] -= 1;
      }
      return newQty;
    });
  };

  if (!menuItems.length) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <ShoppingCart size={40} className="text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No menu items found</h3>
        <p className="text-gray-500">Try selecting a different category</p>
      </div>
    );
  }

  return (
    <section className="mt-12 pb-24">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {menuItems.map((item) => {
          const qty = quantities[item.id] || 0;
          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:-translate-y-1 border border-gray-100"
            >
              <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {item.name.charAt(0)}
                        </span>
                      </div>
                      <span className="text-gray-400 text-sm">No Image</span>
                    </div>
                  </div>
                )}
                {qty > 0 && (
                  <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {qty}
                  </div>
                )}
              </div>
              
              <div className="p-5">
                <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                  {item.description || "Delicious dish prepared with fresh ingredients"}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    Rp {item.price.toLocaleString("id-ID")}
                  </span>
                </div>
                
                {qty > 0 ? (
                  <div className="flex items-center justify-center gap-4 bg-gray-50 rounded-xl p-3">
                    <button
                      onClick={() => handleDecrease(item)}
                      className="w-10 h-10 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center hover:scale-105 active:scale-95"
                    >
                      <Minus size={16} className="text-gray-600" />
                    </button>
                    <span className="text-xl font-bold text-gray-800 min-w-[2rem] text-center">
                      {qty}
                    </span>
                    <button
                      onClick={() => handleIncrease(item)}
                      className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center hover:scale-105 active:scale-95"
                    >
                      <Plus size={16} className="text-white" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleAdd(item)}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-3 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Plus size={18} />
                    Add to Cart
                  </button>
                )}
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <div className="container mx-auto px-4 py-8">
        <CategoryList
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        <MenuList menuItems={filteredMenu} />
      </div>
    </div>
  );
}