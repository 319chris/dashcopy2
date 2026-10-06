"use server";
 import { revalidatePath } from "next/cache";
 import { redirect } from "next/navigation";

 import { isPlatformAdmin } from "@/lib/platform/admin";
 import { createClient } from "@/lib/supabase/server";


export async function approveCompanyAccessRequest(formData: FormData,){
	const supabase = await createClient();

	const{data:{user}, error:userError, } = await supabase.auth.getUser();

	if(userError){
		throw userError;
	}

	if(!user){
		redirect("/sign-in");
	}

	const platformAdmin = await isPlatformAdmin(supabase, user.id);

	if(!platformAdmin){
		throw new Error("Only platform admins can approve access requests.");
	}

	const requestId = formData.get("requestId");

	if(typeof requestId !== "string" || requestId.trim() === ""){
		throw new Error("A valid access request id is required.");
	}

	const { error } = await supabase.rpc( "approve_company_access_request",{p_request_id: requestId.trim(),}, );

	if(error){ throw error };

	revalidatePath("/admin/access-requests");

    // 若申请用户刷新这些页面，会读取最新的 membership / onboarding。
    revalidatePath("/setup");
    revalidatePath("/dashboard");
}

export async function rejectCompanyAccessRequest(formData: FormData,){
	const supabase = await createClient();
	const{data:{user}, error:userError, } = await supabase.auth.getUser();

	if(userError){
		throw userError;
	}

	if(!user){
		redirect("/sign-in");
	}

	const platformAdmin = await isPlatformAdmin(supabase, user.id);

	if(!platformAdmin){
		throw new Error("Only platform admins can reject access requests.");
	}

	const requestId = formData.get("requestId");

	if(typeof requestId !== "string" || requestId.trim() === ""){
		throw new Error("A valid access request id is required.");
	}

	const { error } = await supabase.rpc( "reject_company_access_request",{p_request_id: requestId.trim(),}, );

	if(error){ throw error };

	revalidatePath("/admin/access-requests");
	revalidatePath("/setup");
}
