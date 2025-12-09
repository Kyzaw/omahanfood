import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, TrendingUp, MessageSquare, AlertCircle } from "lucide-react";
import { ReviewsTable } from "@/components/admin/ReviewsTable";
import AdminNavbar from "@/components/admin/AdminNavbar";

export const dynamic = 'force-dynamic';


export default async function AdminReviewsPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  // Fetch all reviews with related data
  const reviews = await prisma.review.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      menu: {
        select: {
          name: true,
          image: true,
        },
      },
      order: {
        select: {
          id: true,
          createdAt: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Calculate statistics
  const totalReviews = reviews.length;
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  // Rating distribution
  const ratingDistribution = {
    5: reviews.filter((r) => r.rating === 5).length,
    4: reviews.filter((r) => r.rating === 4).length,
    3: reviews.filter((r) => r.rating === 3).length,
    2: reviews.filter((r) => r.rating === 2).length,
    1: reviews.filter((r) => r.rating === 1).length,
  };

  // Reviews with comments
  const reviewsWithComments = reviews.filter((r) => r.comment).length;

  // Low rating reviews (1-2 stars)
  const lowRatingReviews = reviews.filter((r) => r.rating <= 2).length;

  // Recent reviews (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentReviews = reviews.filter(
    (r) => new Date(r.createdAt) >= sevenDaysAgo
  ).length;

  return (
    <>
      <AdminNavbar />
      <div className="md:ml-64 min-h-screen bg-gray-50">
        <div className="container mx-auto p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Review Management</h1>
              <p className="text-gray-600 mt-1">
                Monitor dan kelola semua review dari customer
              </p>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Reviews */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalReviews}</div>
                <p className="text-xs text-muted-foreground">
                  {reviewsWithComments} dengan komentar
                </p>
              </CardContent>
            </Card>

            {/* Average Rating */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rating Rata-rata</CardTitle>
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{averageRating.toFixed(2)}</div>
                <div className="flex items-center gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-3 w-3 ${star <= Math.round(averageRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                        }`}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Reviews */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Review Baru</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{recentReviews}</div>
                <p className="text-xs text-muted-foreground">7 hari terakhir</p>
              </CardContent>
            </Card>

            {/* Low Ratings */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rating Rendah</CardTitle>
                <AlertCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {lowRatingReviews}
                </div>
                <p className="text-xs text-muted-foreground">Rating 1-2 bintang</p>
              </CardContent>
            </Card>
          </div>

          {/* Rating Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Distribusi Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = ratingDistribution[rating as keyof typeof ratingDistribution];
                  const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

                  return (
                    <div key={rating} className="flex items-center gap-4">
                      <div className="flex items-center gap-1 w-20">
                        <span className="text-sm font-medium">{rating}</span>
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      </div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-orange-500 to-red-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                      <div className="w-20 text-right">
                        <span className="text-sm font-medium">{count}</span>
                        <span className="text-xs text-gray-500 ml-1">
                          ({percentage.toFixed(0)}%)
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Reviews Table */}
          <Card>
            <CardHeader>
              <CardTitle>Semua Review</CardTitle>
            </CardHeader>
            <CardContent>
              <ReviewsTable reviews={reviews} />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
