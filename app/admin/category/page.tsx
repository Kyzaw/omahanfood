import { prisma } from "@/lib/prisma";
import CategoryTable from "@/components/CategoryTable";
import AdminSidebar from "@/components/AdminNavbar";


export default async function CategoryPage() {
  const categories = await prisma.category.findMany({
    include: { menus: true },
  });

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Category Dashboard</h1>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <CategoryTable categories={categories} />
          </div>
        </div>
      </main>
    </div>
  );
}
