"use server";
import { createClient } from "@/lib/supabase/server";
import { isProductList } from "@/lib/dashboard/validation";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";



export type SubmitCompanyAccessRequestState = {
    error: string | null;
  };


export async function submitCompanyAccessRequest(
    previousState: SubmitCompanyAccessRequestState,
    formData: FormData,
  ): Promise<SubmitCompanyAccessRequestState> {
  const supabase = await createClient();

  const{ data:{user}, error:userError,} = await supabase.auth.getUser();

  if(userError){
    return{error: "Unable to verify your sign-in session."}
  }

  if(!user){
    redirect("/sign-in");
  }

  const{ data: membership, error: membershipError } = await supabase
    .from("company_members")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if(membershipError){
    return { error:"Unable to check your company membership"}

  }

  if(membership){
    return {error: "your compmay already belong to a company"};
  }

  const compnayNameValue = formData.get("companyName");
  const requestedProducts = formData.getAll("products");

  if(typeof compnayNameValue !== "string" || compnayNameValue.trim() === ""){
    return {error:" company name is required"};
  }

  if(!isProductList(requestedProducts) || requestedProducts.length === 0){
    return { error:" select at least one valid products"};
  }

  const{ error: insertError } = await supabase
    .from("company_access_requests")
    .insert({
      user_id:user.id,
      company_name:compnayNameValue.trim(),
      products:requestedProducts,
    });

  if(insertError){
    if(insertError.code === "23505"){
      return {error: "you have already submitted the request."};
    }
    return { error :"Unable to submit your accesss request. please try again"};

  }
  revalidatePath("/setup");
  redirect("/setup");


}