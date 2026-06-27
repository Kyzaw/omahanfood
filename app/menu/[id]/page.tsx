import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star } from "lucide-react";
import { ReviewList } from "@/components/admin/ReviewList";

interface MenuDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function MenuDetailPage({ params }: MenuDetailPageProps) {
  const { id } = await params;
  
  const menu = await prisma.menu.findUnique({
    where: {
      id,
    },
    include: {
      category: true,
    },
  });

  if (!menu) {
    notFound();
  }

  // Fetch reviews to calculate average rating
  const reviews = await prisma.review.findMany({
    where: {
      menuId: id,
    },
  });

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <div className="hidden md:block h-16" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 md:py-10 pb-24 md:pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8">
          {/* Menu Image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-stone-100 border border-stone-100 shadow-sm">
            {menu.image ? (
              <Image
                src={menu.image}
                alt={menu.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-stone-100 flex items-center justify-center">
                <span className="text-4xl font-bold text-stone-300">
                  {menu.name.charAt(0)}
                </span>
              </div>
            )}
          </div>

          {/* Menu Info */}
          <div className="space-y-5">
            <div>
              <Badge className="mb-3 bg-orange-50 text-orange-600 border border-orange-100 text-xs font-semibold">{menu.category.name}</Badge>
              <h1 className="text-2xl sm:text-3xl font-bold text-stone-800 tracking-tight mb-2">
                {menu.name}
              </h1>
              
              {/* Rating Display */}
              {reviews.length > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-bold text-amber-700">
                      {averageRating.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-stone-500 text-sm">
                    ({reviews.length} {reviews.length === 1 ? "ulasan" : "ulasan"})
                  </span>
                </div>
              )}

              <p className="text-stone-600 leading-relaxed text-sm">
                {menu.description}
              </p>
            </div>

            <Separator className="bg-stone-100" />

            <div>
              <p className="text-2xl font-bold text-orange-500">
                Rp {menu.price.toLocaleString()}
              </p>
              <p className="text-xs text-stone-400 mt-1">Harga per porsi</p>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <Card className="bg-white border border-stone-100 shadow-sm rounded-2xl">
          <CardContent className="pt-6">
            <h2 className="text-xl font-bold text-stone-800 mb-6">Rating & Ulasan</h2>
            <ReviewList menuId={id} />
          </CardContent>
        </Card>
      </div>
      <div className="md:hidden h-20" />
    </div>
  );
}
