export type Bill = {
  id: number;
  patient_id: number;
  fee_id: number;
  amount: number;
  date: string;
  description: string;
  status: string;
  mode_of_payment: string;
  receipt_link?: string | null;
  created_at: string;
  updated_at: string;
};

export type UpdateBillRequest = {
  fee_id: number;
  amount: number;
  date: string;
  description: string;
  status: string;
  mode_of_payment: string;
};

export type CreateBillRequest = {
  patient_id: number;
  fee_id: number;
  amount: number;
  date: string;
  description: string;
  status: string;
  mode_of_payment: string;
};
