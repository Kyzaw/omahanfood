import { prisma } from "@/lib/prisma";
import { type NextRequest } from "next/server";

export async function PATCH(
  request: NextRequest,
  context: { params: { id: string } }
): Promise<Response> {
  const { name } = await request.json();
  const category = await prisma.category.update({
    where: { id: context.params.id },
    data: { name },
  });
  return new Response(JSON.stringify(category), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
): Promise<Response> {
  await prisma.category.delete({
    where: { id: context.params.id },
  });
  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
}
