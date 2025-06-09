import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { name, description, price, categoryId } = await req.json();
  const menu = await prisma.menu.update({
    where: { id: params.id },
    data: { name, description, price, categoryId },
  });
  return NextResponse.json(menu);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await prisma.menu.delete({
    where: { id: params.id },
  });
  return NextResponse.json({ success: true });
}
