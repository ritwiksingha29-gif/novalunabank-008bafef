import { Link, useRouterState } from "@tanstack/react-router";
import { Shield, Phone } from "lucide-react";

const navItems = [
  { to: "/", label: "Personal" },
  { to: "/business", label: "Business" },
  { to: "/track", label: "Track Transaction" },
  { to: "/verify", label: "Verify Payment" },
  { to: "/support", label: "Support" },
];

export function SiteHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="border-b border-border bg-card">
      <div className="bg-primary text-primary-foreground text-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5">
          <span className="flex items-center gap-1.5"><Shield className="h-3 w-3" /> FDIC Insured · Member 2024</span>
          <div className="hidden sm:flex items-center gap-4">
            <span className="flex items-center gap-1.5"><Phone className="h-3 w-3" /> 1-800-REFLO-US</span>
            <span>Routing: 021000089</span>
          </div>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <span className="font-display text-xl font-bold">R</span>
          </div>
          <div className="leading-tight">
            <div className="font-display text-xl font-bold text-primary">Reflo Bank</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Trusted Since 1923</div>
          </div>
        </Link>
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  active ? "text-primary bg-accent" : "text-foreground/80 hover:text-primary hover:bg-accent/60"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <Link
          to="/login"
          className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Sign In
        </Link>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 grid gap-8 md:grid-cols-4">
        <div>
          <div className="font-display text-2xl font-bold">Reflo Bank</div>
          <p className="mt-3 text-sm opacity-80">
            Member FDIC. Equal Housing Lender. Reflo Bank, N.A. — Headquartered in Wilmington, Delaware.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Banking</h4>
          <ul className="space-y-2 text-sm opacity-80">
            <li>Checking Accounts</li><li>Savings & CDs</li><li>Credit Cards</li><li>Mortgages</li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Security</h4>
          <ul className="space-y-2 text-sm opacity-80">
            <li><Link to="/track">Track a Transaction</Link></li>
            <li><Link to="/verify">Verify a Payment</Link></li>
            <li>Fraud Prevention</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Contact</h4>
          <ul className="space-y-2 text-sm opacity-80">
            <li>1-800-REFLO-US</li>
            <li>support@reflobank.com</li>
            <li>Mon–Sun, 24/7</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-4 text-xs opacity-70 flex flex-wrap justify-between gap-2">
          <span>© {new Date().getFullYear()} Reflo Bank, N.A. All rights reserved.</span>
          <span>NMLS ID #418294 · Routing #021000089</span>
        </div>
      </div>
    </footer>
  );
}
