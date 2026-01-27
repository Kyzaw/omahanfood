import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { orderId, paymentMethod } = await req.json();

    if (!orderId || !paymentMethod) {
      return NextResponse.json(
        { error: "Missing orderId or paymentMethod" },
        { status: 400 }
      );
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentMethod,
        status: "DIBAYAR",
        paidAt: new Date(),
      },
    });

    return NextResponse.json({ 
      success: true, 
      order: updatedOrder 
    });
  } catch (error) {
    console.error("Update payment method failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}