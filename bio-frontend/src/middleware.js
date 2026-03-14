import { NextResponse } from "next/server";

export function middleware(req) {

    const token = req.cookies.get("token")?.value;
    const { pathname } = req.nextUrl;

    const protectedRoutes = [
        "/profile", 
        "/complaints",
        "/admin" 
    ]

    const isProtectedRoute = protectedRoutes.some((path) => pathname.startsWith(path))

    if (isProtectedRoute && !token) {
        return NextResponse.redirect(new URL("/login", req.url))
    }

    if (pathname.startsWith("/admin")) {
        try {
            const payload = JSON.parse(
                Buffer.from(token.split(".")[1], "base64").toString()
            )

            if (payload.role !== "ADMIN") {
                return NextResponse.redirect(new URL("/forbidden", req.url))
            }

        } catch (error) {
            return NextResponse.redirect(new URL("/login", req.url))
        }
    }

    return NextResponse.next()
}

export const config = {
  matcher: ["/profile/:path*", "/complaints/:path*", "/admin/:path"],
};
