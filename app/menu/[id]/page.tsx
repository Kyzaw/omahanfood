import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star } from "lucide-react";
import { ReviewList } from "@/components/ReviewList";

interface MenuDetailPageProps {
  params: {
    id: string;
  };
}

export default async function MenuDetailPage({ params }: MenuDetailPageProps) {
  const menu = await prisma.menu.findUnique({
    where: {
      id: params.id,
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
      menuId: params.id,
    },
  });

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  return (
    <div className="container mx-auto p-4 max-w-6xl mb-23 md:pt-35">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Menu Image */}
        <div className="relative aspect-square rounded-lg overflow-hidden">
          {menu.image ? (
            <Image
              src={menu.image}
              alt={menu.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
              <span className="text-4xl font-bold text-gray-400">
                {menu.name.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Menu Info */}
        <div className="space-y-6">
          <div>
            <Badge className="mb-2">{menu.category.name}</Badge>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {menu.name}
            </h1>
            
            {/* Rating Display */}
            {reviews.length > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-lg font-semibold">
                    {averageRating.toFixed(1)}
                  </span>
                </div>
                <span className="text-gray-600">
                  ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
                </span>
              </div>
            )}

            <p className="text-gray-600 text-lg leading-relaxed">
              {menu.description}
            </p>
          </div>

          <Separator />

          <div>
            <p className="text-3xl font-bold text-primary">
              Rp {menu.price.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mt-1">Harga per porsi</p>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-2xl font-bold mb-6">Rating & Review</h2>
          <ReviewList menuId={params.id} />
        </CardContent>
      </Card>
    </div>
  );
}
