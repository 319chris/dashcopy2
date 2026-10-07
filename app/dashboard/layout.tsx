
import { createClient } from "@/lib/supabase/server";
import { getDashboardViewer } from "@/lib/dashboard/service";
import { getAccessState } from "@/lib/dashboard/access";
import { redirect } from "next/navigation";
import { ACCESS_HOME } from "@/lib/dashboard/routes";
import type { ReactNode } from "react";
import Link from "next/link";


type DashboardLayoutProps = {
  children: ReactNode;
};

export default async function DashboardLayout({children,}: DashboardLayoutProps){
  const supabase = await createClient();
  const {data:{user}, error:userError,} = await supabase.auth.getUser();

  if(userError){
    throw userError;
  }

  const viewer = await getDashboardViewer(supabase, user);
  const accessState = getAccessState(viewer);

  if(accessState !== "ready"){
    redirect(ACCESS_HOME[accessState]);
  }

  if(!viewer.company){
    throw new Error("Ready dashboard viewer is missing company data.");
  }

  const navigationItems = [
    ...(viewer.company.products.includes("chatbot")
      ? [
          {
            href: "/dashboard/chatbot",
            label: "Chatbot",
          },
        ]
      : []),

    ...(viewer.company.products.includes("voice_agent")
      ? [
          {
            href: "/dashboard/voice-agent",
            label: "Voice Agent",
          },
        ]
      : []),

    // 已 ready 的用户永远能进入 Settings。
    {
      href: "/dashboard/settings",
      label: "Settings",
    },
  ];

  return (
    <main
      style={{
        display: "grid",
        gridTemplateColumns: "220px 1fr",
        minHeight: "100vh",
      }}
    >
      <aside
        style={{
          borderRight: "1px solid #ccc",
          padding: 24,
        }}
      >
        <h1 style={{ marginTop: 0 }}>Dashboard</h1>

        <nav aria-label="Dashboard navigation">
          <ul
            style={{
              display: "grid",
              gap: 12,
              listStyle: "none",
              margin: 0,
              padding: 0,
            }}
          >
            {navigationItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <section style={{ padding: 24 }}>
        {children}
      </section>
    </main>
  );
  }
