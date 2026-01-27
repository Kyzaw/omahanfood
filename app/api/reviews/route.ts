import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validation schema
const reviewSchema = z.object({
  orderId: z.string(),
  menuId: z.string(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});

// POST - Create a new review
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = reviewSchema.parse(body);

    console.log("Review request data:", validatedData);

    // Verify that the order belongs to the user and is completed
    const order = await prisma.order.findFirst({
      where: {
        id: validatedData.orderId,
        userId: session.user.id,
        status: "SELESAI",
      },
      include: {
        reviews: {
          where: {
            menuId: validatedData.menuId,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found or not completed" },
        { status: 404 }
      );
    }

    // Check if review already exists for this menu in this order
    if (order.reviews.length > 0) {
      return NextResponse.json(
        { error: "You have already reviewed this menu for this order" },
        { status: 400 }
      );
    }

    // Verify that the menu exists in the database
    const menu = await prisma.menu.findUnique({
      where: {
        id: validatedData.menuId,
      },
    });

    if (!menu) {
      return NextResponse.json(
        { error: "Menu not found" },
        { status: 404 }
      );
    }

    // Verify that the menu exists in the order items
    const orderItems = Array.isArray(order.items) ? order.items : [];
    const menuInOrder = orderItems.some((item: unknown) => {
      // Check if the menuId matches (items store menuId as 'id' field)
      return (item as { id?: string })?.id === validatedData.menuId;
    });

    if (!menuInOrder) {
      return NextResponse.json(
        { error: "This menu was not part of your order" },
        { status: 400 }
      );
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        rating: validatedData.rating,
        comment: validatedData.comment,
        userId: session.user.id,
        menuId: validatedData.menuId,
        orderId: validatedData.orderId,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        menu: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}

// GET - Get reviews for a specific menu
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const menuId = searchParams.get("menuId");
    const orderId = searchParams.get("orderId");

    if (menuId) {
      // Get all reviews for a specific menu
      const reviews = await prisma.review.findMany({
        where: {
          menuId,
        },
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      // Calculate average rating
      const avgRating = reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
        : 0;

      return NextResponse.json({
        reviews,
        averageRating: avgRating,
        totalReviews: reviews.length,
      });
    }

    if (orderId) {
      // Get all reviews for a specific order
      const reviews = await prisma.review.findMany({
        where: {
          orderId,
        },
        include: {
          menu: {
            select: {
              name: true,
            },
          },
        },
      });

      return NextResponse.json({ reviews });
    }

    return NextResponse.json(
      { error: "menuId or orderId parameter is required" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
