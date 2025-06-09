import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { name } = await request.json();
    const category = await prisma.category.update({
      where: { id: params.id },
      data: { name },
    });
    return new Response(JSON.stringify(category), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to update category" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.category.delete({
      where: { id: params.id },
    });
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to delete category" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
