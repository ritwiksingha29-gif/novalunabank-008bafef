import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { Lock, Shield } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign In — Reflo Bank Internet Banking" }] }),
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />
      <main className="flex-1 bg-gradient-to-br from-primary/5 to-accent">
        <div className="mx-auto max-w-md px-4 py-16">
          <div className="rounded-xl bg-card border border-border shadow-xl p-8">
            <div className="flex items-center gap-2 text-primary">
              <Lock className="h-5 w-5" />
              <span className="text-xs font-semibold uppercase tracking-wider">Secure Sign In</span>
            </div>
            <h1 className="mt-3 font-display text-3xl font-bold text-primary">Internet Banking</h1>
            <p className="text-sm text-muted-foreground mt-1">Welcome back. Please sign in to continue.</p>
            <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="text-sm font-medium">User ID</label>
                <input type="text" className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="text-sm font-medium">Password</label>
                <input type="password" className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <button className="w-full rounded-md bg-primary text-primary-foreground py-2.5 font-semibold hover:bg-primary/90">
                Sign In Securely
              </button>
            </form>
            <div className="mt-4 flex justify-between text-xs text-muted-foreground">
              <a href="#">Forgot User ID?</a>
              <a href="#">Forgot Password?</a>
            </div>
            <div className="mt-6 pt-6 border-t border-border text-xs text-muted-foreground flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Protected by Reflo Bank 256-bit encryption. Never share your password.
            </div>
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Need to verify a payment? <Link to="/verify" className="text-primary font-medium">Verify here</Link>
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
