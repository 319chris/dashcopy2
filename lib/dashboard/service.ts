import "server-only";

import type { SupabaseClient, User } from "@supabase/supabase-js";
import type {
  DashboardOnboardingStatus,
  DashboardViewer,
  Product,
} from "./types";
import {isCompanyRole, isOnboardingStatus, isPortalStatus, isProductList, } from "./validation";

//等待返回型的 function，目的是获得这个用户 id 下，是否有是任何公司下的成员
export async function getCompanyMembership(supabase: SupabaseClient, userId: string){
	const{data, error} = await supabase
		.from("company_members")
		.select("company_id, role")
		.eq("user_id", userId)
		.maybeSingle();

	if(error){
		throw error;
	}

	return data;
}
//等待返回型的 function，目的是获得当前在这个公司 id 下的 onboarding 情况是什么
export async function getOnboardingState(supabase: SupabaseClient, companyId: string){
	const{data: onboarding, error: onboardingError} = await supabase
		.from("company_onboarding")
    .select("onboarding_status, products")
    .eq("company_id", companyId)
    .maybeSingle();

	if (onboardingError) {
		throw onboardingError;
	}

    return onboarding;
}

//等待返回型的function，目的是获得在这个companyid 下，这个 company 的基础信息
export async function getCompany(supabase:SupabaseClient, companyId: string){
  const{data, error} = await supabase
    .from("companies")
    .select("id, name, slug, portal_status")
    .eq("id", companyId)
    .maybeSingle();
  if(error){
    throw error;
  }  
  return data;
}

//等待返回型的 function，目的是获得在这个 userid 下，按 dashboardViewer制定的规则来把每一个数据都赋值
export async function getDashboardViewer(supabase:SupabaseClient, user: User | null):Promise<DashboardViewer>{
  //这是没有登入的情况
  if(!user){
    return{ 
      user: null,
      company: null,
      companyRole: null,
      isAuthenticated: false,
      hasMembership: false, 
    }
  }
  //下面是已登入的情况
  const membership = await getCompanyMembership(supabase, user.id,);
  //如果发现在这个 id 下，没有找到 user_id = 当前user.id 的那一整行成员关系记录
  if(!membership){
    return {
      user:{ id: user.id, email: user.email ?? "",},
      company: null,
      companyRole:null,
      isAuthenticated:true,
      hasMembership:false,
    };
  }
  //在这个 id 下，虽然user_id = 当前user.id 的那一整行是有记录的，但是字段不符合要求
  if(!isCompanyRole(membership.role)){
    throw new Error("Invalid company role returned from database");
  }

  const company = await getCompany(supabase,membership.company_id);
  //走到这一步的时候，意味着 membership 存在，字段正确，那么如果这时候找不到 company，就需要抛错了，不符合逻辑
  if(!company){
    throw new Error("Invalid company returned from database");
  }

  if(!isPortalStatus(company.portal_status)){
    throw new Error("Invalid portal_status returned from database");
  }

  const onboarding = await getOnboardingState(supabase, membership.company_id);
  let selectedProducts: Product[];
  let selectedOnboardingStatus: DashboardOnboardingStatus;
  //这里是公司和成员关系都存在，当前 companyId 对应的 onboarding 整行记录不存在
  if(!onboarding){
    selectedProducts = [];
    selectedOnboardingStatus = "in_process";
  } else {
    if(!isOnboardingStatus(onboarding.onboarding_status)){
      throw new Error("Invalid onboarding returned from database");
    }
    
    if(!isProductList(onboarding.products)){
      throw new Error("Invalid products returned from database");
    }

    selectedProducts = onboarding.products;
    selectedOnboardingStatus = onboarding.onboarding_status;
  }





  return{
    user: {id: user.id, email: user.email ?? "",},
    company: {
      id: company.id,
      name: company.name,
      slug: company.slug,
      portalStatus: company.portal_status,
      products: selectedProducts, 
      onboardingStatus: selectedOnboardingStatus, 
    } ,
    companyRole: membership.role,
    isAuthenticated: true,
    hasMembership: true,
  };
}
