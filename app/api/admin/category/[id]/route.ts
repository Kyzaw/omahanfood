import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { name } = await request.json();
    const category = await prisma.category.update({
      where: { id: params.id },
      data: { name },
    });
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.category.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
