import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { name, description, price, categoryId } = await req.json();

  const menu = await prisma.menu.update({
    where: { id },
    data: { name, description, price, categoryId },
  });

  return NextResponse.json(menu);
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await prisma.menu.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
