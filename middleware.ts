import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/', '/login', '/api/auth/login', '/api/auth/callback', '/dashboard'];

function isPathPublic(pathname: string) {
  return PUBLIC_PATHS.some((path) => {
    if (pathname === path) return true;
    if (pathname.startsWith(path)) {
      const nextChar = pathname.charAt(path.length);
      return nextChar === '/' || nextChar === '' || nextChar === undefined;
    }
    return false;
  });
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('jwt')?.value;

  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/static/') ||
    pathname.match(/\.(css|js|map|png|jpg|jpeg|svg|ico|woff2|woff|ttf)$/)
  ) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/api/v1/auth/')) {
    return NextResponse.next();
  }

  const isPublic = isPathPublic(pathname);

  if (isPublic) {
    if (token && (pathname === '/' || pathname === '/login')) {
      return NextResponse.redirect(new URL('/home', request.url));
    }
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}
