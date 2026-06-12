import { NextResponse, type NextRequest } from 'next/server';

// Simple middleware that only handles redirects for auth
// Actual auth protection is done client-side via AuthContext
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip for all static assets and internal routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // All other routes pass through - auth is handled client-side
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
