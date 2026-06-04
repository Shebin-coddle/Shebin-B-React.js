export type Medicine = {
  id: number;
  medicine_name: string;
  description: string;
  stock: number;
  expiry_date: string;
  created_at: string;
  deleted_at: string | null;
};

export type UpdateMedicineRequest = {
  medicine_name: string;
  description: string;
  stock: number;
  expiry_date: string;
};