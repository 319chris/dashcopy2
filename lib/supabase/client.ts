//这一步主要是从 supabase 提供的库里面导入一个叫 createBrowerClient 的 function，然后去 env 里面把 url 和 key 都调出来，
//放在里面，最后是createBrowerClient（key, url)完成创建 client，也就是后续能执行登录、查询数据库等操作的对象
//但这里要切记，这是一个来自由 browser 向 supabase 发送的一个请求，当前是用于 login 

import { createBrowserClient } from "@supabase/ssr";

export function createClient(){

	return createBrowserClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
	    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
	);
}