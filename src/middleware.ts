import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'gorillasales-enterprise-secret-key-change-in-prod-2026'
);

const COOKIE_NAME = 'gorillasales_session';

const MANAGER_ROUTES = ['/manager', '/config', '/user-management'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow static files, api routes, login, and public homepage
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname === '/login' ||
    pathname === '/'
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;

  // 1. If unauthenticated, allow preview or redirect to login
  if (!token) {
    // For seamless dev/demo experience, if login page is hit directly or unauthenticated, let pass or redirect
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const role = (payload as any)?.role;

    // 2. Role-Based Access Control (RBAC) Guard for Manager/Admin routes
    if (MANAGER_ROUTES.some((r) => pathname.startsWith(r))) {
      if (role !== 'MANAGER' && role !== 'ADMIN' && role !== 'Manager' && role !== 'Admin') {
        const homeUrl = new URL('/', request.url);
        return NextResponse.redirect(homeUrl);
      }
    }

    return NextResponse.next();
  } catch (error) {
    // Token expired or invalid
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
