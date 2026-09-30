//这里是提供一个防止 cookie 过期需要刷新的情况
//proxy 


import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest} from "next/server";

export async function updateSession(request: NextRequest){
	let response = NextResponse.next({ request, });

	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
      	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      	{
      		cookies: {
      			getAll(){
      				return request.cookies.getAll();
      			},

	      		setAll(cookiesToSet){
	      			cookiesToSet.forEach(({ name, value }) => {
	      				request.cookies.set(name, value);
	      			});

	      			response = NextResponse.next({request,});

	      			cookiesToSet.forEach(({ name, value, options }) => {
	      				response.cookies.set(name, value, options);
	      			});
	      		}
      		}
      	}
	)

	const{ data: {user}} = await supabase.auth.getUser();
	return{ response, user };
}
