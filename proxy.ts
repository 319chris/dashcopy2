import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

  export async function proxy(request: NextRequest) {
    const { response, user } = await updateSession(request);

    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/sign-in";

      const redirectResponse = NextResponse.redirect(url);

      response.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie);
      }) 

      return redirectResponse;

    }

    return response;
  }

  export const config = {
    matcher: ["/dashboard/:path*", "/setup/:path*"],
  };
