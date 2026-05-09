import { redirect } from "next/navigation";
import {
  checkAdminPassword,
  isAdminConfigured,
  isAuthenticated,
  setSessionCookie,
} from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

type SearchParams = { error?: string };

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  if (await isAuthenticated()) {
    redirect("/admin/messages");
  }

  const { error } = await searchParams;
  const configured = isAdminConfigured();

  async function loginAction(formData: FormData) {
    "use server";
    const password = String(formData.get("password") ?? "");
    if (!checkAdminPassword(password)) {
      redirect("/admin/login?error=invalid");
    }
    await setSessionCookie();
    redirect("/admin/messages");
  }

  return (
    <>
      <h1 className="text-3xl font-semibold tracking-tight">Admin sign-in</h1>
      <p className="mt-4 text-[var(--color-text-secondary)]">
        Restricted area. Enter the admin password to view contact form
        submissions.
      </p>

      {!configured ? (
        <p className="mt-6 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-sm text-[var(--color-text-muted)]">
          Admin auth is not configured on this environment. Set{" "}
          <code className="font-mono">ADMIN_PASSWORD</code> and{" "}
          <code className="font-mono">ADMIN_SESSION_SECRET</code> in{" "}
          <code className="font-mono">.env</code>, then restart the server.
        </p>
      ) : null}

      <form action={loginAction} className="mt-8 max-w-sm space-y-4">
        <div>
          <label
            htmlFor="password"
            className="text-sm text-[var(--color-text-secondary)]"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoFocus
            disabled={!configured}
            autoComplete="current-password"
            className="mt-2 flex h-10 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-base)] disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        {error === "invalid" ? (
          <p className="text-sm text-red-600">
            Incorrect password. Try again.
          </p>
        ) : null}

        <button
          type="submit"
          disabled={!configured}
          className="inline-flex h-10 items-center justify-center rounded-md bg-[var(--color-accent)] px-4 text-sm font-medium text-white transition-colors hover:bg-[var(--color-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          Sign in
        </button>
      </form>
    </>
  );
}
