import { NextResponse } from "next/server";

export function middleware(req) {

    const token = req.cookies.get("token")?.value;
    const { pathname } = req.nextUrl;

    const protectedRoutes = [
        "/profile", 
        "/complaints", 
    ]

    const isProtectedRoute = protectedRoutes.some((path) => pathname.startsWith(path))

    if (isProtectedRoute && !token) {
        return NextResponse.redirect(new URL("/login", req.url))
    }

    return NextResponse.next()
}

export const config = {
  matcher: ["/profile/:path*", "/complaints/:path*"],
};
