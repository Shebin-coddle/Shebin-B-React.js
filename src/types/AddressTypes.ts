export type Address = {
  id: number;
  street_name: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
};

export type CreateAddressRequest = {
  street_name: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
};