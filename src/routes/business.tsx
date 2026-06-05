import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";

export const Route = createFileRoute("/business")({
  head: () => ({ meta: [{ title: "Business Banking — Reflo Bank" }] }),
  component: BusinessPage,
});

function BusinessPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <h1 className="font-display text-4xl font-bold">Business Banking</h1>
          <p className="mt-2 opacity-90 max-w-2xl">Comprehensive solutions for small businesses, mid-market companies, and enterprises across the United States.</p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-16 grid md:grid-cols-3 gap-6">
        {[
          { t: "Business Checking", d: "No-fee accounts with unlimited transactions for qualifying balances." },
          { t: "Merchant Services", d: "Accept payments in-store, online, and on mobile with Reflo Pay." },
          { t: "Commercial Loans", d: "Working capital, equipment financing, and SBA-preferred lending." },
          { t: "Payroll & HR", d: "Integrated payroll processing and benefits administration." },
          { t: "Treasury Management", d: "Cash flow, fraud controls, and international wire services." },
          { t: "Business Credit Cards", d: "Earn up to 3% cash back on business spend categories." },
        ].map((c) => (
          <div key={c.t} className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold text-lg text-primary">{c.t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{c.d}</p>
          </div>
        ))}
      </section>
      <SiteFooter />
    </div>
  );
}
