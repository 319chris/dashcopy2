import "server-only";

//这个是为远端 server 用来访问 supabase 而创建client的地方
//因为远端的 server 不像是 browser，browser 自身有解读 cookie 内容的功能，但远端 server 没有
//所以这里创建client的步骤会比较多一点


import{ createServerClient } from "@supabase/ssr";
import{ cookies } from "next/headers";



export async function createClient() {
    const cookieStore = await cookies();

    return createServerClient(
	    process.env.NEXT_PUBLIC_SUPABASE_URL!,
	    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
	    {
		        cookies: {
		          	getAll() {
		          	return cookieStore.getAll();
		        },

		          	setAll(cookiesToSet) {
		          		try {
		          			cookiesToSet.forEach(({ name, value, options }) => {
		          			cookieStore.set(name, value, options);
		          			});
		          		} catch {
					}

		          	}
		        },
	        
	    },
    );
}
