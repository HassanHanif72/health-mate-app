import { NextResponse } from "next/server";

export function middleware(request) {
    const token = request.cookies.get('token')?.value;
    console.log("Token:", token);
    const { pathname } = request.nextUrl;


    if (!token && pathname !== '/login' && pathname !== '/register') {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (token && (pathname === '/login' || pathname === '/register')) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico).*)", // global matcher
        // "/",  // private matcher
    ],
};