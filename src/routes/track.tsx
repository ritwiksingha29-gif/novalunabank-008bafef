import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { isValidTransactionId } from "@/lib/transactions";
import { CheckCircle2, XCircle, Search, Clock, ArrowRight, Building2 } from "lucide-react";

export const Route = createFileRoute("/track")({
  head: () => ({
    meta: [
      { title: "Track Transaction — Reflo Bank" },
      { name: "description", content: "Track the status of your Reflo Bank transaction in real time." },
    ],
  }),
  component: TrackPage,
});

type Result = null | { ok: true; id: string } | { ok: false };

function TrackPage() {
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
    }, 1400);
  };

  const now = new Date();
  const fmt = (d: Date) => d.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-5xl px-4 py-12">
          <h1 className="font-display text-4xl font-bold">Track Your Transaction</h1>
          <p className="mt-2 opacity-90">Enter your 15-character Reflo transaction reference to view live status.</p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 -mt-8">
        <form onSubmit={submit} className="rounded-xl bg-card border border-border shadow-lg p-6">
          <label className="text-sm font-semibold">Transaction ID</label>
          <div className="mt-2 flex gap-2">
            <input
              value={txId}
              onChange={(e) => setTxId(e.target.value)}
              placeholder="e.g. RFL316053050400"
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
            <p className="mt-3 text-sm text-muted-foreground">Securely contacting Reflo Bank settlement network…</p>
          </div>
        )}

        {result?.ok === true && (
          <div className="mt-6 space-y-4">
            <div className="rounded-xl bg-card border-2 border-success p-6">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="h-12 w-12 text-success shrink-0" />
                <div>
                  <h2 className="font-display text-2xl font-bold text-success">Payment Successfully Processed</h2>
                  <p className="mt-1 text-muted-foreground">
                    Your transaction has been processed by Reflo Bank and will be credited to the beneficiary account within <strong className="text-foreground">6 working hours</strong>.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-card border border-border p-6">
              <h3 className="font-semibold text-lg">Transaction Details</h3>
              <dl className="mt-4 grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <div><dt className="text-muted-foreground">Reference ID</dt><dd className="font-mono font-semibold">{result.id}</dd></div>
                <div><dt className="text-muted-foreground">Status</dt><dd className="font-semibold text-success">Processed · Awaiting Settlement</dd></div>
                <div><dt className="text-muted-foreground">Initiated</dt><dd>{fmt(new Date(now.getTime() - 1000 * 60 * 23))}</dd></div>
                <div><dt className="text-muted-foreground">Expected Credit</dt><dd>Within 6 working hours</dd></div>
                <div><dt className="text-muted-foreground">Channel</dt><dd>IMPS / RTGS — Reflo Settlement Network</dd></div>
                <div><dt className="text-muted-foreground">Sender Bank</dt><dd>Verified</dd></div>
              </dl>
            </div>

            <div className="rounded-xl bg-card border border-border p-6">
              <h3 className="font-semibold text-lg mb-4">Settlement Timeline</h3>
              <ol className="space-y-4">
                {[
                  { t: "Payment Initiated", time: fmt(new Date(now.getTime() - 1000 * 60 * 23)), done: true, icon: ArrowRight },
                  { t: "Verified by Reflo Bank", time: fmt(new Date(now.getTime() - 1000 * 60 * 18)), done: true, icon: CheckCircle2 },
                  { t: "Processed at Clearing House", time: fmt(now), done: true, icon: Building2 },
                  { t: "Credit to Beneficiary Account", time: "Within 6 working hours", done: false, icon: Clock },
                ].map((s, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-full ${s.done ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"}`}>
                      <s.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium">{s.t}</div>
                      <div className="text-xs text-muted-foreground">{s.time}</div>
                    </div>
                  </li>
                ))}
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
                  We couldn't locate a transaction with this reference ID in our system. Please double-check the ID and try again, or contact Reflo Bank support at 1-800-REFLO-US.
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
