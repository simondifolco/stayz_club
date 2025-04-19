import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  try {
    // Create an unmodified response
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            request.cookies.set(name, value);
            response = NextResponse.next({
              request,
            });
            response.cookies.set(name, value);
          },
          remove(name: string, options: CookieOptions) {
            request.cookies.delete(name);
            response = NextResponse.next({
              request,
            });
            response.cookies.delete(name);
          },
        },
      },
    );

    // Only check auth for dashboard routes
    if (request.nextUrl.pathname.startsWith("/dashboard")) {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Redirect to sign-in if not authenticated
      if (!user) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
      }
    }

    return response;
  } catch (e) {
    console.error("Middleware error:", e);
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
