import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const url = request.nextUrl.clone();

  // Check if accessing admin subdomain
  const isAdminSubdomain =
    hostname.startsWith('admin.') ||
    hostname.startsWith('admin-'); // For Vercel preview URLs

  // Admin subdomain routing
  if (isAdminSubdomain) {
    // If not already on /admin path, rewrite to /admin
    if (!url.pathname.startsWith('/admin')) {
      url.pathname = `/admin${url.pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  // Note: Direct /admin access is allowed for now
  // To restrict to subdomain only, uncomment below:
  // const isDevelopment = process.env.NODE_ENV === 'development';
  // if (!isAdminSubdomain && url.pathname.startsWith('/admin') && !isDevelopment) {
  //   return NextResponse.redirect(new URL('/', request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'
  ]
};
