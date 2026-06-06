import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { supabase } from "@/integrations/supabase/client";
import { STATUS_OPTIONS, type TransactionRecord } from "@/lib/transactions";
import { Lock, Plus, Pencil, Trash2, LogOut, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin Console — Novaluna Bank" }] }),
  component: AdminPage,
});

function AdminPage() {
  const [session, setSession] = useState<unknown>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecking(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="mx-auto max-w-md px-4 py-20 text-center text-muted-foreground">Loading…</div>
      </div>
    );
  }

  return session ? <AdminDashboard onSignOut={() => supabase.auth.signOut()} /> : <AdminAuth />;
}

function AdminAuth() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    const fn =
      mode === "signin"
        ? supabase.auth.signInWithPassword({ email, password })
        : supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: `${window.location.origin}/admin` },
          });
    const { error } = await fn;
    if (error) setErr(error.message);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />
      <main className="flex-1 bg-gradient-to-br from-primary/5 to-accent">
        <div className="mx-auto max-w-md px-4 py-16">
          <div className="rounded-xl bg-card border border-border shadow-xl p-8">
            <div className="flex items-center gap-2 text-primary">
              <ShieldCheck className="h-5 w-5" />
              <span className="text-xs font-semibold uppercase tracking-wider">Admin Console</span>
            </div>
            <h1 className="mt-3 font-display text-3xl font-bold text-primary">
              {mode === "signin" ? "Admin Sign In" : "Create Admin Account"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Restricted area. Operator-only access.
            </p>
            <form className="mt-6 space-y-4" onSubmit={submit}>
              <div>
                <label className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              {err && <p className="text-sm text-destructive">{err}</p>}
              <button
                disabled={loading}
                className="w-full rounded-md bg-primary text-primary-foreground py-2.5 font-semibold hover:bg-primary/90 disabled:opacity-60"
              >
                {loading ? "Please wait…" : mode === "signin" ? "Sign In" : "Create Account"}
              </button>
            </form>
            <button
              type="button"
              onClick={() => {
                setErr(null);
                setMode(mode === "signin" ? "signup" : "signin");
              }}
              className="mt-4 w-full text-sm text-primary hover:underline"
            >
              {mode === "signin" ? "First time? Create the admin account" : "Already have an account? Sign in"}
            </button>
            <div className="mt-6 pt-6 border-t border-border text-xs text-muted-foreground flex items-center gap-2">
              <Lock className="h-4 w-4 text-primary" />
              This page is not linked publicly. Only the operator should know its URL.
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

type FormState = {
  transaction_id: string;
  amount: string;
  currency: string;
  sender_name: string;
  sender_bank: string;
  beneficiary_name: string;
  beneficiary_account: string;
  beneficiary_bank: string;
  status: string;
  notes: string;
  saved_at: string;
  initiated_at: string;
  verified_at: string;
  processed_at: string;
  credited_at: string;
};

const toLocal = (d: Date) =>
  new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);

const isoToLocal = (s: string | null) => (s ? toLocal(new Date(s)) : "");

const localToIso = (s: string) => (s ? new Date(s).toISOString() : null);

const emptyForm = (): FormState => {
  const d = new Date();
  d.setSeconds(0, 0);
  const local = toLocal(d);
  return {
    transaction_id: "",
    amount: "",
    currency: "USD",
    sender_name: "",
    sender_bank: "",
    beneficiary_name: "",
    beneficiary_account: "",
    beneficiary_bank: "Novaluna Bank",
    status: STATUS_OPTIONS[0],
    notes: "",
    saved_at: local,
    initiated_at: local,
    verified_at: "",
    processed_at: "",
    credited_at: "",
  };
};

function AdminDashboard({ onSignOut }: { onSignOut: () => void }) {
  const [txs, setTxs] = useState<TransactionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<TransactionRecord | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [showForm, setShowForm] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) setErr(error.message);
    else setTxs((data ?? []) as TransactionRecord[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const startNew = () => {
    setEditing(null);
    setForm(emptyForm());
    setShowForm(true);
    setErr(null);
  };

  const startEdit = (tx: TransactionRecord) => {
    setEditing(tx);
    setForm({
      transaction_id: tx.transaction_id,
      amount: String(tx.amount),
      currency: tx.currency,
      sender_name: tx.sender_name,
      sender_bank: tx.sender_bank,
      beneficiary_name: tx.beneficiary_name,
      beneficiary_account: tx.beneficiary_account,
      beneficiary_bank: tx.beneficiary_bank,
      status: tx.status,
      notes: tx.notes,
      saved_at: isoToLocal(tx.saved_at),
      initiated_at: isoToLocal(tx.initiated_at) || isoToLocal(tx.saved_at),
      verified_at: isoToLocal(tx.verified_at),
      processed_at: isoToLocal(tx.processed_at),
      credited_at: isoToLocal(tx.credited_at),
    });
    setShowForm(true);
    setErr(null);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErr(null);
    const payload = {
      transaction_id: form.transaction_id.trim().toUpperCase(),
      amount: Number(form.amount) || 0,
      currency: form.currency.trim().toUpperCase() || "USD",
      sender_name: form.sender_name.trim(),
      sender_bank: form.sender_bank.trim(),
      beneficiary_name: form.beneficiary_name.trim(),
      beneficiary_account: form.beneficiary_account.trim(),
      beneficiary_bank: form.beneficiary_bank.trim() || "Novaluna Bank",
      status: form.status,
      notes: form.notes.trim(),
      saved_at: new Date(form.saved_at).toISOString(),
      initiated_at: localToIso(form.initiated_at),
      verified_at: localToIso(form.verified_at),
      processed_at: localToIso(form.processed_at),
      credited_at: localToIso(form.credited_at),
    };

    const { error } = editing
      ? await supabase.from("transactions").update(payload).eq("id", editing.id)
      : await supabase.from("transactions").insert(payload);

    if (error) setErr(error.message);
    else {
      setShowForm(false);
      await load();
    }
    setSaving(false);
  };

  const remove = async (tx: TransactionRecord) => {
    if (!confirm(`Delete transaction ${tx.transaction_id}?`)) return;
    const { error } = await supabase.from("transactions").delete().eq("id", tx.id);
    if (error) alert(error.message);
    else load();
  };

  const quickStatus = async (tx: TransactionRecord, status: string) => {
    const { error } = await supabase.from("transactions").update({ status }).eq("id", tx.id);
    if (error) alert(error.message);
    else load();
  };

  const fmt = (d: string) => new Date(d).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-10 flex items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold">Admin Console</h1>
            <p className="mt-1 opacity-90 text-sm">Manage saved transactions visible on Track & Verify pages.</p>
          </div>
          <button
            onClick={onSignOut}
            className="rounded-md bg-white/10 hover:bg-white/20 px-4 py-2 text-sm font-medium flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-display text-xl font-bold">Saved Transactions ({txs.length})</h2>
          <button
            onClick={startNew}
            className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:bg-primary/90 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Add Transaction
          </button>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : txs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
            No transactions yet. Click "Add Transaction" to create one.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead className="bg-accent/50 text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold">Transaction ID</th>
                  <th className="px-4 py-3 font-semibold">Amount</th>
                  <th className="px-4 py-3 font-semibold">Beneficiary</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Saved At</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {txs.map((tx) => (
                  <tr key={tx.id} className="border-t border-border">
                    <td className="px-4 py-3 font-mono">{tx.transaction_id}</td>
                    <td className="px-4 py-3">
                      {new Intl.NumberFormat("en-US", { style: "currency", currency: tx.currency || "USD" }).format(Number(tx.amount))}
                    </td>
                    <td className="px-4 py-3">{tx.beneficiary_name || "—"}</td>
                    <td className="px-4 py-3">
                      <select
                        value={tx.status}
                        onChange={(e) => quickStatus(tx, e.target.value)}
                        className="rounded-md border border-input bg-background px-2 py-1 text-xs"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{fmt(tx.saved_at)}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => startEdit(tx)}
                        className="inline-flex items-center gap-1 rounded-md border border-input px-2 py-1 text-xs hover:bg-accent mr-1"
                      >
                        <Pencil className="h-3 w-3" /> Edit
                      </button>
                      <button
                        onClick={() => remove(tx)}
                        className="inline-flex items-center gap-1 rounded-md border border-destructive/40 text-destructive px-2 py-1 text-xs hover:bg-destructive/10"
                      >
                        <Trash2 className="h-3 w-3" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center overflow-y-auto p-4">
          <div className="bg-card rounded-xl border border-border shadow-2xl max-w-2xl w-full my-8">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h3 className="font-display text-xl font-bold">
                {editing ? "Edit Transaction" : "Add New Transaction"}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>
            <form onSubmit={save} className="px-6 py-5 grid sm:grid-cols-2 gap-4">
              <Field label="Transaction ID *" required>
                <input
                  required
                  value={form.transaction_id}
                  onChange={(e) => setForm({ ...form, transaction_id: e.target.value })}
                  placeholder="NVL123456789012"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 font-mono uppercase"
                />
              </Field>
              <Field label="Saved Date & Time *">
                <input
                  type="datetime-local"
                  required
                  value={form.saved_at}
                  onChange={(e) => setForm({ ...form, saved_at: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                />
              </Field>
              <Field label="Amount">
                <input
                  type="number"
                  step="0.01"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                />
              </Field>
              <Field label="Currency">
                <input
                  value={form.currency}
                  onChange={(e) => setForm({ ...form, currency: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 uppercase"
                />
              </Field>
              <Field label="Sender Name">
                <input
                  value={form.sender_name}
                  onChange={(e) => setForm({ ...form, sender_name: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                />
              </Field>
              <Field label="Sender Bank">
                <input
                  value={form.sender_bank}
                  onChange={(e) => setForm({ ...form, sender_bank: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                />
              </Field>
              <Field label="Beneficiary Name">
                <input
                  value={form.beneficiary_name}
                  onChange={(e) => setForm({ ...form, beneficiary_name: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                />
              </Field>
              <Field label="Beneficiary Account">
                <input
                  value={form.beneficiary_account}
                  onChange={(e) => setForm({ ...form, beneficiary_account: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 font-mono"
                />
              </Field>
              <Field label="Beneficiary Bank">
                <input
                  value={form.beneficiary_bank}
                  onChange={(e) => setForm({ ...form, beneficiary_bank: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                />
              </Field>
              <Field label="Status">
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </Field>
              <div className="sm:col-span-2 mt-2 rounded-lg border border-border bg-accent/30 p-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">
                  Settlement Timeline (leave blank to hide a step)
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Payment Initiated — Time">
                    <input
                      type="datetime-local"
                      value={form.initiated_at}
                      onChange={(e) => setForm({ ...form, initiated_at: e.target.value })}
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                    />
                  </Field>
                  <Field label="Verified by Novaluna Bank — Time">
                    <input
                      type="datetime-local"
                      value={form.verified_at}
                      onChange={(e) => setForm({ ...form, verified_at: e.target.value })}
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                    />
                  </Field>
                  <Field label="Processed at Clearing House — Time">
                    <input
                      type="datetime-local"
                      value={form.processed_at}
                      onChange={(e) => setForm({ ...form, processed_at: e.target.value })}
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                    />
                  </Field>
                  <Field label="Credited to Beneficiary — Time">
                    <input
                      type="datetime-local"
                      value={form.credited_at}
                      onChange={(e) => setForm({ ...form, credited_at: e.target.value })}
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                    />
                  </Field>
                </div>
              </div>
              <div className="sm:col-span-2">
                <Field label="Notes (optional)">
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    rows={2}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                  />
                </Field>
              </div>

              {err && <p className="sm:col-span-2 text-sm text-destructive">{err}</p>}

              <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="rounded-md border border-input px-4 py-2 text-sm">Cancel</button>
                <button
                  disabled={saving}
                  className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:bg-primary/90 disabled:opacity-60"
                >
                  {saving ? "Saving…" : editing ? "Save Changes" : "Create Transaction"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <SiteFooter />
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}{required ? "" : ""}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
