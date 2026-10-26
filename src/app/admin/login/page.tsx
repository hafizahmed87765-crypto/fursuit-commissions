import Link from "next/link";
import { signInToAdmin } from "./actions";

export const metadata = { robots: { index: false, follow: false } };

const errors: Record<string, string> = {
  missing: "Enter your email and password.",
  credentials: "Those sign-in details were not accepted.",
  unauthorized: "This account does not have CMS access.",
  setup: "Admin sign-in is not configured yet. Set the Supabase environment variables and apply the database migration.",
};

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  return (
    <main className="container-x grid min-h-[70vh] place-items-center py-12">
      <section className="card w-full max-w-md p-7 sm:p-9">
        <p className="eyebrow">FursuitCommissions.com</p>
        <h1 className="mt-2 text-3xl font-bold">Admin sign in</h1>
        <p className="mt-3 text-ink-muted">Sign in with an account that has been added to the CMS admin list.</p>
        {error && errors[error] ? <p role="alert" className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-800">{errors[error]}</p> : null}
        {configured ? (
          <form action={signInToAdmin} className="mt-6 space-y-4">
            <div>
              <label className="field-label" htmlFor="email">Email</label>
              <input className="field" id="email" name="email" type="email" autoComplete="username" required />
            </div>
            <div>
              <label className="field-label" htmlFor="password">Password</label>
              <input className="field" id="password" name="password" type="password" autoComplete="current-password" required />
            </div>
            <button className="btn-primary w-full" type="submit">Sign in</button>
          </form>
        ) : (
          <p className="mt-6 rounded-xl bg-rose-50 p-4 text-sm text-rose-950">
            Admin access is not configured. See the CMS setup steps in the README.
          </p>
        )}
        <Link href="/" className="link mt-6 inline-block">Return to website</Link>
      </section>
    </main>
  );
}
