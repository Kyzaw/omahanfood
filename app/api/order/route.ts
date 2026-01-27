// Last updated: 2026-01-07T16:50:00
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      userId,
      deliveryTime,
      items,
      totalAmount,
      address,
      paymentMethod,
      notes,
      jenisPaket,
    } = body;

    if (!userId || !deliveryTime || !items || !totalAmount || !address || !paymentMethod || !jenisPaket) {
      return NextResponse.json({ error: "Data kurang lengkap" }, { status: 400 });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Keranjang tidak boleh kosong" }, { status: 400 });
    }

    let totalDeliveries = 1;
    if (jenisPaket === "MINGGUAN") totalDeliveries = 6;
    else if (jenisPaket === "BULANAN") totalDeliveries = 25;

    const order = await prisma.order.create({
      data: {
        userId,
        deliveryTime,
        items,
        totalAmount,
        address,
        paymentMethod,
        notes,
        status: "PENDING",
        jenisPaket,
        totalDeliveries,
        deliveredCount: 0,
        nextDeliveryDate: (() => {
          const date = new Date();
          date.setDate(date.getDate() + 1);
          if (date.getDay() === 0) date.setDate(date.getDate() + 1); // Skip Sunday
          return date;
        })(),
      },
    });


    return NextResponse.json({
      orderId: order.id,
      totalAmount: order.totalAmount,
    });
  } catch (error) {
    console.error("Order Error Detailed:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({
      error: "Terjadi kesalahan server",
      details: errorMessage,
      stack: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

