import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  clearSessionCookie,
  isAdminConfigured,
  isAuthenticated,
} from "@/lib/admin_auth";
import { connectMongo, isMongoConfigured } from "@/lib/mongodb";
import { ContactMessageModel } from "@/lib/models/ContactMessage";

export const dynamic = "force-dynamic";

type MessageRow = {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
};

async function loadMessages(): Promise<MessageRow[]> {
  await connectMongo();
  const docs = await ContactMessageModel.find()
    .sort({ createdAt: -1 })
    .lean();
  return docs.map((d) => ({
    id: String(d._id),
    name: d.name ?? "",
    email: d.email ?? "",
    message: d.message ?? "",
    read: Boolean(d.read),
    createdAt: d.createdAt
      ? new Date(d.createdAt as unknown as string).toISOString()
      : "",
  }));
}

export default async function AdminMessagesPage() {
  if (!isAdminConfigured() || !(await isAuthenticated())) {
    redirect("/admin/login");
  }

  if (!isMongoConfigured()) {
    return (
      <>
        <h1 className="text-3xl font-semibold tracking-tight">Messages</h1>
        <p className="mt-4 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-sm text-[var(--color-text-muted)]">
          MongoDB is not configured. Set <code className="font-mono">MONGODB_URI</code>{" "}
          in <code className="font-mono">.env</code> to view messages.
        </p>
      </>
    );
  }

  const messages = await loadMessages();
  const unreadCount = messages.filter((m) => !m.read).length;

  async function deleteMessage(id: string) {
    "use server";
    if (!(await isAuthenticated())) {
      redirect("/admin/login");
    }
    await connectMongo();
    await ContactMessageModel.deleteOne({ _id: id });
    revalidatePath("/admin/messages");
  }

  async function toggleRead(id: string, nextRead: boolean) {
    "use server";
    if (!(await isAuthenticated())) {
      redirect("/admin/login");
    }
    await connectMongo();
    await ContactMessageModel.updateOne(
      { _id: id },
      { $set: { read: nextRead } }
    );
    revalidatePath("/admin/messages");
  }

  async function logoutAction() {
    "use server";
    await clearSessionCookie();
    redirect("/admin/login");
  }

  return (
    <>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Messages</h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            {messages.length} total
            {unreadCount > 0 ? ` · ${unreadCount} unread` : ""}
          </p>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:underline underline-offset-4"
          >
            Sign out
          </button>
        </form>
      </div>

      {messages.length === 0 ? (
        <p className="mt-12 italic text-[var(--color-text-muted)]">
          No messages yet.
        </p>
      ) : (
        <ul className="mt-10 space-y-8">
          {messages.map((m) => {
            const date = m.createdAt
              ? new Date(m.createdAt).toLocaleString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "";
            return (
              <li
                key={m.id}
                className="border-l-2 pl-4"
                style={{
                  borderColor: m.read
                    ? "var(--color-border)"
                    : "var(--color-accent)",
                }}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <span
                        className={
                          m.read
                            ? "font-medium text-[var(--color-text-secondary)]"
                            : "font-medium text-[var(--color-text-primary)]"
                        }
                      >
                        {m.name}
                      </span>
                      <a
                        href={`mailto:${m.email}`}
                        className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] hover:underline underline-offset-4"
                      >
                        {m.email}
                      </a>
                    </div>
                    <div className="mt-0.5 font-mono text-xs text-[var(--color-text-muted)]">
                      {date}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <form action={toggleRead.bind(null, m.id, !m.read)}>
                      <button
                        type="submit"
                        className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:underline underline-offset-4"
                      >
                        {m.read ? "Mark unread" : "Mark read"}
                      </button>
                    </form>
                    <form action={deleteMessage.bind(null, m.id)}>
                      <button
                        type="submit"
                        className="text-xs text-red-600 hover:underline underline-offset-4"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm text-[var(--color-text-secondary)]">
                  {m.message}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
