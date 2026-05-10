import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";
import { MemberPostForm } from "@/components/member/MemberPostForm";

export default async function NewMemberPostPage() {
  const session = cookies().get("session")?.value;
  if (!session) redirect("/login");

  let authorName = "Üye";
  let authorPhotoURL = "";

  try {
    const decoded = await getAdminAuth().verifySessionCookie(session);
    const snap = await getAdminDb().collection("users").doc(decoded.uid).get();
    const data = snap.data();
    if (data?.membershipStatus !== "active") redirect("/portal/profile?new=1");
    authorName = (data?.displayName as string | undefined) || decoded.name || "Üye";
    authorPhotoURL = (data?.photoURL as string | undefined) || "";
  } catch {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <MemberPostForm authorName={authorName} authorPhotoURL={authorPhotoURL} />
    </div>
  );
}
