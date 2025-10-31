
export type PurchaseStatus = 'Pending' | 'Approved' | 'Paid' | 'Cancelled';

export interface Product {
  id: string;
  name: string;
}

export interface Supplier {
  id: string;
  name: string;
}

export interface Purchase {
  id: string;
  date: string;
  type: string;
  invoice: string;
  supplierId: string;
  productId?: string;
  vatTin?: string;
  description: string;
  quantity: number;
  unit: string;
  cost: number;
  assets: number;
  goodsForSale: number;
  services: number;
  staffCost: number;
  utilities: number;
  rental: number;
  others: number;
  salesTax: number;
  exchangeRate: number;
  staffUser: string;
  status: PurchaseStatus;
}

export interface Sale {
  id:string;
  date: string;
  invoice: string;
  customer: string;
  vatTin?: string;
  productId: string;
  description: string;
  quantity: number;
  unit: string;
  cost: number;
  goods: number;
  services: number;
  others: number;
  salesTax: number;
  cgs: number;
  seller: string;
  exchangeRate: number;
}

export interface Staff {
  id: string;
  employeeId: string;
  nameKhmer: string;
  nameEnglish: string;
  gender: 'Male' | 'Female';
  dob: string;
  salaryRiel: number;
  salaryUsd: number;
}

export interface Rental {
    id: string;
    date: string;
    recipient: string;
    object: string;
    invoice: string;
    amountUsd: number;
    exchangeRate: number;
}