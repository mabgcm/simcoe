import * as React from "react";
import { cn } from "@/lib/utils/cn";

/** Native select styled consistently with the form system. */
export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn("h-11 rounded-lg border bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary", props.className)} />;
}
