import Link from "next/link";
import { logout } from "./actions";
import { createClient } from "@/lib/supabase/server";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/sales/new", label: "Record sale" },
  { href: "/admin/reviews", label: "Reviews" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // The login page has no session yet — render it without the admin shell.
  if (!user) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-background md:flex">
      <aside className="border-b border-border bg-background-deep md:w-56 md:shrink-0 md:border-b-0 md:border-r">
        <div className="px-6 py-5">
          <p className="font-display text-lg tracking-[0.15em] text-gold">
            LUÀN
          </p>
          <p className="text-xs uppercase tracking-widest text-foreground-faint">
            Admin
          </p>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 text-sm md:flex-col md:overflow-visible md:pb-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-md px-3 py-2 text-foreground-muted hover:bg-surface hover:text-gold-light transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-border px-6 py-4">
          <p className="mb-2 truncate text-xs text-foreground-faint">
            {user.email}
          </p>
          <form action={logout}>
            <button
              type="submit"
              className="text-xs text-foreground-muted hover:text-gold"
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 px-6 py-8 md:px-10">{children}</main>
    </div>
  );
}