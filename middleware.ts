import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Check if the user is authenticated
  if (!session) {
    // If the user is not authenticated and trying to access a protected route
    if (req.nextUrl.pathname.startsWith("/dashboard") || req.nextUrl.pathname.startsWith("/onboarding")) {
      const redirectUrl = new URL("/login", req.url)
      return NextResponse.redirect(redirectUrl)
    }
  } else {
    // If the user is authenticated and trying to access auth pages
    if (req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/register")) {
      const redirectUrl = new URL("/", req.url)
      return NextResponse.redirect(redirectUrl)
    }

    // Check user role for specific routes
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()

    if (profile) {
      // Redirect professional to their dashboard
      if (profile.role === "professional" && req.nextUrl.pathname.startsWith("/dashboard/user")) {
        const redirectUrl = new URL("/dashboard/professional", req.url)
        return NextResponse.redirect(redirectUrl)
      }

      // Redirect user to their dashboard
      if (profile.role === "user" && req.nextUrl.pathname.startsWith("/dashboard/professional")) {
        const redirectUrl = new URL("/dashboard/user", req.url)
        return NextResponse.redirect(redirectUrl)
      }
    }
  }

  return res
}

export const config = {
  matcher: ["/dashboard/:path*", "/onboarding/:path*", "/login", "/register"],
}
