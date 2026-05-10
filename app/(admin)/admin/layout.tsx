import { AdminSidebar } from "@/components/admin/AdminSidebar";

/** Admin section layout with sidebar and content region. */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid lg:grid-cols-[260px_1fr]">
      <AdminSidebar />
      <div className="min-w-0 p-4 sm:p-6 lg:p-8">{children}</div>
    </div>
  );
}
