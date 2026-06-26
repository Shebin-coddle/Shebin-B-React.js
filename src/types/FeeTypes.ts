export type Fee = {
  id: number;
  fee_name: string;
  amount: number;
};

export type CreateFeeRequest = {
  fee_name: string;
  amount: number;
};

export type UpdateFeeRequest = {
  fee_name: string;
  amount: number;
};