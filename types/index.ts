import type { Timestamp } from "firebase/firestore";

export type UserRole = "member" | "admin" | "super_admin";
export type MembershipStatus = "active" | "expired" | "pending" | "pending_payment" | "none";
export type MembershipType = "individual" | "family" | "student" | "corporate";

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  membershipStatus: MembershipStatus;
  membershipType: MembershipType | null;
  membershipExpiry: Timestamp | null;
  stripeCustomerId?: string;
  phone?: string;
  address?: string;
  joinedAt: Timestamp;
  updatedAt: Timestamp;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  author: string;
  authorId: string;
  status: "draft" | "published";
  publishedAt: Timestamp | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  viewCount: number;
}

export interface Update extends Omit<NewsArticle, "id"> {
  id: string;
  type: "announcement" | "update";
  pinned: boolean;
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  conditions: string;
  location: string;
  address: string;
  startDate: Timestamp;
  endDate: Timestamp;
  coverImage: string;
  gallery: string[];
  category: string;
  capacity: number | null;
  registrationRequired: boolean;
  registrationDeadline: Timestamp | null;
  price: number;
  status: "upcoming" | "ongoing" | "past" | "cancelled";
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  userEmail: string;
  registeredAt: Timestamp;
  paymentStatus: "free" | "paid" | "pending";
  ticketCode: string;
}

export interface GuideEntry {
  id: string;
  title: string;
  slug: string;
  category: "housing" | "health" | "education" | "employment" | "culture" | "legal";
  content: string;
  language: "tr" | "en";
  order: number;
  pdfUrl?: string;
  updatedAt: Timestamp;
  createdAt: Timestamp;
}

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorPhoto: string;
  content: string;
  imageUrl?: string;
  likes: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  status: "active" | "hidden";
}

export interface Membership {
  id: string;
  userId: string;
  type: MembershipType;
  status: "active" | "expired" | "cancelled";
  stripeSubscriptionId?: string;
  stripePaymentIntentId?: string;
  startDate: Timestamp;
  expiryDate: Timestamp;
  amount: number;
  autoRenew: boolean;
  createdAt: Timestamp;
}

export interface Donation {
  id: string;
  userId?: string;
  donorName: string;
  donorEmail: string;
  amount: number;
  currency: "cad";
  stripePaymentIntentId: string;
  receiptUrl?: string;
  message?: string;
  isRecurring: boolean;
  recurringInterval?: "month" | "year";
  createdAt: Timestamp;
  status: "completed" | "pending" | "refunded";
}

export interface Sponsor {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl: string;
  tier: "platinum" | "gold" | "silver" | "bronze";
  order: number;
  active: boolean;
  startDate: Timestamp;
  endDate: Timestamp | null;
  createdAt: Timestamp;
}
