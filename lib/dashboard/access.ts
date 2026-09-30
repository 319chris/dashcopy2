//这里是列出一些反馈的情况，对一个身份信息的情况进行分类反馈，这个身份信息表里面缺少某些东西对应着某些特定的情况


import type {DashboardViewer} from "@/lib/dashboard/types"

export type DashboardAccessState = | "signed_out" | "unmapped" | "setup_pending" | "ready";

export function getAccessState(viewer : DashboardViewer): DashboardAccessState {


    if(!viewer.isAuthenticated){
      return "signed_out";
    }
	  // 1. 没有用户对象：无法建立 Dashboard 身份映射
    if (viewer.user === null) {
      return "unmapped";
    }


  

    // 3. 已认证，但没有公司成员关系
    if (!viewer.hasMembership || !viewer.company) {
      return "setup_pending";
    }

    // 4. 公司门户尚未激活
    if (viewer.company.portalStatus !== "active") {
      return "setup_pending";
    }

    // 5. 尚未开通产品
    if (viewer.company.products.length === 0) {
      return "setup_pending";
    }

    // 6. Onboarding 未完成
    if (viewer.company.onboardingStatus !== "ready") {
      return "setup_pending";
    }

    return "ready";
  }
