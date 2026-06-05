import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { Shield, Lock, TrendingUp, CreditCard, Smartphone, Search, BadgeCheck } from "lucide-react";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="bg-gradient-to-br from-primary to-primary/85 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider">Now with Instant Transfers</span>
            <h1 className="mt-4 font-display text-5xl md:text-6xl font-bold leading-tight">
              Banking built on a century of trust.
            </h1>
            <p className="mt-5 text-lg opacity-90 max-w-lg">
              Manage accounts, send payments, and track every transaction with bank-grade security from Novaluna Bank — serving millions of Americans since 1923.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/login" className="rounded-md bg-white text-primary px-6 py-3 font-semibold hover:bg-white/90">
                Open an Account
              </Link>
              <Link to="/track" className="rounded-md border border-white/30 px-6 py-3 font-semibold hover:bg-white/10">
                Track a Transaction
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm opacity-90">
              <span className="flex items-center gap-2"><Shield className="h-4 w-4" /> EYPS Insured</span>
              <span className="flex items-center gap-2"><Lock className="h-4 w-4" /> 256-bit Encryption</span>
            </div>
          </div>

          <div className="bg-card text-card-foreground rounded-xl shadow-2xl p-8">
            <h3 className="font-display text-2xl font-bold text-primary">Internet Banking Login</h3>
            <p className="text-sm text-muted-foreground mt-1">Sign in to your secure account</p>
            <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="text-sm font-medium">User ID</label>
                <input type="text" className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Enter User ID" />
              </div>
              <div>
                <label className="text-sm font-medium">Password</label>
                <input type="password" className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Enter Password" />
              </div>
              <button className="w-full rounded-md bg-primary text-primary-foreground py-2.5 font-semibold hover:bg-primary/90">
                Secure Sign In
              </button>
              <div className="flex justify-between text-xs text-muted-foreground">
                <a href="#">Forgot User ID?</a>
                <a href="#">Forgot Password?</a>
              </div>
            </form>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="font-display text-3xl font-bold text-center text-primary">Everything You Need, In One Place</h2>
        <p className="text-center text-muted-foreground mt-2">Trusted banking services for every step of your financial journey</p>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: CreditCard, title: "Cards & Payments", desc: "Debit, credit, and prepaid solutions" },
            { icon: TrendingUp, title: "Savings & Invest", desc: "High-yield savings up to 4.85% APY" },
            { icon: Smartphone, title: "Mobile Banking", desc: "Deposit checks, pay bills on the go" },
            { icon: Shield, title: "Fraud Protection", desc: "24/7 monitoring & zero liability" },
          ].map((f) => (
            <div key={f.title} className="rounded-lg border border-border bg-card p-6 hover:shadow-lg transition-shadow">
              <f.icon className="h-8 w-8 text-primary" />
              <h3 className="mt-4 font-semibold text-lg">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-accent/40 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 grid md:grid-cols-2 gap-6">
          <Link to="/track" className="group rounded-xl bg-card border border-border p-8 hover:border-primary transition-colors">
            <Search className="h-10 w-10 text-primary" />
            <h3 className="mt-4 font-display text-2xl font-bold">Track a Transaction</h3>
            <p className="mt-2 text-muted-foreground">
              Already sent a payment? Enter your Novaluna transaction ID to see real-time status and credit timeline.
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-primary font-semibold group-hover:gap-2.5 transition-all">
              Track now →
            </span>
          </Link>
          <Link to="/verify" className="group rounded-xl bg-card border border-border p-8 hover:border-primary transition-colors">
            <BadgeCheck className="h-10 w-10 text-primary" />
            <h3 className="mt-4 font-display text-2xl font-bold">Verify a Payment</h3>
            <p className="mt-2 text-muted-foreground">
              Confirm a payment is genuine before releasing goods or services. Instant verification, no login required.
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-primary font-semibold group-hover:gap-2.5 transition-all">
              Verify now →
            </span>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { stat: "$340B+", label: "Assets Under Management" },
            { stat: "12M+", label: "Customers Nationwide" },
            { stat: "1,200+", label: "Branches Across the USA" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display text-5xl font-bold text-primary">{s.stat}</div>
              <div className="mt-2 text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
