import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id,
        status: "SELESAI",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // For each order, we need to fetch reviews separately since the relation is not yet in the generated client
    const ordersWithReviews = await Promise.all(
      orders.map(async (order) => {
        // This will work after migration
        const reviews = await prisma.review.findMany({
          where: {
            userId: session.user.id,
            // orderId will be available after migration
          },
          select: {
            menuId: true,
          },
        });

        return {
          ...order,
          reviews,
        };
      })
    );

    return NextResponse.json({ orders: ordersWithReviews });
  } catch (error) {
    console.error("Error fetching order history:", error);
    return NextResponse.json(
      { error: "Failed to fetch order history" },
      { status: 500 }
    );
  }
}
