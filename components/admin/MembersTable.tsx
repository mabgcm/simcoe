"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/DataTable";
import { cn } from "@/lib/utils/cn";

type AdminMember = {
  uid: string;
  displayName: string;
  email: string;
  membershipType: string;
  membershipStatus: string;
  paymentStatus?: string;
};

function statusLabel(status: string) {
  if (status === "pending_payment") return "Onay bekliyor";
  if (status === "active") return "Aktif";
  if (status === "expired") return "Süresi doldu";
  if (status === "pending") return "Beklemede";
  return "Yok";
}

/** Admin members table with manual payment approval action. */
export function MembersTable({ members }: { members: AdminMember[] }) {
  const router = useRouter();
  const [approvingUid, setApprovingUid] = useState<string | null>(null);

  async function approve(uid: string) {
    setApprovingUid(uid);
    const response = await fetch(`/api/admin/members/${uid}/approve`, { method: "POST" });
    setApprovingUid(null);

    if (!response.ok) {
      toast.error("Üye onaylanamadı.");
      return;
    }

    toast.success("Üyelik aktif hale getirildi.");
    router.refresh();
  }

  return (
    <DataTable
      columns={["Ad", "E-posta", "Plan", "Üyelik Durumu", "Ödeme", "İşlem"]}
      rows={members.map((member) => {
        const pending = member.membershipStatus === "pending_payment";
        return {
          Ad: member.displayName || "-",
          "E-posta": member.email || "-",
          Plan: member.membershipType || "-",
          "Üyelik Durumu": (
            <Badge className={cn(pending && "bg-amber-100 text-amber-800", member.membershipStatus === "active" && "bg-green-100 text-green-800")}>
              {statusLabel(member.membershipStatus)}
            </Badge>
          ),
          Ödeme: pending ? <Badge className="bg-amber-100 text-amber-800">Ödeme onayı bekliyor</Badge> : <Badge>{member.paymentStatus || "Tamam"}</Badge>,
          İşlem: pending ? (
            <Button size="sm" onClick={() => approve(member.uid)} disabled={approvingUid === member.uid}>
              <CheckCircle2 className="h-4 w-4" />
              {approvingUid === member.uid ? "Onaylanıyor" : "Ödemeyi Onayla"}
            </Button>
          ) : (
            <span className="text-sm text-muted-foreground">-</span>
          )
        };
      })}
    />
  );
}
