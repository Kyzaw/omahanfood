import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

interface RequestContext {
  params: { id: string };
}

export async function PATCH(
  request: NextRequest,
  context: RequestContext
) {
  const { name } = await request.json();
  const category = await prisma.category.update({
    where: { id: context.params.id },
    data: { name },
  });
  return Response.json(category);
}

export async function DELETE(
  request: NextRequest,
  context: RequestContext
) {
  await prisma.category.delete({
    where: { id: context.params.id },
  });
  return Response.json({ success: true });
}
