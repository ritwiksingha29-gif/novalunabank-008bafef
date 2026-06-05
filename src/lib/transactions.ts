import { supabase } from "@/integrations/supabase/client";

export type TransactionRecord = {
  id: string;
  transaction_id: string;
  amount: number;
  currency: string;
  sender_name: string;
  sender_bank: string;
  beneficiary_name: string;
  beneficiary_account: string;
  beneficiary_bank: string;
  status: string;
  notes: string;
  saved_at: string;
  created_at: string;
  updated_at: string;
};

export const STATUS_OPTIONS = [
  "Processed · Awaiting Settlement",
  "Successful · Credited to Beneficiary",
  "In Progress · Under Bank Review",
  "On Hold · Compliance Check",
  "Failed · Reversed to Sender",
] as const;

export async function findTransactionById(rawId: string): Promise<TransactionRecord | null> {
  const id = rawId.trim().toUpperCase();
  if (!id) return null;
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .ilike("transaction_id", id)
    .maybeSingle();
  if (error) {
    console.error(error);
    return null;
  }
  return data as TransactionRecord | null;
}
