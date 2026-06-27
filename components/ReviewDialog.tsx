"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  menuId: string;
  menuName: string;
}

export function ReviewDialog({
  open,
  onOpenChange,
  orderId,
  menuId,
  menuName,
}: ReviewDialogProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Silakan pilih rating terlebih dahulu");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        orderId,
        menuId,
        rating,
        comment: comment.trim() || undefined,
      };
      
      console.log("Submitting review with payload:", payload);
      
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit review");
      }

      toast.success("Review berhasil dikirim!");
      onOpenChange(false);
      setRating(0);
      setComment("");
      router.refresh();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(
        error instanceof Error ? error.message : "Gagal mengirim review"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[460px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-stone-800">Beri Rating & Review</DialogTitle>
          <DialogDescription className="text-stone-500 text-sm">
            Bagaimana pengalaman Anda dengan <strong className="text-stone-700">{menuName}</strong>?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Star Rating */}
          <div className="flex flex-col items-center space-y-2">
            <p className="text-xs font-semibold text-stone-600">Rating</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoverRating || rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-stone-200"
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-xs text-stone-500">
                {rating === 1 && "Sangat Buruk"}
                {rating === 2 && "Buruk"}
                {rating === 3 && "Cukup"}
                {rating === 4 && "Baik"}
                {rating === 5 && "Sangat Baik"}
              </p>
            )}
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <label htmlFor="comment" className="text-xs font-semibold text-stone-600">
              Komentar (Opsional)
            </label>
            <Textarea
              id="comment"
              placeholder="Ceritakan pengalaman Anda dengan menu ini..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              maxLength={500}
              className="border-stone-200 rounded-xl focus:ring-orange-500 focus:border-orange-500"
            />
            <p className="text-xs text-stone-400 text-right">
              {comment.length}/500
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="rounded-xl border-stone-200"
          >
            Batal
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || rating === 0} variant="review" className="rounded-xl">
            {isSubmitting ? "Mengirim..." : "Kirim Review"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
