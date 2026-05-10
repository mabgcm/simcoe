import { cookies } from "next/headers";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";

export type CurrentAdmin = {
  uid: string;
  name: string;
  role: string;
};

/** Reads the current Firebase admin user from the existing session token cookie. */
export async function getCurrentAdmin(): Promise<CurrentAdmin | null> {
  const session = cookies().get("session")?.value;
  if (!session) return null;

  try {
    const decoded = await getAdminAuth().verifyIdToken(session);
    const userDoc = await getAdminDb().collection("users").doc(decoded.uid).get();
    const data = userDoc.data();
    const role = data?.role;
    if (role !== "admin" && role !== "super_admin") return null;

    return {
      uid: decoded.uid,
      name: data?.displayName || decoded.name || decoded.email || "Admin",
      role
    };
  } catch {
    return null;
  }
}
