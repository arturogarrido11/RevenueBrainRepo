import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server"

const isPublicPage = createRouteMatcher([
  // Marketing / legal
  "/",
  "/how-it-works(.*)",
  "/pricing(.*)",
  "/demo(.*)",
  "/privacy(.*)",
  "/privacy-policy(.*)",
  "/terms(.*)",
  "/terms-of-service(.*)",
  "/sms-policy(.*)",
  "/missed-call-consent-proof(.*)",
  // Auth routes
  "/login(.*)",
  "/signup(.*)",
  "/onboarding(.*)",
])

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  const { pathname } = request.nextUrl
  const authenticated = await convexAuth.isAuthenticated()

  // Logged-in users hitting the marketing homepage → dashboard
  if (pathname === "/" && authenticated) {
    return nextjsMiddlewareRedirect(request, "/dashboard")
  }

  // Logged-in users hitting login/signup → dashboard
  if ((pathname === "/login" || pathname === "/signup") && authenticated) {
    return nextjsMiddlewareRedirect(request, "/dashboard")
  }

  // Protected routes: require auth
  if (!isPublicPage(request) && !authenticated) {
    return nextjsMiddlewareRedirect(request, "/login")
  }
})

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - Files with extensions (images, fonts, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
}
