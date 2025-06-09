import { prisma } from "@/lib/prisma";
import { type NextRequest } from "next/server";

type Props = {
  params: { id: string };
};

export async function PATCH(
  req: Request,
  props: Props
) {
  try {
    const { name } = await req.json();
    const category = await prisma.category.update({
      where: { id: props.params.id },
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
  req: Request,
  props: Props
) {
  try {
    await prisma.category.delete({
      where: { id: props.params.id },
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
