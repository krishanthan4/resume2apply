import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret_key_change_this_in_production";
const COOKIE_NAME = "resume_auth_token";

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get(COOKIE_NAME)?.value;

    // 1. Define routes that require authentication
    const isProtectedRoute = pathname.startsWith("/dashboard") ||
        pathname.startsWith("/settings") ||
        pathname.startsWith("/profile-data") ||
        pathname.startsWith("/resumes");

    // 2. Define routes that are for unauthenticated users (login/register)
    const isAuthRoute = pathname.startsWith("/auth/login") ||
        pathname.startsWith("/auth/register");


    // 3. Verify token if it exists
    let isValid = false;
    if (token) {
        try {
            const key = new TextEncoder().encode(JWT_SECRET);
            await jwtVerify(token, key, { algorithms: ["HS256"] });
            isValid = true;
        } catch (error) {
            isValid = false;
        }
    }

    // 4. Redirect Logic
    // If trying to access a protected route without a valid token, redirect to login
    if (isProtectedRoute && !isValid) {
        const loginUrl = new URL("/auth/login", request.url);
        // Remember where we were trying to go
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // If already logged in and trying to access login/register, redirect to dashboard
    if (isAuthRoute && isValid) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
