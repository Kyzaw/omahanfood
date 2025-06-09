import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

type RouteParams = {
  params: {
    id: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function PATCH(
  request: NextRequest,
  { params, searchParams }: RouteParams
) {
  const { name } = await request.json();
  const category = await prisma.category.update({
    where: { id: params.id },
    data: { name },
  });
  return Response.json(category);
}

export async function DELETE(
  request: NextRequest,
  { params, searchParams }: RouteParams
) {
  await prisma.category.delete({
    where: { id: params.id },
  });
  return Response.json({ success: true });
}
