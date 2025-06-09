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
      },
    });

    return NextResponse.json({
      orderId: order.id,
      totalAmount: order.totalAmount,
    });
  } catch (error) {
    console.error("Order Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
