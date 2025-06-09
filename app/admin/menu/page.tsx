import { prisma } from "@/lib/prisma";
import MenuTable from "@/components/MenuTable";
import AdminSidebar from "@/components/AdminNavbar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FolderKanban, Menu, Plus } from "lucide-react";

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

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Menu Dashboard</h1>
          </div>

          {/* Menu Table */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Menu List</h2>
                <Link href="/admin/menu/add">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                    <Plus className="w-4 h-4 mr-2" />
                      Add Menu
                  </Button>
                </Link>
            </div>
            
            {menus.length > 0 ? (
              <MenuTable menus={menus} />
            ) : (
              <div className="text-center py-16">
                <Menu className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-600 mb-2">
                  No menu items found
                </h3>
                <p className="text-slate-500 mb-6">
                  Get started by adding your first menu item
                </p>
                <Link href="/admin/menu/add">
                  <Button className="gap-2">
                    <FolderKanban size={16} />
                    Add Your First Menu
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}