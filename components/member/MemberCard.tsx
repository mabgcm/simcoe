import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/** Member profile summary card for portal views. */
export function MemberCard({ name, status }: { name: string; status: string }) {
  return (
    <Card>
      <CardContent className="p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Üye Profili</p>
        <h2 className="mt-2 font-heading text-3xl text-secondary">{name}</h2>
        <Badge className="mt-4">{status}</Badge>
      </CardContent>
    </Card>
  );
}
