"use client";

import { getAnalytics, isSupported } from "firebase/analytics";
import app from "@/lib/firebase/config";

export async function getFirebaseAnalytics() {
  if (!(await isSupported())) return null;
  return getAnalytics(app);
}
