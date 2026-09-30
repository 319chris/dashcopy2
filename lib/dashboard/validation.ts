//产品只能是 chatbot 或 voice_agent。
//开通状态只能是 in_process、submitted、ready。

import {
    companyRoles,
    onboardingStatuses,
    portalStatuses,
    products,
    type DashboardCompanyRole,
    type DashboardOnboardingStatus,
    type PortalStatus,
    type Product,
} from "./types";

export function isProduct(value: unknown): value is Product {
  return (typeof value === "string" && (products as readonly string[]).includes(value));
}

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
