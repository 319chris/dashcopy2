import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

export async function isPlatformAdmin( supabase: SupabaseClient, userId: string,): Promise<boolean> {

  const { data, error } = await supabase
    .from("platform_admins")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw error;}

  return data !== null;
}
