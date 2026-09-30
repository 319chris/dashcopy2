//这里主要是定义能进去到 supabase 访问的用户需要提供的身份信息格式是什么样的，
//DashboardViewer就是那个身份应该携带的信息格式

export const products = ["chatbot", "voice_agent"] as const;

export type Product = (typeof products)[number];

export const onboardingStatuses = [ "in_process", "submitted", "ready", ] as const;

export type DashboardOnboardingStatus = (typeof onboardingStatuses)[number];

export const companyRoles = ["owner", "member", "admin"] as const;

export type DashboardCompanyRole = (typeof companyRoles)[number];

export const portalStatuses = ["active", "inactive"] as const; 

export type PortalStatus = (typeof portalStatuses)[number];

export type DashboardViewer = {
	user: { id: string; email: string } | null;

	company: { 
		id: string; 
		name: string; 
	    slug: string; 
		portalStatus: PortalStatus; 
		products: Product[]; 
		onboardingStatus: DashboardOnboardingStatus; 
	} | null;

	companyRole: DashboardCompanyRole | null; 
	isAuthenticated: boolean;
	hasMembership: boolean;
}
