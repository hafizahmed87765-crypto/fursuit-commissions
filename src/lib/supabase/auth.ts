import "server-only";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "./server";

export async function getCmsAdmin() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return null;
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: admin } = await supabase
    .from("admin_users")
    .select("role, display_name, active")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!admin?.active) return null;
  return { user, role: admin.role as "owner" | "editor", displayName: admin.display_name as string | null };
}

export async function requireCmsAdmin() {
  const admin = await getCmsAdmin();
  if (!admin) redirect("/admin/login/");
  return admin;
}
