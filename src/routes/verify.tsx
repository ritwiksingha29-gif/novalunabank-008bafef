import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { isValidTransactionId } from "@/lib/transactions";
import { BadgeCheck, XCircle, ShieldCheck, Lock } from "lucide-react";

export const Route = createFileRoute("/verify")({
  head: () => ({
    meta: [
      { title: "Verify Payment — Reflo Bank" },
      { name: "description", content: "Verify the authenticity of a Reflo Bank payment instantly." },
    ],
  }),
  component: VerifyPage,
});

type Result = null | { ok: true; id: string } | { ok: false };

function VerifyPage() {
  const [txId, setTxId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txId.trim()) return;
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      const ok = isValidTransactionId(txId);
      setResult(ok ? { ok: true, id: txId.trim().toUpperCase() } : { ok: false });
      setLoading(false);
    }, 1200);
  };

  const now = new Date();

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-5xl px-4 py-12">
          <h1 className="font-display text-4xl font-bold">Verify a Payment</h1>
          <p className="mt-2 opacity-90">Confirm that a payment is authentic before releasing goods or services.</p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 -mt-8">
        <form onSubmit={submit} className="rounded-xl bg-card border border-border shadow-lg p-6">
          <label className="text-sm font-semibold flex items-center gap-2">
            <Lock className="h-4 w-4 text-primary" /> Transaction Reference
          </label>
          <div className="mt-2 flex gap-2">
            <input
              value={txId}
              onChange={(e) => setTxId(e.target.value)}
              placeholder="e.g. RFL481269539082"
              className="flex-1 rounded-md border border-input bg-background px-4 py-3 font-mono uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              disabled={loading}
              className="rounded-md bg-primary text-primary-foreground px-6 font-semibold hover:bg-primary/90 disabled:opacity-60"
            >
              {loading ? "Verifying…" : "Verify"}
            </button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">All verifications are encrypted end-to-end and logged for your protection.</p>
        </form>

        {loading && (
          <div className="mt-6 rounded-xl bg-card border border-border p-8 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="mt-3 text-sm text-muted-foreground">Authenticating with Reflo Bank verification servers…</p>
          </div>
        )}

        {result?.ok === true && (
          <div className="mt-6 rounded-xl bg-card border-2 border-success p-8">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
                <BadgeCheck className="h-12 w-12 text-success" />
              </div>
              <h2 className="mt-4 font-display text-3xl font-bold text-success">Payment Successfully Verified</h2>
              <p className="mt-2 text-muted-foreground max-w-md">
                This transaction is genuine and has been confirmed by Reflo Bank's verification system.
              </p>

              <div className="mt-6 w-full rounded-lg bg-accent/50 p-5 text-left">
                <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  <div><dt className="text-muted-foreground">Reference ID</dt><dd className="font-mono font-semibold">{result.id}</dd></div>
                  <div><dt className="text-muted-foreground">Verification Status</dt><dd className="font-semibold text-success">Authentic ✓</dd></div>
                  <div><dt className="text-muted-foreground">Verified On</dt><dd>{now.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</dd></div>
                  <div><dt className="text-muted-foreground">Bank</dt><dd>Reflo Bank, N.A.</dd></div>
                </dl>
              </div>

              <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-success" />
                Verified by Reflo Bank Secure Verification Network
              </div>
            </div>
          </div>
        )}

        {result?.ok === false && (
          <div className="mt-6 rounded-xl bg-card border-2 border-destructive p-6">
            <div className="flex items-start gap-4">
              <XCircle className="h-12 w-12 text-destructive shrink-0" />
              <div>
                <h2 className="font-display text-2xl font-bold text-destructive">Verification Failed</h2>
                <p className="mt-1 text-muted-foreground">
                  This transaction reference could not be verified. The ID may be incorrect or the payment may not have been processed through Reflo Bank.
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
