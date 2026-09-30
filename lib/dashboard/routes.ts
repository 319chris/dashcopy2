import type { DashboardAccessState } from "./access";

export const ACCESS_HOME: Record<DashboardAccessState, string> = { signed_out: "/sign-in", unmapped: "/setup", setup_pending: "/setup", ready: "/dashboard", };