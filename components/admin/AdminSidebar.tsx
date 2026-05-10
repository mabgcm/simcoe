import Link from "next/link";
import { BarChart3, Bell, Calendar, CreditCard, Clock, FileText, Home, Newspaper, Users } from "lucide-react";
import { getMessages, getRequestLocale } from "@/i18n/server";
import { getAdminDb } from "@/lib/firebase/admin";

async function getBadgeCounts() {
  try {
    const db = getAdminDb();
    const [pendingSnap, membersSnap] = await Promise.all([
      db.collection("news").where("status", "==", "pending_admin").get(),
      db.collection("users").where("membershipStatus", "==", "pending_payment").get()
    ]);
    return {
      pending: pendingSnap.size,
      members: membersSnap.size
    };
  } catch {
    return { pending: 0, members: 0 };
  }
}

function Badge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-bold leading-none text-white">
      {count > 99 ? "99+" : count}
    </span>
  );
}

/** Admin dashboard sidebar navigation with live badge counts. */
export async function AdminSidebar() {
  const t = getMessages(getRequestLocale()).admin;
  const counts = await getBadgeCounts();

  const adminLinks = [
    { href: "/admin",                  label: t.overview,     icon: Home,      badge: 0 },
    { href: "/admin/content/new",      label: "Yeni İçerik",  icon: FileText,  badge: 0 },
    { href: "/admin/pending",          label: t.pending,      icon: Clock,     badge: counts.pending },
    { href: "/admin/news",             label: t.news,         icon: Newspaper, badge: 0 },
    { href: "/admin/announcements",    label: t.announcements,icon: Bell,      badge: 0 },
    { href: "/admin/events",           label: t.events,       icon: Calendar,  badge: 0 },
    { href: "/admin/members",          label: t.members,      icon: Users,     badge: counts.members },
    { href: "/admin/newcomers-guide",  label: t.guide,        icon: FileText,  badge: 0 },
    { href: "/admin/payments",         label: t.payments,     icon: CreditCard,badge: 0 },
    { href: "/admin/analytics",        label: t.analytics,    icon: BarChart3, badge: 0 },
  ];

  return (
    <aside className="border-r bg-white p-4 lg:min-h-[calc(100vh-4rem)]">
      <h2 className="px-3 font-heading text-2xl text-secondary">STA Admin</h2>
      <nav className="mt-6 grid gap-1">
        {adminLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-secondary hover:bg-muted"
            >
              <Icon className="h-4 w-4 shrink-0 text-primary" />
              <span className="flex-1">{link.label}</span>
              <Badge count={link.badge} />
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
