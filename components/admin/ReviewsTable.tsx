"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, Trash2, Eye, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  user: {
    name: string;
    email: string;
  };
  menu: {
    name: string;
    image: string;
  };
  order: {
    id: string;
    createdAt: Date;
  };
}

interface ReviewsTableProps {
  reviews: Review[];
}

export function ReviewsTable({ reviews: initialReviews }: ReviewsTableProps) {
  const [reviews, setReviews] = useState(initialReviews);
  const [filterRating, setFilterRating] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  // Filter reviews
  const filteredReviews = reviews.filter((review) => {
    const matchesRating =
      filterRating === "all" || review.rating === parseInt(filterRating);
    const matchesSearch =
      searchQuery === "" ||
      review.menu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.comment?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesRating && matchesSearch;
  });

  const handleDeleteClick = (review: Review) => {
    setSelectedReview(review);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedReview) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/reviews/${selectedReview.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete review");
      }

      setReviews(reviews.filter((r) => r.id !== selectedReview.id));
      toast.success("Review berhasil dihapus");
      setDeleteDialogOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Gagal menghapus review");
    } finally {
      setIsDeleting(false);
      setSelectedReview(null);
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-green-600";
    if (rating === 3) return "text-yellow-600";
    return "text-red-600";
  };

  const getRatingBadge = (rating: number) => {
    if (rating >= 4) return "bg-green-100 text-green-800";
    if (rating === 3) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Cari menu, customer, atau komentar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={filterRating} onValueChange={setFilterRating}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter Rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Rating</SelectItem>
            <SelectItem value="5">5 Bintang</SelectItem>
            <SelectItem value="4">4 Bintang</SelectItem>
            <SelectItem value="3">3 Bintang</SelectItem>
            <SelectItem value="2">2 Bintang</SelectItem>
            <SelectItem value="1">1 Bintang</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-600">
        Menampilkan {filteredReviews.length} dari {reviews.length} review
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Menu</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Komentar</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  Tidak ada review ditemukan
                </TableCell>
              </TableRow>
            ) : (
              filteredReviews.map((review) => (
                <TableRow key={review.id}>
                  {/* Menu */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 rounded-md overflow-hidden">
                        {review.menu.image ? (
                          <Image
                            src={review.menu.image}
                            alt={review.menu.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-full w-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-400">
                            {review.menu.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <span className="font-medium">{review.menu.name}</span>
                    </div>
                  </TableCell>

                  {/* Customer */}
                  <TableCell>
                    <div>
                      <p className="font-medium">{review.user.name}</p>
                      <p className="text-xs text-gray-500">{review.user.email}</p>
                    </div>
                  </TableCell>

                  {/* Rating */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge className={getRatingBadge(review.rating)}>
                        {review.rating}
                      </Badge>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-3 w-3 ${
                              star <= review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </TableCell>

                  {/* Comment */}
                  <TableCell className="max-w-xs">
                    {review.comment ? (
                      <p className="text-sm text-gray-700 truncate">
                        {review.comment}
                      </p>
                    ) : (
                      <span className="text-sm text-gray-400 italic">
                        Tidak ada komentar
                      </span>
                    )}
                  </TableCell>

                  {/* Date */}
                  <TableCell>
                    <p className="text-sm">
                      {new Date(review.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(review.createdAt).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(review)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Review?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus review dari{" "}
              <strong>{selectedReview?.user.name}</strong> untuk menu{" "}
              <strong>{selectedReview?.menu.name}</strong>? Tindakan ini tidak
              dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
