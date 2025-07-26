import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Protected routes that require authentication
const protectedRoutes = ['/projects', '/issues']
const authRoutes = ['/login', '/register']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if the current path is protected  
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  // Check if the current path is auth related
  const isAuthRoute = authRoutes.includes(pathname)
  
  // Get token from cookies
  const token = request.cookies.get('token')?.value
  
  // Simple check - if token exists, consider authenticated
  // More detailed validation happens in API routes
  const isAuthenticated = !!token
  
  // Redirect to login if trying to access protected route without auth
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // Redirect to projects if authenticated user tries to access auth pages
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/projects', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}