//这里是列出一些反馈的情况，对一个身份信息的情况进行分类反馈，这个身份信息表里面缺少某些东西对应着某些特定的情况


import type {DashboardViewer} from "@/lib/dashboard/types"

export type DashboardAccessState = | "signed_out" | "unmapped" | "setup_pending" | "ready";

export function getAccessState(viewer : DashboardViewer): DashboardAccessState {

    //用户账号密码验证失败
    if(!viewer.isAuthenticated){
      return "signed_out";
    }
	  // 当前账号下，返回的 user 是空的，就是说 supabase 里面找不到这个id 下对应的 user
    if (viewer.user === null) {
      return "unmapped";
    }

    // 已经认证了，找到 user 了也，但是这个 user 没有任何公司（但其实这里我有个问题，就是我们当前这个设定，一个人在注册账号的时候，是一定需要填写公司等信息的，所有我觉得这一步可能没有什么必要存在）
    if (!viewer.hasMembership || !viewer.company) {
      return "setup_pending";
    }

    // 公司已经存在，用户已经写好了基本信息，但后台还没有下批
    if (viewer.company.portalStatus !== "active") {
      return "setup_pending";
    }

    // 公司还没有选择产品
    if (viewer.company.products.length === 0) {
      return "setup_pending";
    }

    // 产品也选完了，但Onboarding 未完成，需要后台人工
    if (viewer.company.onboardingStatus !== "ready") {
      return "setup_pending";
    }

    return "ready";
  }
