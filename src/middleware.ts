import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
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
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;

  // Public routes
  if (pathname === '/login' || pathname === '/register') {
    if (user) return NextResponse.redirect(new URL('/', request.url));
    return supabaseResponse;
  }

  // Static assets
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
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

  // Check ban on all authenticated routes
  const { data: profile } = await supabase
    .from('tb_users')
    .select('is_banned')
    .eq('auth_id', user.id)
    .single();

  if (profile?.is_banned) {
    return NextResponse.redirect(new URL('/login?banned=1', request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
