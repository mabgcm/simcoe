import { readFileSync } from "node:fs";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

function loadEnvFile(path) {
  try {
    const content = readFileSync(path, "utf8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const index = trimmed.indexOf("=");
      if (index === -1) continue;
      const key = trimmed.slice(0, index);
      const value = trimmed.slice(index + 1).replace(/^"|"$/g, "");
      process.env[key] ||= value;
    }
  } catch {
    // .env.local is optional when env vars are provided by the shell.
  }
}

function requireEnv(key) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`${key} is required. Add it to .env.local or export it in your shell.`);
  }
  return value;
}

function getArg(name) {
  const prefix = `--${name}=`;
  return process.argv.find((arg) => arg.startsWith(prefix))?.slice(prefix.length);
}

loadEnvFile(".env.local");

const email = getArg("email");
const password = getArg("password");
const displayName = getArg("name") || "STA Admin";

if (!email || !password) {
  throw new Error("Usage: npm run admin:seed -- --email=admin@example.com --password='StrongPassword123' --name='Admin Name'");
}

const privateKey = requireEnv("FIREBASE_ADMIN_PRIVATE_KEY").replace(/\\n/g, "\n");

const app =
  getApps()[0] ||
  initializeApp({
    credential: cert({
      projectId: requireEnv("FIREBASE_ADMIN_PROJECT_ID"),
      clientEmail: requireEnv("FIREBASE_ADMIN_CLIENT_EMAIL"),
      privateKey
    })
  });

const auth = getAuth(app);
const db = getFirestore(app);

let user;
try {
  user = await auth.getUserByEmail(email);
  await auth.updateUser(user.uid, { displayName });
} catch (error) {
  if (error?.code !== "auth/user-not-found") throw error;
  user = await auth.createUser({ email, password, displayName, emailVerified: true });
}

await db.collection("users").doc(user.uid).set(
  {
    uid: user.uid,
    email,
    displayName,
    role: "admin",
    membershipStatus: "active",
    membershipPlan: "individual",
    membershipType: "individual",
    membershipExpiry: null,
    updatedAt: FieldValue.serverTimestamp(),
    joinedAt: FieldValue.serverTimestamp()
  },
  { merge: true }
);

console.log(`Admin user ready: ${email}`);
console.log(`Firestore document: users/${user.uid}`);
