import {
  DocumentData,
  QueryConstraint,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export async function getById<T>(collectionName: string, id: string) {
  const snapshot = await getDoc(doc(db, collectionName, id));
  return snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as T) : null;
}

export async function listCollection<T>(collectionName: string, constraints: QueryConstraint[] = []) {
  const snapshot = await getDocs(query(collection(db, collectionName), ...constraints));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as T);
}

export async function listPublished<T extends DocumentData>(collectionName: string, max = 9) {
  return listCollection<T>(collectionName, [where("status", "==", "published"), orderBy("publishedAt", "desc"), limit(max)]);
}

export async function createDocument<T extends Record<string, unknown>>(collectionName: string, data: T) {
  return addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
}

export async function upsertDocument<T extends Record<string, unknown>>(collectionName: string, id: string, data: T) {
  return setDoc(
    doc(db, collectionName, id),
    {
      ...data,
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );
}

export async function updateDocument<T extends Record<string, unknown>>(collectionName: string, id: string, data: T) {
  return updateDoc(doc(db, collectionName, id), {
    ...data,
    updatedAt: serverTimestamp()
  });
}

export async function deleteDocument(collectionName: string, id: string) {
  return deleteDoc(doc(db, collectionName, id));
}
