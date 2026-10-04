import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { CompanyAccessRequest } from "./types";
import {
  isCompanyAccessRequestStatus,
  isProductList,
} from "./validation";


export async function getCompanyAccessRequest(supabase:SupabaseClient,userId:string,):Promise<CompanyAccessRequest | null>{

	const {data:request, error} = await supabase
		.from("company_access_requests")
		.select("company_name, products, status")
		.eq("user_id", userId)
		.maybeSingle();

	if(error){
		throw error; 
	}

	if(!request){
		return null;
	}

	if(typeof request.company_name !== "string" || request.company_name.trim() === ""){
		throw new Error("Invalid company name returned from database");
	}

	if(!isProductList(request.products) || request.products.length === 0){
		throw new Error("Invalid products returned from database");
	}

	if(!isCompanyAccessRequestStatus(request.status)){
		throw new Error("Invalid access request status returned from database")
	}

	return{
				companyName: request.company_name,
      	products: request.products,
      	status: request.status,
	}
}
