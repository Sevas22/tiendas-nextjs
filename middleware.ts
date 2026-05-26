import { NextResponse, type NextRequest } from "next/server"
import {
  ADMIN_SESSION_COOKIE,
  isValidAdminSession,
} from "@/lib/auth/super-admin"

const ADMIN_PUBLIC_PATHS = ["/admin/login"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next()
  }

  const isPublic = ADMIN_PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  )
  if (isPublic) {
    return NextResponse.next()
  }

  const session = request.cookies.get(ADMIN_SESSION_COOKIE)?.value
  if (!isValidAdminSession(session)) {
    const loginUrl = new URL("/admin/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin", "/admin/((?!login).*)"],
}
