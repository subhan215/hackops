// middleware.js
import { NextResponse } from 'next/server';
import { edgeLogger as logger } from './utils/edgeLogger';


// Global Middleware function
export async function middleware(req) {
  // Start measuring time for logging performance
  const startTime = Date.now();

  // Log the request method and URL for every request
  logger.info("Incoming request", {
    method: req.method,
    url: req.url,
    headers: req.headers,  // Optional: Log headers if necessary (be careful with sensitive data)
    cookies: req.cookies,  // Optional: Log cookies if necessary (handle sensitive info with care)
  });

  // Apply token validation only to specific routes
  if (req.nextUrl.pathname.startsWith('/dashboard') || req.nextUrl.pathname.startsWith('/profiles') || req.nextUrl.pathname.startsWith('/chat')) {
    // Log for token validation process
    logger.info("Token validation started for path", { path: req.nextUrl.pathname });

    const accessToken = req.cookies.get('access_token')?.value?.replace(/^["']|["']$/g, '');
    logger.info("Access token retrieved", { accessToken });

    if (!accessToken) {
      logger.warn("No access token found, redirecting to signin");
      return NextResponse.redirect(new URL('/signin', req.url));
    }

    // Check token validity (Example: API call to validate the token)
    try {
      const response = await fetch(`${req.nextUrl.origin}/api/auth_middleware`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accessToken }),
      });
      const data = await response.json();

      if (!data.success) {
        logger.warn("User authentication failed, redirecting to signin");
        return NextResponse.redirect(new URL('/signin', req.url));
      }

      // Log the user role for debugging (if needed)
      logger.info("User verified", { role: data.role });

      // Redirect based on role (example)
      if (data.role === 'user' && req.nextUrl.pathname.startsWith('/profiles/companyProfile')) {
        logger.info("Redirecting user to userProfile");
        return NextResponse.redirect(new URL('/profiles/userProfile', req.url));
      }

      if (data.role === 'company' && req.nextUrl.pathname.startsWith('/profiles/userProfile')) {
        logger.info("Redirecting company to companyProfile");
        return NextResponse.redirect(new URL('/profiles/companyProfile', req.url));
      }
    } catch (error) {
      // Log the error if something goes wrong with token validation
      logger.error('Error during token validation', { error: error.message });
      return NextResponse.error();
    }
  }

  // Always measure and log the execution time
  const duration = Date.now() - startTime;
  logger.info("Request processed", { url: req.url, duration: `${duration}ms` });

  // Proceed with the next middleware or request
  return NextResponse.next();
}

// Matcher configuration: Apply middleware to all routes but restrict token validation to specific ones
export const config = {
  matcher: ['/api/:path*', '/dashboard/:path*', '/profiles/:path*', '/chat'],  // Global middleware
};
