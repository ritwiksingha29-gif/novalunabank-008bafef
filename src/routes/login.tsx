import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { Lock, Shield } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign In — Novaluna Bank Internet Banking" }] }),
  component: LoginPage,
});

function LoginPage() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [msg, setMsg] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !password) {
      setState("error");
      setMsg("Please enter both your User ID and Password.");
      return;
    }
    setState("loading");
    setMsg("");
    await new Promise((r) => setTimeout(r, 1400));
    setState("error");
    setMsg("We could not verify your credentials. Please try again or call +1 1800-546-4002.");
  };

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
            <form className="mt-6 space-y-4" onSubmit={submit}>
              <div>
                <label className="text-sm font-medium">User ID</label>
                <input value={userId} onChange={(e) => setUserId(e.target.value)} type="text" className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="text-sm font-medium">Password</label>
                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              {state === "error" && msg && (
                <p className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-md px-3 py-2">{msg}</p>
              )}
              <button disabled={state === "loading"} className="w-full rounded-md bg-primary text-primary-foreground py-2.5 font-semibold hover:bg-primary/90 disabled:opacity-70">
                {state === "loading" ? "Authenticating…" : "Sign In Securely"}
              </button>
            </form>
            <div className="mt-4 flex justify-between text-xs text-muted-foreground">
              <Link to="/support" className="hover:text-primary">Forgot User ID?</Link>
              <Link to="/support" className="hover:text-primary">Forgot Password?</Link>
            </div>
            <div className="mt-6 pt-6 border-t border-border text-xs text-muted-foreground flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Protected by Novaluna Bank 256-bit encryption. Never share your password.
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
