"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { updateProfile } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProfilePhotoUploader } from "@/components/member/ProfilePhotoUploader";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase/config";
import { cn } from "@/lib/utils/cn";

/** Editable member profile form with Firebase Storage photo upload. */
export function PortalProfileForm() {
  const t = useTranslations("portal");
  const common = useTranslations("common");
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const isNew = searchParams.get("new") === "1";
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [phone, setPhone] = useState("");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [membershipStatus, setMembershipStatus] = useState<string>("pending_payment");
  const [membershipType, setMembershipType] = useState<string>("individual");
  const [payLoading, setPayLoading] = useState(false);
  const missing = useMemo(
    () => ({
      displayName: !displayName.trim(),
      phone: !phone.trim(),
      photoURL: !photoURL.trim()
    }),
    [displayName, phone, photoURL]
  );

  useEffect(() => {
    async function loadProfile() {
      if (!user) return;
      const snapshot = await getDoc(doc(db, "users", user.uid));
      const data = snapshot.data();
      setDisplayName((data?.displayName as string | undefined) || user.displayName || "");
      setPhone((data?.phone as string | undefined) || "");
      setPhotoURL((data?.photoURL as string | undefined) || user.photoURL || "");
      setMembershipStatus((data?.membershipStatus as string | undefined) || "pending_payment");
      setMembershipType((data?.membershipType as string | undefined) || "individual");
    }
    void loadProfile();
  }, [user]);

  async function handlePay() {
    setPayLoading(true);
    try {
      const response = await fetch("/api/membership/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ membershipType, billingCycle: "year" })
      });
      const data = await response.json() as { url?: string; error?: string };
      if (data.url) window.location.href = data.url;
      else toast.error(data.error || "Ödeme başlatılamadı.");
    } finally {
      setPayLoading(false);
    }
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;
    await setDoc(doc(db, "users", user.uid), { displayName, phone, photoURL, updatedAt: serverTimestamp() }, { merge: true });
    if (user.displayName !== displayName || user.photoURL !== photoURL) {
      await updateProfile(user, { displayName, photoURL });
    }
    toast.success(t("saved"));
  }

  async function handlePhotoUploaded(url: string) {
    setPhotoURL(url);
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-heading text-5xl text-secondary">{t("profile")}</h1>

      {(isNew || membershipStatus === "pending_payment") && (
        <div className="mt-4 rounded-lg border border-primary/30 bg-primary/5 p-4">
          <p className="font-semibold text-secondary">
            {isNew ? "Hoş geldiniz! Profilinizi tamamlayın ve üyelik ücretinizi ödeyin." : "Üyelik ücretiniz henüz ödenmedi."}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Bireysel üyelik: <strong>$30/yıl</strong> — Ödeme tamamlanana kadar bazı özellikler kısıtlıdır.
          </p>
          <Button className="mt-3" size="sm" onClick={handlePay} disabled={payLoading}>
            {payLoading ? "Yönlendiriliyor..." : "Üyelik Ücretini Öde →"}
          </Button>
        </div>
      )}

      {(missing.displayName || missing.phone || missing.photoURL) ? (
        <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-800">{t("missingInfo")}</p>
      ) : null}
      <form className="mt-8 grid gap-4 rounded-lg border bg-white p-6 shadow-sm" onSubmit={save}>
        <div className={cn("rounded-lg border p-4", missing.photoURL ? "border-amber-300 bg-amber-50" : "border-transparent")}>
          <p className="mb-3 text-sm font-semibold text-secondary">{t("photo")}</p>
          {photoURL ? <Image src={photoURL} alt={t("photo")} width={96} height={96} className="mb-3 h-24 w-24 rounded-lg object-cover" unoptimized /> : null}
          <ProfilePhotoUploader onUploaded={handlePhotoUploaded} label={t("uploadPhoto")} />
          {missing.photoURL ? <p className="mt-2 text-xs font-semibold text-amber-700">{t("requiredField")}</p> : null}
        </div>
        <div>
          <Input className={cn(missing.displayName && "border-amber-400 bg-amber-50 focus-visible:ring-amber-500")} placeholder={common("name")} value={displayName} onChange={(event) => setDisplayName(event.target.value)} />
          {missing.displayName ? <p className="mt-1 text-xs font-semibold text-amber-700">{t("requiredField")}</p> : null}
        </div>
        <div>
          <Input className={cn(missing.phone && "border-amber-400 bg-amber-50 focus-visible:ring-amber-500")} placeholder={common("phone")} value={phone} onChange={(event) => setPhone(event.target.value)} />
          {missing.phone ? <p className="mt-1 text-xs font-semibold text-amber-700">{t("requiredField")}</p> : null}
        </div>
        <Button>{t("updateProfile")}</Button>
      </form>
    </section>
  );
}
