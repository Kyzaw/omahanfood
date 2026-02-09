import { prisma } from "@/lib/prisma";
import MenuPage from "@/components/MenuPage";
import { Star } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 md:pt-25">
      <main className="container mx-auto px-4 py-8">
        {/* Hero section */}
        <section className="relative bg-white rounded-3xl overflow-hidden mb-16 h-[280px] md:h-[350px] shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent z-10" />
          <div
            className="absolute inset-0 bg-cover bg-center transform hover:scale-105 transition-transform duration-700"
            style={{ backgroundImage: 'url(/banner.png)' }}
          />
          <div className="relative z-20 h-full flex items-center">
            <div className="p-8 md:p-12 max-w-2xl">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                Order your{' '}
                <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                  favorite food
                </span>{' '}
                here
              </h1>
              <p className="text-lg md:text-xl text-gray-200 mb-6 leading-relaxed">
                Discover the best food and drinks near you with our curated selection
              </p>
              <button className="group bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-lg hover:from-orange-600 hover:to-red-600 transform hover:scale-105 active:scale-95 flex items-center gap-3">
                <span>Explore Menu</span>
                <svg 
                  className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full blur-xl" />
          <div className="absolute bottom-4 right-8 w-32 h-32 bg-gradient-to-br from-yellow-400/10 to-orange-400/10 rounded-full blur-2xl" />
        </section>

        {/* Stats section */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center border border-gray-100">
            <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">{filteredCategories.length}</span>
            </div>
            <h3 className="font-semibold text-gray-800">Categories</h3>
            <p className="text-sm text-gray-500">Available</p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center border border-gray-100">
            <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">{allMenus.length}</span>
            </div>
            <h3 className="font-semibold text-gray-800">Menu Items</h3>
            <p className="text-sm text-gray-500">Ready to order</p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center border border-gray-100">
            <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h1l3 8 4-16 4 16 3-8h1" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800">Fast Delivery</h3>
            <p className="text-sm text-gray-500">30 min avg</p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center border border-gray-100">
            <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Star className="text-white w-6 h-6" />
            </div>
            <h3 className="font-semibold text-gray-800">Top Rated</h3>
            <p className="text-sm text-gray-500">4.8+ rating</p>
          </div>
        </section>

        {/* Menu Page Component */}
        <MenuPage categories={filteredCategories} menuItems={allMenus}/>
      </main>
    </div>
  );
}