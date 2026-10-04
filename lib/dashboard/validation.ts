//这个文件下主要是对我们自定义的 type 的一些规定，因为我们的 type 都是自定义的，所以都需要严格的制定边界
import {
    companyRoles,
    onboardingStatuses,
    portalStatuses,
    products,
    accessRequestStatuses,
    type CompanyAccessRequestStatus,
    type DashboardCompanyRole,
    type DashboardOnboardingStatus,
    type PortalStatus,
    type Product,
} from "./types";
//这步是在看传进来的 products 字段是否是 string，是否属于我们定义好的范围内
export function isProduct(value: unknown): value is Product {
  return (typeof value === "string" && (products as readonly string[]).includes(value));
}
//这步也是在检查 products，但是因为products 的特殊性，它可以有两个值的情况，也就是会变成 list，
//这里就是在检查是否是 list，如果是的话，就再次调用上面的 isproduct 来检查list 里每个字段是否合规
export function isProductList(value: unknown) : value is Product[]{
  return Array.isArray(value) && value.every(isProduct);
}

export function isOnboardingStatus(value: unknown,): value is DashboardOnboardingStatus {
  return (typeof value === "string" && (onboardingStatuses as readonly string[]).includes(value));
}

export function isPortalStatus(value: unknown):value is PortalStatus{
  return (typeof value === "string" && (portalStatuses as readonly string[]).includes(value));
}

export function isCompanyRole(value: unknown):value is DashboardCompanyRole{
  return (typeof value === "string" && (companyRoles as readonly string[]).includes(value));
}

export function isCompanyAccessRequestStatus(value: unknown,): value is CompanyAccessRequestStatus{
  return (typeof value === "string" && (accessRequestStatuses as readonly string[]).includes(value));
}
