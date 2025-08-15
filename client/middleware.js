import { NextResponse } from "next/server";

export function middleware(request) {
    const token = request.cookies.get('token')?.value;
    console.log("Token:", token);
    const { pathname } = request.nextUrl;


    if (pathname.startsWith('/login') && token) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/login",
    ],
};