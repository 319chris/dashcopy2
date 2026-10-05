import { redirect } from "next/navigation";
import { getAccessState } from "@/lib/dashboard/access";
import { ACCESS_HOME } from "@/lib/dashboard/routes";
import { getDashboardViewer } from "@/lib/dashboard/service";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/actions/auth";
import { getCompanyAccessRequest } from "@/lib/dashboard/application";
import ApplicationForm from "./application-form";

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

  if(!user){
    redirect("/sign-in");
  }

  if (!viewer.hasMembership) {
    const request = await getCompanyAccessRequest(supabase, user.id);

    if (!request) {
    return (
      <main style={{ padding: 24 }}>
        <h1>Request access</h1>
        <p>Submit your company and product request for review.</p>

        {/* 只有当前用户没有申请记录时，才显示申请表。 */}
        <ApplicationForm />

        <form action={signOut}>
          <button type="submit">Sign out</button>
        </form>
      </main>
    );
  }

    if (request.status === "submitted") {
      return (
        <main style={{ padding: 24 }}>
          <h1>Application submitted</h1>
          <p>Your company access request is waiting for review.</p>
          <p>Company: {request.companyName}</p>
          <p>Products: {request.products.join(", ")}</p>

          <form action={signOut}>
            <button type="submit">Sign out</button>
          </form>
        </main>
      );
    }

    if (request.status === "rejected") {
      return (
        <main style={{ padding: 24 }}>
          <h1>Application not approved</h1>
          <p>Please contact our team for more information.</p>

          <form action={signOut}>
            <button type="submit">Sign out</button>
          </form>
        </main>
      );
    }
    if (request.status === "approved") {
    throw new Error(
      "Approved access request has no company membership",
    );
  }
    throw new Error("Unhandled access request status");
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
