"use client";

import { Copy } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils/cn";

export type PaymentMethod = "card" | "interac";

const INTERAC_EMAIL = process.env.NEXT_PUBLIC_INTERAC_EMAIL || "payments@simcoeturkish.ca";

type Props = {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
  /** Extra details shown in the Interac panel (e.g. amount label). */
  interacNote?: string;
  /** Footer note shown at the bottom of the Interac panel. */
  interacFooter?: string;
};

/** Reusable credit-card / Interac e-Transfer payment method picker. */
export function PaymentMethodSelector({ value, onChange, interacNote, interacFooter }: Props) {
  function copy() {
    navigator.clipboard.writeText(INTERAC_EMAIL).then(() => toast.success("E-posta kopyalandı.")).catch(() => {});
  }

  return (
    <div className="grid gap-3">
      <p className="text-sm font-semibold text-secondary">Ödeme yöntemi</p>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onChange("card")}
          className={cn(
            "flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-sm font-semibold transition-colors",
            value === "card"
              ? "border-primary bg-primary/5 text-primary"
              : "border-border text-secondary hover:border-primary/40"
          )}
        >
          <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <path d="M2 10h20" />
            <path d="M6 15h4" strokeLinecap="round" />
          </svg>
          Kredi Kartı
        </button>

        <button
          type="button"
          onClick={() => onChange("interac")}
          className={cn(
            "flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-sm font-semibold transition-colors",
            value === "interac"
              ? "border-primary bg-primary/5 text-primary"
              : "border-border text-secondary hover:border-primary/40"
          )}
        >
          {/* Interac wordmark-style icon */}
          <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="9" />
            <path d="M8 12h8M12 8v8" strokeLinecap="round" />
          </svg>
          Interac
        </button>
      </div>

      {value === "interac" && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
          <p className="text-sm font-semibold text-secondary">Interac e-Transfer talimatları</p>
          <ol className="mt-2 grid gap-1.5 text-sm text-muted-foreground list-decimal list-inside">
            <li>Bankanızın uygulamasından e-Transfer gönderin.</li>
            <li>
              Alıcı e-posta:
              <button
                type="button"
                onClick={copy}
                className="ml-1.5 inline-flex items-center gap-1 font-semibold text-primary hover:underline"
              >
                {INTERAC_EMAIL}
                <Copy className="h-3.5 w-3.5" />
              </button>
            </li>
            <li>Açıklama/not alanına <strong>adınızı</strong> ve ödeme türünü yazın.</li>
            {interacNote && <li>{interacNote}</li>}
          </ol>
          {interacFooter && (
            <p className="mt-3 rounded-lg bg-white px-3 py-2 text-xs text-muted-foreground">
              {interacFooter}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
