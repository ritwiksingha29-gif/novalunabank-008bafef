import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { CreditCard, Plane, Gift, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/cards")({
  head: () => ({ meta: [{ title: "Credit & Debit Cards — Novaluna Bank" }] }),
  component: CardsPage,
});

const cards = [
  {
    name: "Novaluna Sapphire Rewards",
    type: "Credit Card",
    apr: "19.24% – 27.99% Variable APR",
    bonus: "75,000 bonus points after $4,000 spend in 90 days",
    perks: ["3x points on travel & dining", "$300 annual travel credit", "No foreign transaction fees"],
    icon: Plane,
    color: "from-primary to-primary/70",
  },
  {
    name: "Novaluna Cashback Plus",
    type: "Credit Card",
    apr: "17.99% – 25.99% Variable APR",
    bonus: "$200 statement credit after $1,000 spend in 60 days",
    perks: ["2% cashback on every purchase", "5% on rotating categories", "Cell phone protection"],
    icon: Gift,
    color: "from-primary/90 to-primary/60",
  },
  {
    name: "Novaluna Premier Debit",
    type: "Debit Card",
    apr: "N/A — Linked to checking",
    bonus: "Fee-free ATM access at 65,000+ locations",
    perks: ["Real-time spending alerts", "Tap-to-pay & mobile wallet", "Zero liability protection"],
    icon: ShieldCheck,
    color: "from-primary/80 to-primary/50",
  },
];

function CardsPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <h1 className="font-display text-4xl font-bold">Cards That Work as Hard as You Do</h1>
          <p className="mt-2 opacity-90 max-w-2xl">Choose from our award-winning credit and debit cards designed for travel, everyday spending, and total peace of mind.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 grid lg:grid-cols-3 gap-6">
        {cards.map((c) => (
          <div key={c.name} className="rounded-xl border border-border bg-card overflow-hidden flex flex-col">
            <div className={`bg-gradient-to-br ${c.color} p-6 text-primary-foreground`}>
              <c.icon className="h-8 w-8 opacity-90" />
              <p className="mt-6 text-xs uppercase tracking-wider opacity-80">{c.type}</p>
              <h3 className="font-display text-xl font-bold">{c.name}</h3>
              <div className="mt-8 flex items-center justify-between text-xs opacity-90">
                <span className="font-mono">•••• 4002</span>
                <CreditCard className="h-5 w-5" />
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <p className="text-sm font-semibold text-primary">{c.bonus}</p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground flex-1">
                {c.perks.map((p) => (
                  <li key={p} className="flex gap-2"><span className="text-primary">✓</span> {p}</li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-muted-foreground">{c.apr}</p>
              <Link to="/login" className="mt-4 rounded-md bg-primary text-primary-foreground py-2.5 text-center text-sm font-semibold hover:bg-primary/90">
                Apply Now
              </Link>
            </div>
          </div>
        ))}
      </section>
      <SiteFooter />
    </div>
  );
}
