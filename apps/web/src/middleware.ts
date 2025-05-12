import { type NextRequest, NextResponse } from "next/server";
// import { getSessionCookie } from "better-auth/cookies";

// Private routes that require authentication
// const protectedRoutes = ["/create(.*)"];

export async function middleware(request: NextRequest) {
  // const { pathname } = request.nextUrl;

  // Check if the current path is a protected route
  // const isProtectedRoute = protectedRoutes.some((route) => {
  //   const regex = new RegExp(`^${route}$`);
  //   return regex.test(pathname);
  // });

  // For non-public routes, check authentication
  // if (isProtectedRoute) {
    // const sessionCookie = getSessionCookie(request);

  //   if (!sessionCookie) {
  //     return NextResponse.redirect(new URL("/signin", request.url));
  //   }
  // }

  // If authenticated, redirect to studio
  // if (pathname === "/") {
  //   const sessionCookie = getSessionCookie(request);

  //   if (sessionCookie) {
  //     return NextResponse.redirect(new URL("/studio", request.url));
  //   }
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     * - api routes
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
