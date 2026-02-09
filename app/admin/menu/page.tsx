import { prisma } from "@/lib/prisma";
import MenuTable from "@/components/admin/MenuTable";
import AdminSidebar from "@/components/admin/AdminNavbar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FolderKanban, Menu, Plus, BarChart3 } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function MenuPage() {
  // Fetch menus with their category relationship
  const menus = await prisma.menu.findMany({
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Calculate stats
  const totalMenus = menus.length;
  const categoriesUsed = new Set(menus.map(menu => menu.category?.id)).size;
  const avgPrice = menus.length > 0
    ? Math.round(menus.reduce((sum, menu) => sum + (menu.price || 0), 0) / menus.length)
    : 0;

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
                Menu Dashboard
              </h1>
              <p className="text-sm text-slate-600 mt-1 md:mt-2">
                Manage your menu items and their categories
              </p>
            </div>
            <div className="flex items-center justify-end">
              <div className="text-right bg-slate-50 px-3 md:px-4 py-2 rounded-lg border border-slate-200">
                <p className="text-xs md:text-sm font-semibold text-slate-800">
                  {totalMenus} Menu Items
                </p>
                <p className="text-xs text-slate-500">
                  {categoriesUsed} Categories Used
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 md:p-8 space-y-6 md:space-y-8">
          <div className="max-w-full">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <Menu className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs md:text-sm font-medium text-slate-600">Total Menus</p>
                    <p className="text-xl md:text-2xl font-bold text-slate-800">{totalMenus}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <FolderKanban className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs md:text-sm font-medium text-slate-600">Categories</p>
                    <p className="text-xl md:text-2xl font-bold text-slate-800">{categoriesUsed}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <BarChart3 className="text-white w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs md:text-sm font-medium text-slate-600">Status</p>
                    <p className="text-sm md:text-base font-bold text-slate-800">
                      {totalMenus > 0 ? 'Active' : 'Empty'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Add Menu Button - Mobile */}
            <div className="md:hidden mb-4">
              <Link href="/admin/menu/add" className="block">
                <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Menu Item
                </Button>
              </Link>
            </div>

            {/* Menu Table Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
              <div className="px-4 md:px-6 py-4 md:py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-8 md:w-10 h-8 md:h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <Menu className="w-4 md:w-5 h-4 md:h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg md:text-xl font-bold text-slate-800">
                        Menu Management
                      </h2>
                      <p className="text-xs md:text-sm text-slate-600">
                        View and manage all menu items
                      </p>
                    </div>
                  </div>

                  {/* Desktop Add Button */}
                  <div className="hidden md:flex items-center gap-4">
                    <span className="text-xs md:text-sm text-slate-500 bg-slate-100 px-2 md:px-3 py-1 rounded-full">
                      {totalMenus} total
                    </span>
                    <Link href="/admin/menu/add">
                      <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Menu
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="p-0">
                {menus.length > 0 ? (
                  <div className="overflow-x-auto">
                    <MenuTable menus={menus} />
                  </div>
                ) : (
                  /* Empty State */
                  <div className="text-center py-16 md:py-20 px-4">
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Menu className="w-10 h-10 md:w-12 md:h-12 text-slate-400" />
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold text-slate-800 mb-3">
                      No menu items found
                    </h3>
                    <p className="text-slate-600 mb-8 max-w-md mx-auto text-sm md:text-base">
                      Get started by adding your first menu item to showcase your delicious offerings
                    </p>
                    <Link href="/admin/menu/add">
                      <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg px-6 md:px-8 py-2 md:py-3">
                        <FolderKanban className="w-4 h-4 mr-2" />
                        Add Your First Menu
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}