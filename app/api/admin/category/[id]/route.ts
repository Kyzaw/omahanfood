import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { name } = await req.json();
  const category = await prisma.category.update({
    where: { id: params.id },
    data: { name },
  });
  return NextResponse.json(category);
}

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  await prisma.category.delete({
    where: { id: context.params.id },
  });
  return NextResponse.json({ success: true });
}
