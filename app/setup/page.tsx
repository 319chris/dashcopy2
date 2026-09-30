import { redirect } from "next/navigation";
import { getAccessState } from "@/lib/dashboard/access";
import { ACCESS_HOME } from "@/lib/dashboard/routes";
import { getDashboardViewer } from "@/lib/dashboard/service";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/actions/auth";

export default async function SetupPage() {
  const currentPath = "/setup";

  const supabase = await createClient();

  const { data:{user}, error: userError,} = await supabase.auth.getUser();

  if(userError){
    throw userError;
  }

  const viewer = await getDashboardViewer(supabase,user);

  const accessState = getAccessState(viewer);

  if(ACCESS_HOME[accessState] !== currentPath){
    redirect(ACCESS_HOME[accessState]);
  }

  return (
      <main style={{ padding: 24 }}>
        <h1>Setup pending</h1>
        <form action={signOut}>
          <button type="submit">Sign out</button>
        </form>
      </main>
    );

}
