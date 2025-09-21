import { prisma } from "@/lib/prisma";
import CategoryTable from "@/components/CategoryTable";
import AdminSidebar from "@/components/AdminNavbar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function CategoryPage() {
  const categories = await prisma.category.findMany({
    include: { menus: true },
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />

      {/* Main content with responsive spacing */}
      <main className="md:ml-64 min-h-screen transition-all duration-300 ease-in-out">
        {/* Header Section */}
        <div className="bg-white border-b border-slate-200 px-4 md:px-6 py-4 md:py-6 shadow-sm mt-16 md:mt-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Category Dashboard
              </h1>
              <p className="text-sm text-slate-600 mt-1 md:mt-2">
                Manage your menu categories and their associated items
              </p>
            </div>
            <div className="flex items-center justify-end">
              <div className="text-right bg-slate-50 px-3 md:px-4 py-2 rounded-lg border border-slate-200">
                <p className="text-xs md:text-sm font-semibold text-slate-800">
                  {categories.length} Categories
                </p>
                <p className="text-xs text-slate-500">
                  Total Items: {categories.reduce((sum, cat) => sum + cat.menus.length, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 md:p-8 space-y-6 md:space-y-8">
          <div className="max-w-full">
            {/* Category Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <span className="text-white text-lg">📂</span>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm font-medium text-slate-600">Total Categories</p>
                    <p className="text-xl md:text-2xl font-bold text-slate-800">{categories.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <span className="text-white text-lg">🍽️</span>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm font-medium text-slate-600">Total Menu Items</p>
                    <p className="text-xl md:text-2xl font-bold text-slate-800">
                      {categories.reduce((sum, cat) => sum + cat.menus.length, 0)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <span className="text-white text-lg">⭐</span>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm font-medium text-slate-600">Most Popular</p>
                    <p className="text-sm md:text-base font-bold text-slate-800 truncate">
                      {categories.length > 0 
                        ? categories.reduce((prev, current) => 
                            prev.menus.length > current.menus.length ? prev : current
                          ).name 
                        : 'No categories'
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <span className="text-white text-lg">📊</span>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm font-medium text-slate-600">Avg Items/Category</p>
                    <p className="text-xl md:text-2xl font-bold text-slate-800">
                      {categories.length > 0 
                        ? Math.round(categories.reduce((sum, cat) => sum + cat.menus.length, 0) / categories.length)
                        : 0
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Table Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-300 p-2 md:p-4">
              <div className="px-2 md:px-6 py-4 md:py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-8 md:w-10 h-8 md:h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <span className="text-white text-sm md:text-lg">📋</span>
                    </div>
                    <div>
                      <h2 className="text-lg md:text-xl font-bold text-slate-800">
                        Categories Management
                      </h2>
                      <p className="text-xs md:text-sm text-slate-600">
                        View and manage all menu categories
                      </p>
                    </div>
                  </div>
                  
                  {/* Search or Filter could go here */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs md:text-sm text-slate-500 bg-slate-100 px-2 md:px-3 py-1 rounded-full">
                      {categories.length} total
                    </span>
                    <Link href="/admin/category/add">
                      <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Category
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="p-0">
                {/* Wrapper for horizontal scroll on mobile */}
                <div className="overflow-x-auto">
                  <CategoryTable categories={categories} />
                </div>
              </div>
            </div>

            {/* Empty State */}
            {categories.length === 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12 text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl md:text-3xl">📂</span>
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-slate-800 mb-2">
                  No Categories Found
                </h3>
                <p className="text-sm md:text-base text-slate-600 mb-6 max-w-md mx-auto">
                  Get started by creating your first category to organize your menu items.
                </p>
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-sm md:text-base">
                  Create First Category
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}