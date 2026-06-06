import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { TrendingUp, Home, Car, GraduationCap, PiggyBank, Briefcase } from "lucide-react";

export const Route = createFileRoute("/offers")({
  head: () => ({ meta: [{ title: "Rates & Offers — Novaluna Bank" }] }),
  component: OffersPage,
});

const offers = [
  { icon: PiggyBank, title: "High-Yield Savings", rate: "4.85% APY", desc: "On balances up to $250,000. No minimum, no fees.", cta: "Open Savings" },
  { icon: TrendingUp, title: "12-Month CD Special", rate: "5.10% APY", desc: "Lock in a guaranteed rate with as little as $1,000.", cta: "Open a CD" },
  { icon: Home, title: "30-Year Fixed Mortgage", rate: "6.49% APR", desc: "Pre-approval in as little as 24 hours. No origination fees for members.", cta: "Get Pre-Approved" },
  { icon: Car, title: "Auto Loan Refinance", rate: "5.74% APR", desc: "Save an average of $1,200/year by refinancing your current auto loan.", cta: "Check My Rate" },
  { icon: GraduationCap, title: "Student Loan Refi", rate: "from 4.99% APR", desc: "Variable & fixed-rate options. No application or prepayment fees.", cta: "Estimate Savings" },
  { icon: Briefcase, title: "Business Line of Credit", rate: "from 8.25% APR", desc: "Up to $250,000 revolving credit for qualifying small businesses.", cta: "Apply for Business" },
];

function OffersPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <h1 className="font-display text-4xl font-bold">Today's Rates & Member Offers</h1>
          <p className="mt-2 opacity-90 max-w-2xl">Competitive rates updated daily. All offers EYPS insured up to $250,000 per depositor.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map((o) => (
          <div key={o.title} className="rounded-xl border border-border bg-card p-6 hover:shadow-lg transition-shadow">
            <o.icon className="h-9 w-9 text-primary" />
            <h3 className="mt-3 font-semibold text-lg">{o.title}</h3>
            <p className="font-display text-3xl font-bold text-primary mt-1">{o.rate}</p>
            <p className="mt-2 text-sm text-muted-foreground">{o.desc}</p>
            <Link to="/login" className="mt-4 inline-block rounded-md border border-primary text-primary px-4 py-2 text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors">
              {o.cta}
            </Link>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16">
        <p className="text-xs text-muted-foreground">
          APY = Annual Percentage Yield. APR = Annual Percentage Rate. Rates effective as of today and subject to change without notice. Member EYPS.
        </p>
      </section>
      <SiteFooter />
    </div>
  );
}
