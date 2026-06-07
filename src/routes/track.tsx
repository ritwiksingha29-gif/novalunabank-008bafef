import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { findTransactionById, type TransactionRecord } from "@/lib/transactions";
import { CheckCircle2, XCircle, Search, Clock, ArrowRight, Building2, AlertTriangle, Loader2, PauseCircle } from "lucide-react";

type StatusTone = {
  tone: "success" | "info" | "warning" | "destructive";
  title: string;
  message: string;
  Icon: typeof CheckCircle2;
};

const statusMeta = (status: string): StatusTone => {
  const s = status.toLowerCase();
  if (s.startsWith("failed"))
    return {
      tone: "destructive",
      title: "Payment Failed",
      message: "This transaction could not be completed and has been reversed to the sender's account. Please contact Novaluna Bank support if funds are not visible within 2 working hours.",
      Icon: XCircle,
    };
  if (s.startsWith("on hold"))
    return {
      tone: "warning",
      title: "Payment On Hold — Compliance Review",
      message: "Your transaction is temporarily held by our compliance team for routine verification. No action is required from the beneficiary at this time.",
      Icon: PauseCircle,
    };
  if (s.startsWith("in progress"))
    return {
      tone: "info",
      title: "Payment In Progress",
      message: "Your transaction is currently being reviewed by Novaluna Bank. Settlement to the beneficiary account is expected within 6 working hours of approval.",
      Icon: Loader2,
    };
  if (s.startsWith("successful"))
    return {
      tone: "success",
      title: "Payment Credited Successfully",
      message: "Your transaction has been completed and credited to the beneficiary account by Novaluna Bank.",
      Icon: CheckCircle2,
    };
  return {
    tone: "success",
    title: "Payment Successfully Processed",
    message: "Your transaction has been processed by Novaluna Bank and will be credited to the beneficiary account within 6 working hours.",
    Icon: CheckCircle2,
  };
};

const toneClasses = {
  success: { border: "border-success", text: "text-success", bgStep: "bg-success text-success-foreground" },
  info: { border: "border-primary", text: "text-primary", bgStep: "bg-primary text-primary-foreground" },
  warning: { border: "border-amber-500", text: "text-amber-600", bgStep: "bg-amber-500 text-white" },
  destructive: { border: "border-destructive", text: "text-destructive", bgStep: "bg-destructive text-destructive-foreground" },
} as const;

export const Route = createFileRoute("/track")({
  head: () => ({
    meta: [
      { title: "Track Transaction — Novaluna Bank" },
      { name: "description", content: "Track the status of your Novaluna Bank transaction in real time." },
    ],
  }),
  component: TrackPage,
});

type Result = null | { ok: true; tx: TransactionRecord } | { ok: false };

function TrackPage() {
  const [txId, setTxId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!txId.trim()) return;
    setLoading(true);
    setResult(null);
    const start = Date.now();
    const tx = await findTransactionById(txId);
    const elapsed = Date.now() - start;
    if (elapsed < 1200) await new Promise((r) => setTimeout(r, 1200 - elapsed));
    setResult(tx ? { ok: true, tx } : { ok: false });
    setLoading(false);
  };

  const fmt = (d: string | Date) =>
    new Date(d).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });

  const fmtAmount = (n: number, c: string) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: c || "USD" }).format(n);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-5xl px-4 py-12">
          <h1 className="font-display text-4xl font-bold">Track Your Transaction</h1>
          <p className="mt-2 opacity-90">Enter your Novaluna transaction reference to view live status.</p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 -mt-8">
        <form onSubmit={submit} className="rounded-xl bg-card border border-border shadow-lg p-6">
          <label className="text-sm font-semibold">Transaction ID</label>
          <div className="mt-2 flex gap-2">
            <input
              value={txId}
              onChange={(e) => setTxId(e.target.value)}
              placeholder="e.g. NVL316053050400"
              className="flex-1 rounded-md border border-input bg-background px-4 py-3 font-mono uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              disabled={loading}
              className="rounded-md bg-primary text-primary-foreground px-6 font-semibold hover:bg-primary/90 disabled:opacity-60 flex items-center gap-2"
            >
              {loading ? "Checking…" : <><Search className="h-4 w-4" /> Track</>}
            </button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Your transaction ID was provided in the SMS / email receipt at the time of payment.</p>
        </form>

        {loading && (
          <div className="mt-6 rounded-xl bg-card border border-border p-8 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="mt-3 text-sm text-muted-foreground">Securely contacting Novaluna Bank settlement network…</p>
          </div>
        )}

        {result?.ok === true && (() => {
          const meta = statusMeta(result.tx.status);
          const tc = toneClasses[meta.tone];
          const StatusIcon = meta.Icon;
          return (
          <div className="mt-6 space-y-4">
            <div className={`rounded-xl bg-card border-2 ${tc.border} p-6`}>
              <div className="flex items-start gap-4">
                <StatusIcon className={`h-12 w-12 ${tc.text} shrink-0`} />
                <div>
                  <h2 className={`font-display text-2xl font-bold ${tc.text}`}>{meta.title}</h2>
                  <p className="mt-1 text-muted-foreground">{meta.message}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-card border border-border p-6">
              <h3 className="font-semibold text-lg">Transaction Details</h3>
              <dl className="mt-4 grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <div><dt className="text-muted-foreground">Reference ID</dt><dd className="font-mono font-semibold">{result.tx.transaction_id}</dd></div>
                <div><dt className="text-muted-foreground">Status</dt><dd className={`font-semibold ${tc.text}`}>{result.tx.status}</dd></div>
                <div><dt className="text-muted-foreground">Amount</dt><dd className="font-semibold">{fmtAmount(Number(result.tx.amount), result.tx.currency)}</dd></div>
                <div><dt className="text-muted-foreground">Initiated / Saved</dt><dd>{fmt(result.tx.saved_at)}</dd></div>
                <div><dt className="text-muted-foreground">Sender</dt><dd>{result.tx.sender_name || "—"}{result.tx.sender_bank ? ` · ${result.tx.sender_bank}` : ""}</dd></div>
                <div><dt className="text-muted-foreground">Beneficiary</dt><dd>{result.tx.beneficiary_name || "—"}</dd></div>
                <div><dt className="text-muted-foreground">Beneficiary A/C</dt><dd className="font-mono">{result.tx.beneficiary_account || "—"}</dd></div>
                <div><dt className="text-muted-foreground">Beneficiary Bank</dt><dd>{result.tx.beneficiary_bank}</dd></div>
                <div><dt className="text-muted-foreground">Channel</dt><dd>IMPS / RTGS — Novaluna Settlement Network</dd></div>
                <div><dt className="text-muted-foreground">Last Updated</dt><dd>{fmt(result.tx.updated_at)}</dd></div>
              </dl>
              {result.tx.notes && (
                <div className="mt-4 rounded-md bg-accent/50 p-3 text-sm">
                  <span className="font-semibold">Bank Note:</span> {result.tx.notes}
                </div>
              )}
            </div>

            <div className="rounded-xl bg-card border border-border p-6">
              <h3 className="font-semibold text-lg mb-4">Settlement Timeline</h3>
              <ol className="space-y-4">
                {[
                  { t: "Payment Initiated", time: result.tx.initiated_at, icon: ArrowRight },
                  { t: "Verified by Novaluna Bank", time: result.tx.verified_at, icon: CheckCircle2 },
                  { t: "Processed at Clearing House", time: result.tx.processed_at, icon: Building2 },
                  {
                    t: meta.tone === "destructive" ? "Reversed to Sender Account" : "Credit to Beneficiary Account",
                    time: result.tx.credited_at,
                    icon: meta.tone === "destructive" ? AlertTriangle : Clock,
                    pendingLabel: meta.tone === "destructive"
                      ? "Transaction failed — funds reversed"
                      : meta.tone === "warning"
                      ? "Awaiting compliance clearance"
                      : "Within 6 working hours",
                  },
                ].map((s, i) => {
                  const done = !!s.time;
                  const isFailedPending = !done && meta.tone === "destructive" && i === 3;
                  const stepClass = done
                    ? tc.bgStep
                    : isFailedPending
                    ? "bg-destructive text-destructive-foreground"
                    : "bg-muted text-muted-foreground";
                  const labelClass = isFailedPending ? "font-medium text-destructive" : done ? "font-medium" : "font-medium text-muted-foreground";
                  return (
                    <li key={i} className="flex items-start gap-3">
                      <div className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-full ${stepClass}`}>
                        <s.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className={labelClass}>{s.t}</div>
                        <div className={`text-xs ${isFailedPending ? "text-destructive" : "text-muted-foreground"}`}>
                          {done ? fmt(s.time as string) : (s.pendingLabel ?? "Pending")}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
          );
        })()}
            </div>

            <div className="rounded-xl bg-card border border-border p-6">
              <h3 className="font-semibold text-lg mb-4">Settlement Timeline</h3>
              <ol className="space-y-4">
                {[
                  { t: "Payment Initiated", time: result.tx.initiated_at, icon: ArrowRight },
                  { t: "Verified by Novaluna Bank", time: result.tx.verified_at, icon: CheckCircle2 },
                  { t: "Processed at Clearing House", time: result.tx.processed_at, icon: Building2 },
                  { t: "Credit to Beneficiary Account", time: result.tx.credited_at, icon: Clock, pendingLabel: "Within 6 working hours" },
                ].map((s, i) => {
                  const done = !!s.time;
                  return (
                    <li key={i} className="flex items-start gap-3">
                      <div className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-full ${done ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"}`}>
                        <s.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className={`font-medium ${done ? "" : "text-muted-foreground"}`}>{s.t}</div>
                        <div className="text-xs text-muted-foreground">
                          {done ? fmt(s.time as string) : (s.pendingLabel ?? "Pending")}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        )}

        {result?.ok === false && (
          <div className="mt-6 rounded-xl bg-card border-2 border-destructive p-6">
            <div className="flex items-start gap-4">
              <XCircle className="h-12 w-12 text-destructive shrink-0" />
              <div>
                <h2 className="font-display text-2xl font-bold text-destructive">Transaction Not Found</h2>
                <p className="mt-1 text-muted-foreground">
                  We couldn't locate a transaction with this reference ID in our system. Please double-check the ID and try again, or contact Novaluna Bank support at +1 1800-546-4002.
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      <SiteFooter />
    </div>
  );
}
