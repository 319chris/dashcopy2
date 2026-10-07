import { requireDashboardProduct } from "@/lib/dashboard/require-product";
import type { ReactNode } from "react";


export default async function ChatbotLayout({children,}:{children: ReactNode;}){
	await requireDashboardProduct("chatbot");

	return children;
}