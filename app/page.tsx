import { prisma } from "@/lib/prisma";
import MenuPage from "@/components/MenuPage";
import { Star, Utensils, Timer, Award } from "lucide-react";

export default async function HomePage() {
  const categories = await prisma.category.findMany({
    include: {
      menus: true,
    },
  });

  const filteredCategories = categories.filter((cat) => cat.menus.length > 0);

  const allMenus = filteredCategories.flatMap((cat) => cat.menus.map(menu => ({
    ...menu,
    categoryName: cat.name
  })));

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* Spacer for fixed navbar */}
      <div className="hidden md:block h-16" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        {/* Hero Section - Modern & Clean */}
        <section className="relative rounded-2xl overflow-hidden mb-12 md:mb-16">
          {/* Background Image */}
          <div className="relative h-[320px] md:h-[420px]">
            <div className="absolute inset-0 bg-gradient-to-r from-stone-900/80 via-stone-900/50 to-stone-900/20 z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent z-10" />
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: 'url(/banner.png)' }}
            />

            {/* Hero Content */}
            <div className="relative z-20 h-full flex flex-col justify-end p-6 md:p-10 lg:p-14">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-full mb-4">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-white/90 text-xs font-medium tracking-wide">Buka Sekarang</span>
                </div>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-3 leading-[1.1] tracking-tight">
                  Pesan makanan
                  <br />
                  <span className="text-orange-400">favoritmu</span> di sini
                </h1>
                <p className="text-base md:text-lg text-white/70 mb-6 max-w-md leading-relaxed">
                  Temukan hidangan terbaik dari dapur kami, diantar langsung ke rumahmu
                </p>
                <a href="#menu" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300 hover:-translate-y-0.5">
                  Lihat Menu
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Row */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-12 md:mb-16">
          {[
            { icon: Utensils, value: filteredCategories.length, label: 'Kategori', sublabel: 'Tersedia', color: 'orange' },
            { icon: Award, value: allMenus.length, label: 'Menu', sublabel: 'Siap Pesan', color: 'blue' },
            { icon: Timer, value: '30', label: 'Menit', sublabel: 'Rata-rata Kirim', color: 'emerald' },
            { icon: Star, value: '4.8+', label: 'Rating', sublabel: 'Kepuasan', color: 'amber' },
          ].map((stat, i) => {
            const Icon = stat.icon
            const colorMap: Record<string, string> = {
              orange: 'bg-orange-50 text-orange-600 border-orange-100',
              blue: 'bg-blue-50 text-blue-600 border-blue-100',
              emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
              amber: 'bg-amber-50 text-amber-600 border-amber-100',
            }
            return (
              <div key={i} className="bg-white rounded-xl p-4 md:p-5 border border-stone-100 hover:border-stone-200 hover:shadow-sm transition-all duration-300">
                <div className={`w-10 h-10 rounded-lg ${colorMap[stat.color]} border flex items-center justify-center mb-3`}>
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-xl md:text-2xl font-bold text-stone-800">{stat.value}</p>
                <p className="text-sm text-stone-500">
                  {stat.label} <span className="text-stone-400">&middot; {stat.sublabel}</span>
                </p>
              </div>
            )
          })}
        </section>

        {/* Menu Section */}
        <div id="menu">
          <MenuPage categories={filteredCategories} menuItems={allMenus}/>
        </div>
      </main>

      {/* Mobile bottom padding for navbar */}
      <div className="md:hidden h-20" />
    </div>
  );
}