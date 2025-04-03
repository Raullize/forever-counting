import { NextResponse } from 'next/server';

export function middleware(request) {
  const user = request.cookies.get('user')?.value;
  const isLoggedIn = user ? JSON.parse(user).loggedIn : false;
  const isAdmin = user ? JSON.parse(user).isAdmin : false;
  const { pathname } = request.nextUrl;

  // Redirecionar para a página de login se não estiver logado e tentar acessar páginas protegidas
  if (!isLoggedIn && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Redirecionar para o dashboard se já estiver logado e tentar acessar a página de login
  if (isLoggedIn && pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirecionar para o dashboard normal se não for admin e tentar acessar área de admin
  if (!isAdmin && pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/admin/:path*'],
}; 