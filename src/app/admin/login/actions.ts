"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function signInToAdmin(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) redirect("/admin/login/?error=missing");

  let supabase;
  try {
    supabase = await createSupabaseServerClient();
  } catch {
    redirect("/admin/login/?error=setup");
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) {
    // Log the real reason server-side; the page only shows a safe summary.
    console.error("[admin login]", error?.name, error?.code, error?.status, error?.message);
    if (error?.code === "email_not_confirmed") redirect("/admin/login/?error=unconfirmed");
    if (error && (error.name === "AuthRetryableFetchError" || !error.status)) redirect("/admin/login/?error=network");
    redirect("/admin/login/?error=credentials");
  }

  const { data: profile } = await supabase
    .from("admin_users")
    .select("active")
    .eq("user_id", data.user.id)
    .maybeSingle();
  if (!profile?.active) {
    await supabase.auth.signOut();
    redirect("/admin/login/?error=unauthorized");
  }
  redirect("/admin/");
}
