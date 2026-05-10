import * as React from "react";
import { cn } from "@/lib/utils/cn";

/** Compact label used for categories, tiers and statuses. */
export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("inline-flex items-center rounded-md bg-muted px-2.5 py-1 text-xs font-semibold text-secondary", className)} {...props} />;
}
