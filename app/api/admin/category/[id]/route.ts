import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { name } = await request.json();
    const category = await prisma.category.update({
      where: { id: params.id },
      data: { name },
    });
    return Response.json(category);
  } catch (error) {
    return Response.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.category.delete({
      where: { id: params.id },
    });
    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
