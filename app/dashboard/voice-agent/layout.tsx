import type { ReactNode } from "react";
import { requireDashboardProduct } from "@/lib/dashboard/require-product";

export default async function VoiceAgentLayout({children,}: {children: ReactNode;}) {
  await requireDashboardProduct("voice_agent");

  return children;
}