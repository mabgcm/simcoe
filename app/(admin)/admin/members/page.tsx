import { MembersTable } from "@/components/admin/MembersTable";
import { getAdminDb } from "@/lib/firebase/admin";

/** Admin member management page. */
export default async function AdminMembersPage() {
  let members: Array<{
    uid: string;
    displayName: string;
    email: string;
    membershipType: string;
    membershipStatus: string;
    paymentStatus?: string;
  }> = [];

  try {
    const snapshot = await getAdminDb().collection("users").orderBy("joinedAt", "desc").get();
    members = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        uid: data.uid || doc.id,
        displayName: data.displayName || "",
        email: data.email || "",
        membershipType: data.membershipPlan || data.membershipType || "",
        membershipStatus: data.membershipStatus || "none",
        paymentStatus: data.paymentStatus
      };
    });
  } catch {
    members = [];
  }

  return (
    <section>
      <h1 className="font-heading text-4xl text-secondary">Üyeler</h1>
      <div className="mt-6">
        <MembersTable members={members} />
      </div>
    </section>
  );
}
