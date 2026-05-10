import Link from "next/link";
import { BarChart3, Calendar, CreditCard, FileText, Home, Newspaper, Users } from "lucide-react";
import { getMessages, getRequestLocale } from "@/i18n/server";

/** Admin dashboard sidebar navigation. */
export function AdminSidebar() {
  const t = getMessages(getRequestLocale()).admin;
  const adminLinks = [
    { href: "/admin", label: t.overview, icon: Home },
    { href: "/admin/content/new", label: "Yeni İçerik", icon: FileText },
    { href: "/admin/news", label: t.news, icon: Newspaper },
    { href: "/admin/events", label: t.events, icon: Calendar },
    { href: "/admin/members", label: t.members, icon: Users },
    { href: "/admin/newcomers-guide", label: t.guide, icon: FileText },
    { href: "/admin/payments", label: t.payments, icon: CreditCard },
    { href: "/admin/analytics", label: t.analytics, icon: BarChart3 }
  ];

  return (
    <aside className="border-r bg-white p-4 lg:min-h-[calc(100vh-4rem)]">
      <h2 className="px-3 font-heading text-2xl text-secondary">STA Admin</h2>
      <nav className="mt-6 grid gap-1">
        {adminLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link key={link.href} href={link.href} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-secondary hover:bg-muted">
              <Icon className="h-4 w-4 text-primary" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
