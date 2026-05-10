export function authErrorKey(error: unknown) {
  const code = typeof error === "object" && error && "code" in error ? String((error as { code?: string }).code) : "";
  if (code === "auth/invalid-credential" || code === "auth/user-not-found" || code === "auth/wrong-password") return "invalidCredential";
  if (code === "auth/email-already-in-use") return "emailInUse";
  if (code === "auth/weak-password") return "weakPassword";
  return "generic";
}
