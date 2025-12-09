import MenuForm from "@/components/admin/MenuForm"
import prisma from "@/lib/prisma"

export const dynamic = 'force-dynamic';

export default async function MenuPage() {
  const categories = await prisma.category.findMany({
    select: { id: true, name: true }
  })

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <MenuForm categories={categories} />
    </div>
  )
}
