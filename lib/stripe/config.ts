import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_missing", {
  apiVersion: "2025-02-24.acacia"
});

export const membershipPriceIds = {
  individual: process.env.STRIPE_PRICE_INDIVIDUAL || "",
  family: process.env.STRIPE_PRICE_FAMILY || "",
  student: process.env.STRIPE_PRICE_STUDENT || "",
  corporate: process.env.STRIPE_PRICE_CORPORATE || ""
} as const;
