import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { isPlatformAdmin } from "@/lib/platform/admin";
import {
  approveCompanyAccessRequest,
  rejectCompanyAccessRequest,
} from "@/app/actions/admin";



export default async function AdminAccessRequestsPage(){
  const supabase = await createClient();

  const{ data: { user }, error: userError,} = await supabase.auth.getUser();

  if(userError){
    throw userError;
  }

  if(!user){
    redirect("/sign-in");
  }

  const platformAdmin = await isPlatformAdmin(supabase, user.id);

  if(!platformAdmin){
    notFound();
  }

  const{data:requests, error: requestsError} = await supabase
    .from("company_access_requests")
    .select("id, user_id, company_name, products, status, created_at")
    .eq("status", "submitted")
    .order("created_at", { ascending: true });

  if(requestsError){
    throw requestsError;
  }

  return (
      <main style={{ padding: 24 }}>
        <h1>Access requests</h1>

        {requests.length === 0 ? (
          <p>No submitted access requests.</p>
        ) : (
          <ul style={{ display: "grid", gap: 16, padding: 0 }}>
            {requests.map((request) => (
              <li
                key={request.id}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: 8,
                  padding: 16,
                  listStyle: "none",
                }}
              >
                <p>Request ID: {request.id}</p>
                <p>User ID: {request.user_id}</p>
                <p>Company: {request.company_name}</p>
                <p>Products: {request.products.join(", ")}</p>
                <p>Status: {request.status}</p>
                <p>Submitted: {request.created_at}</p>

                <form action={approveCompanyAccessRequest}>
                  <input
                    type="hidden"
                    name="requestId"
                    value={request.id}
                  />
                  <button type="submit">Approve</button>
                </form>

                <form action={rejectCompanyAccessRequest}>
                  <input
                    type="hidden"
                    name="requestId"
                    value={request.id}
                  />
                  <button type="submit">Reject</button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </main>
  );
}
