import type { TransactionRecord } from "@/lib/transactions";
import logoAsset from "@/assets/novaluna-logo.png.asset.json";

const fmt = (d: string | null | undefined) =>
  d ? new Date(d).toLocaleString("en-US", { dateStyle: "long", timeStyle: "short" }) : "—";

const fmtAmount = (n: number, c: string) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: c || "USD" }).format(n);

const statusColor = (status: string) => {
  const s = status.toLowerCase();
  if (s.startsWith("failed")) return { bg: "#fee2e2", fg: "#991b1b", label: "FAILED" };
  if (s.startsWith("on hold")) return { bg: "#fef3c7", fg: "#92400e", label: "ON HOLD" };
  if (s.startsWith("in progress")) return { bg: "#dbeafe", fg: "#1e40af", label: "IN PROGRESS" };
  if (s.startsWith("successful")) return { bg: "#dcfce7", fg: "#166534", label: "SUCCESSFUL" };
  return { bg: "#dcfce7", fg: "#166534", label: "PROCESSED" };
};

export function openReceipt(tx: TransactionRecord) {
  const logoUrl = `${window.location.origin}${logoAsset.url}`;
  const sc = statusColor(tx.status);
  const amount = fmtAmount(Number(tx.amount), tx.currency);

  const row = (k: string, v: string, mono = false) => `
    <tr>
      <td style="padding:10px 14px;color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;width:42%;border-bottom:1px solid #f1f5f9;">${k}</td>
      <td style="padding:10px 14px;color:#0f172a;font-weight:600;font-size:14px;border-bottom:1px solid #f1f5f9;${mono ? "font-family:ui-monospace,Menlo,Monaco,Consolas,monospace;" : ""}">${v}</td>
    </tr>`;

  const timelineRow = (label: string, time: string | null) => `
    <tr>
      <td style="padding:8px 0;width:50%;font-size:13px;color:${time ? "#0f172a" : "#94a3b8"};">
        <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${time ? "#1e3a8a" : "#cbd5e1"};margin-right:8px;"></span>
        ${label}
      </td>
      <td style="padding:8px 0;font-size:12px;color:#475569;text-align:right;">${time ? fmt(time) : "Pending"}</td>
    </tr>`;

  const html = `<!doctype html>
<html><head>
<meta charset="utf-8" />
<title>Payment Receipt — ${tx.transaction_id}</title>
<style>
  @page { size: A4; margin: 18mm; }
  * { box-sizing: border-box; }
  body { font-family: 'Helvetica Neue', Arial, sans-serif; color:#0f172a; margin:0; background:#f8fafc; }
  .wrap { max-width: 760px; margin: 24px auto; background:#fff; border:1px solid #e2e8f0; border-radius:12px; overflow:hidden; box-shadow:0 4px 24px rgba(15,23,42,0.06); }
  .head { background: linear-gradient(135deg,#1e1b4b,#4c1d95); color:#fff; padding:28px 32px; display:flex; justify-content:space-between; align-items:flex-start; }
  .brand { display:flex; align-items:center; gap:14px; }
  .brand img { width:56px; height:56px; object-fit:contain; background:#fff; border-radius:10px; padding:4px; }
  .brand h1 { margin:0; font-size:22px; letter-spacing:0.3px; }
  .brand .sub { font-size:11px; opacity:0.8; text-transform:uppercase; letter-spacing:2px; margin-top:2px; }
  .doc { text-align:right; font-size:11px; opacity:0.9; }
  .doc .num { font-size:18px; font-weight:700; letter-spacing:1px; margin-top:4px; }
  .body { padding:28px 32px; }
  .amtbox { text-align:center; padding:22px; border:1px dashed #cbd5e1; border-radius:10px; margin-bottom:24px; background:#f8fafc; }
  .amtbox .lbl { font-size:11px; color:#64748b; text-transform:uppercase; letter-spacing:1.5px; }
  .amtbox .amt { font-size:36px; font-weight:800; color:#1e1b4b; margin-top:4px; }
  .status { display:inline-block; margin-top:10px; padding:6px 14px; border-radius:999px; font-size:12px; font-weight:700; letter-spacing:0.5px; background:${sc.bg}; color:${sc.fg}; }
  table.kv { width:100%; border-collapse:collapse; border:1px solid #e2e8f0; border-radius:8px; overflow:hidden; }
  h3 { font-size:13px; text-transform:uppercase; letter-spacing:1.5px; color:#475569; margin:24px 0 10px; }
  .tl { width:100%; border-collapse:collapse; padding:8px 14px; border:1px solid #e2e8f0; border-radius:8px; }
  .tl-wrap { border:1px solid #e2e8f0; border-radius:8px; padding:8px 16px; }
  .foot { padding:18px 32px; background:#f8fafc; border-top:1px solid #e2e8f0; font-size:11px; color:#64748b; display:flex; justify-content:space-between; }
  .stamp { margin-top:24px; text-align:right; }
  .stamp .sig { display:inline-block; padding:14px 22px; border:2px solid ${sc.fg}; color:${sc.fg}; font-weight:700; transform:rotate(-6deg); border-radius:6px; font-size:14px; letter-spacing:1px; }
  .notes { margin-top:16px; padding:12px 14px; background:#f1f5f9; border-left:3px solid #1e1b4b; font-size:13px; border-radius:4px; }
  .actions { max-width:760px; margin:12px auto; text-align:right; }
  .actions button { background:#1e1b4b; color:#fff; border:0; padding:10px 18px; border-radius:8px; font-weight:600; cursor:pointer; }
  @media print { .actions { display:none; } body { background:#fff; } .wrap { box-shadow:none; border:0; margin:0; max-width:none; } }
</style>
</head><body>
<div class="actions"><button onclick="window.print()">Print / Save as PDF</button></div>
<div class="wrap">
  <div class="head">
    <div class="brand">
      <img src="${logoUrl}" alt="Novaluna Bank" />
      <div>
        <h1>Novaluna Bank</h1>
        <div class="sub">Trusted Since 1923 · Member EYPS</div>
      </div>
    </div>
    <div class="doc">
      OFFICIAL PAYMENT RECEIPT
      <div class="num">${tx.transaction_id}</div>
      <div style="margin-top:6px;">Issued: ${fmt(new Date().toISOString())}</div>
    </div>
  </div>

  <div class="body">
    <div class="amtbox">
      <div class="lbl">Transaction Amount</div>
      <div class="amt">${amount}</div>
      <span class="status">${sc.label} · ${tx.status}</span>
    </div>

    <h3>Transaction Information</h3>
    <table class="kv">
      ${row("Reference ID", tx.transaction_id, true)}
      ${row("Amount", amount)}
      ${row("Currency", tx.currency || "USD")}
      ${row("Channel", "IMPS / RTGS — Novaluna Settlement Network")}
      ${row("Saved / Initiated", fmt(tx.saved_at))}
      ${row("Last Updated", fmt(tx.updated_at))}
    </table>

    <h3>Sender Details</h3>
    <table class="kv">
      ${row("Sender Name", tx.sender_name || "—")}
      ${row("Sender Bank", tx.sender_bank || "—")}
    </table>

    <h3>Beneficiary Details</h3>
    <table class="kv">
      ${row("Beneficiary Name", tx.beneficiary_name || "—")}
      ${row("Account Number", tx.beneficiary_account || "—", true)}
      ${row("Beneficiary Bank", tx.beneficiary_bank || "Novaluna Bank")}
    </table>

    <h3>Settlement Timeline</h3>
    <div class="tl-wrap">
      <table class="tl">
        ${timelineRow("Payment Initiated", tx.initiated_at)}
        ${timelineRow("Verified by Novaluna Bank", tx.verified_at)}
        ${timelineRow("Processed at Clearing House", tx.processed_at)}
        ${timelineRow("Credit to Beneficiary Account", tx.credited_at)}
      </table>
    </div>

    ${tx.notes ? `<div class="notes"><strong>Bank Note:</strong> ${tx.notes}</div>` : ""}

    <div class="stamp">
      <div class="sig">${sc.label}</div>
    </div>
  </div>

  <div class="foot">
    <span>Novaluna Bank, N.A. · Wilmington, Delaware · Routing #021000089</span>
    <span>Support: +1 1800-546-4002</span>
  </div>
</div>
<script>setTimeout(()=>{try{window.focus();}catch(e){}}, 200);</script>
</body></html>`;

  const w = window.open("", "_blank", "width=900,height=1000");
  if (!w) {
    alert("Please allow pop-ups to download the receipt.");
    return;
  }
  w.document.open();
  w.document.write(html);
  w.document.close();
}
