import { createClient } from "@/lib/supabase/server";
import { getDashboardViewer } from "@/lib/dashboard/service";
import { getAccessState } from "@/lib/dashboard/access";
import { ACCESS_HOME } from "@/lib/dashboard/routes";
import { redirect } from "next/navigation";
import { signOut } from "@/app/actions/auth";



export default async function DashboardPage(){


  const currentPath = "/dashboard";
  const supabase = await createClient();

  const {data: {user}, error: userError,} = await supabase.auth.getUser();

  if(userError){
    throw userError;
  }

  const viewer = await getDashboardViewer(supabase, user);
  const accessState = getAccessState(viewer);
  const company = viewer.company;
  if(!company){
    redirect("/setup");
  }


  if(ACCESS_HOME[accessState] !== currentPath ){
    redirect(ACCESS_HOME[accessState]);
  }
  return (
    <main style={{ padding: 24 }}>
      <h1>{company.name} Dashboard</h1>

      <p>Company slug: {company.slug}</p>
      <p>Portal status: {company.portalStatus}</p>
      <p>Onboarding status: {company.onboardingStatus}</p>

      <h2>Enabled products</h2>

      <ul>
        {company.products.map((product) => (
          <li key={product}>{product}</li>
        ))}
      </ul>

      <form action={signOut}>
        <button type="submit">Sign out</button>
      </form>
    </main>
  );

}
