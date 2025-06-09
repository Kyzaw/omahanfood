import { auth } from "@/lib/auth-edge"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const session = await auth()
  const { pathname } = req.nextUrl
  const isLoggedIn = !!session?.user

  const protectedRoutes = ["/admin", "/kurir"]

  if (!isLoggedIn && protectedRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  if (isLoggedIn && pathname === "/login") {
    return NextResponse.redirect(new URL("/", req.url))
  }

   if (isLoggedIn && pathname === "/register") {
    return NextResponse.redirect(new URL("/", req.url))
  }

  return NextResponse.next()
}
