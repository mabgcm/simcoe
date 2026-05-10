"use client";

import { create } from "zustand";
import type { MembershipType } from "@/types";

type MembershipState = {
  selectedType: MembershipType;
  setSelectedType: (type: MembershipType) => void;
};

export const useMembership = create<MembershipState>((set) => ({
  selectedType: "individual",
  setSelectedType: (type) => set({ selectedType: type })
}));
