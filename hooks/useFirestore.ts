"use client";

import { useEffect, useState } from "react";
import { QueryConstraint, collection, onSnapshot, query } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export function useFirestore<T>(collectionName: string, constraints: QueryConstraint[] = []) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, collectionName), ...constraints);
    return onSnapshot(q, (snapshot) => {
      setData(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as T));
      setLoading(false);
    });
  }, [collectionName, constraints]);

  return { data, loading };
}
