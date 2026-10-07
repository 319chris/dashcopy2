import "server-only";

import type { Product } from "./types";
import { createClient } from "@/lib/supabase/server";
import { getDashboardViewer } from "./service";
import { getProductAccessState } from "./access";
import { redirect } from "next/navigation";
import { ACCESS_HOME } from "./routes";

const PRODUCT_UNAVAILABLE_HOME = "/dashboard?notice=product-unavailable";

export async function requireDashboardProduct(product: Product):Promise<void>{

	const supabase = await createClient();
	const{data:{user}, error: userError,} = await supabase.auth.getUser();

	if(userError){
		throw userError;
	}

	const viewer = await getDashboardViewer(supabase,user);

	const accessState = getProductAccessState(viewer, product);

	if (accessState === "product_unavailable") {
      redirect(PRODUCT_UNAVAILABLE_HOME);
    }

	if (accessState !== "ready") {
      redirect(ACCESS_HOME[accessState]);
    }

}