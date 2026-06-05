import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { Phone, Mail, MapPin, MessageSquare } from "lucide-react";

export const Route = createFileRoute("/support")({
  head: () => ({ meta: [{ title: "Customer Support — Novaluna Bank" }] }),
  component: SupportPage,
});

function SupportPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <h1 className="font-display text-4xl font-bold">We're Here to Help</h1>
          <p className="mt-2 opacity-90">Reach the Novaluna Bank support team 24 hours a day, 7 days a week.</p>
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-4 py-16 grid sm:grid-cols-2 gap-6">
        {[
          { icon: Phone, t: "Call Us", d: "+1 1800-546-4002" },
          { icon: Mail, t: "Email Support", d: "support@novalunabank.com" },
          { icon: MessageSquare, t: "Secure Message", d: "Sign in and use the messaging center." },
          { icon: MapPin, t: "Headquarters", d: "1100 N Market St, Wilmington, DE 19890" },
        ].map((c) => (
          <div key={c.t} className="rounded-lg border border-border bg-card p-6 flex gap-4">
            <c.icon className="h-8 w-8 text-primary shrink-0" />
            <div>
              <h3 className="font-semibold">{c.t}</h3>
              <p className="text-sm text-muted-foreground mt-1">{c.d}</p>
            </div>
          </div>
        ))}
      </section>
      <SiteFooter />
    </div>
  );
}
