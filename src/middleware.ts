import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for internal Next.js routes and static assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // Skip for not-found and forbidden pages
  if (pathname === '/not-found' || pathname === '/forbidden') {
    return NextResponse.next();
  }

  // Check if env vars are available (safety for build time)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({ request });

  try {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
        },
      },
    });

    const { data: { user } } = await supabase.auth.getUser();

    // Public routes - redirect to home if already logged in
    if (pathname === '/login' || pathname === '/register') {
      if (user) return NextResponse.redirect(new URL('/', request.url));
      return supabaseResponse;
    }

    // Protected routes - need auth
    if (!user) {
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Admin routes - need ADMIN role
    if (pathname.startsWith('/admin')) {
      const { data: profile } = await supabase
        .from('tb_users')
        .select('role, is_banned')
        .eq('auth_id', user.id)
        .single();

      if (!profile || profile.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/forbidden', request.url));
      }
      if (profile.is_banned) {
        return NextResponse.redirect(new URL('/login?banned=1', request.url));
      }
    }

    // Check ban on all authenticated routes (non-admin)
    if (!pathname.startsWith('/admin')) {
      const { data: profile } = await supabase
        .from('tb_users')
        .select('is_banned')
        .eq('auth_id', user.id)
        .single();

      if (profile?.is_banned) {
        return NextResponse.redirect(new URL('/login?banned=1', request.url));
      }
    }
  } catch (error) {
    // If Supabase fails, let the request through (client will handle auth)
    console.error('[Middleware] Error:', error);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
