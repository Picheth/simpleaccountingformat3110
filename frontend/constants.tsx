import React from 'react';
import { Product, Staff, Purchase, Sale, Rental, Supplier } from './types';

// Fix: Renamed `products` to `initialProducts` to match usage in `api.ts`.
export const initialProducts: Product[] = [
  { id: 'IP7P', name: 'iPhone 7 Plus', category: 'Smartphone', purchasePrice: 250, sellingPrice: 320, currentStock: 5, unit: 'pcs' },
  { id: 'IP8P', name: 'iPhone 8 Plus', category: 'Smartphone', purchasePrice: 300, sellingPrice: 380, currentStock: 8, unit: 'pcs' },
  { id: 'IPX', name: 'iPhone X', category: 'Smartphone', purchasePrice: 350, sellingPrice: 450, currentStock: 12, unit: 'pcs' },
  { id: 'IPXS', name: 'iPhone XS', category: 'Smartphone', purchasePrice: 400, sellingPrice: 520, currentStock: 10, unit: 'pcs' },
  { id: 'IPXSM', name: 'iPhone XS Max', category: 'Smartphone', purchasePrice: 450, sellingPrice: 580, currentStock: 7, unit: 'pcs' },
  { id: 'IP11', name: 'iPhone 11', category: 'Smartphone', purchasePrice: 500, sellingPrice: 650, currentStock: 15, unit: 'pcs' },
  { id: 'IP11P', name: 'iPhone 11 Pro', category: 'Smartphone', purchasePrice: 600, sellingPrice: 780, currentStock: 9, unit: 'pcs' },
  { id: 'IP11PM', name: 'iPhone 11 Pro Max', category: 'Smartphone', purchasePrice: 650, sellingPrice: 850, currentStock: 6, unit: 'pcs' },
  { id: 'IP12MN', name: 'iPhone 12 Mini', category: 'Smartphone', purchasePrice: 550, sellingPrice: 700, currentStock: 11, unit: 'pcs' },
  { id: 'IP12', name: 'iPhone 12', category: 'Smartphone', purchasePrice: 650, sellingPrice: 820, currentStock: 14, unit: 'pcs' },
  { id: 'IP12P', name: 'iPhone 12 Pro', category: 'Smartphone', purchasePrice: 750, sellingPrice: 950, currentStock: 8, unit: 'pcs' },
  { id: 'IP12PM', name: 'iPhone 12 Pro Max', category: 'Smartphone', purchasePrice: 800, sellingPrice: 1020, currentStock: 5, unit: 'pcs' },
  { id: 'IP13MN', name: 'iPhone 13 Mini', category: 'Smartphone', purchasePrice: 600, sellingPrice: 780, currentStock: 10, unit: 'pcs' },
  { id: 'IP13', name: 'iPhone 13', category: 'Smartphone', purchasePrice: 700, sellingPrice: 900, currentStock: 18, unit: 'pcs' },
  { id: 'IP13P', name: 'iPhone 13 Pro', category: 'Smartphone', purchasePrice: 850, sellingPrice: 1100, currentStock: 12, unit: 'pcs' },
  { id: 'IP13PM', name: 'iPhone 13 Pro Max', category: 'Smartphone', purchasePrice: 900, sellingPrice: 1180, currentStock: 9, unit: 'pcs' },
  { id: 'IP14', name: 'iPhone 14', category: 'Smartphone', purchasePrice: 750, sellingPrice: 950, currentStock: 20, unit: 'pcs' },
  { id: 'IP14PR', name: 'iPhone 14 Pro', category: 'Smartphone', purchasePrice: 900, sellingPrice: 1150, currentStock: 15, unit: 'pcs' },
  { id: 'IP14PM', name: 'iPhone 14 Pro Max', category: 'Smartphone', purchasePrice: 950, sellingPrice: 1250, currentStock: 11, unit: 'pcs' },
  { id: 'IP15', name: 'iPhone 15', category: 'Smartphone', purchasePrice: 800, sellingPrice: 1020, currentStock: 25, unit: 'pcs' },
  { id: 'IP15PL', name: 'iPhone 15 Plus', category: 'Smartphone', purchasePrice: 850, sellingPrice: 1100, currentStock: 18, unit: 'pcs' },
  { id: 'IP15PR', name: 'iPhone 15 Pro', category: 'Smartphone', purchasePrice: 1000, sellingPrice: 1300, currentStock: 22, unit: 'pcs' },
  { id: 'IP15PM', name: 'iPhone 15 Pro Max', category: 'Smartphone', purchasePrice: 1100, sellingPrice: 1450, currentStock: 16, unit: 'pcs' },
  { id: 'IP16', name: 'iPhone 16', category: 'Smartphone', purchasePrice: 850, sellingPrice: 1100, currentStock: 30, unit: 'pcs' },
  { id: 'IP16PL', name: 'iPhone 16 Plus', category: 'Smartphone', purchasePrice: 900, sellingPrice: 1180, currentStock: 24, unit: 'pcs' },
  { id: 'IP16PR', name: 'iPhone 16 Pro', category: 'Smartphone', purchasePrice: 1100, sellingPrice: 1420, currentStock: 28, unit: 'pcs' },
  { id: 'IP16PM', name: 'iPhone 16 Pro Max', category: 'Smartphone', purchasePrice: 1200, sellingPrice: 1580, currentStock: 20, unit: 'pcs' },
  { id: 'IP17', name: 'iPhone 17', category: 'Smartphone', purchasePrice: 900, sellingPrice: 1180, currentStock: 15, unit: 'pcs' },
  { id: 'IP17PR', name: 'iPhone 17 Pro', category: 'Smartphone', purchasePrice: 1150, sellingPrice: 1500, currentStock: 12, unit: 'pcs' },
  { id: 'IP17PM', name: 'iPhone 17 Pro Max', category: 'Smartphone', purchasePrice: 1300, sellingPrice: 1700, currentStock: 10, unit: 'pcs' },
  { id: 'IP17R', name: 'iPhone 17 Air', category: 'Smartphone', purchasePrice: 950, sellingPrice: 1250, currentStock: 8, unit: 'pcs' },
];

// Fix: Renamed `suppliers` to `initialSuppliers` to match usage in `api.ts`.
export const initialSuppliers: Supplier[] = [
    { id: 'SUP001', name: 'General Supplier' },
    { id: 'SUP002', name: 'General Customer' },
    { id: 'SUP003', name: 'House Owner' },
    { id: 'SUP004', name: 'Staff' },
    { id: 'SUP005', name: 'NSSF' },
    { id: 'SUP006', name: 'EDC' },
    { id: 'SUP007', name: 'PPWSA' },
    { id: 'SUP008', name: 'Others' },
];

// Fix: Renamed `staff` to `initialStaff` to match usage in `api.ts`.
export const initialStaff: Staff[] = [
    { id: 'S001', employeeId: 'EMP001', nameKhmer: 'សុខ សុខ', nameEnglish: 'Sok Sok', gender: 'Male', dob: '1990-01-15', salaryRiel: 2000000, salaryUsd: 500 },
    { id: 'S002', employeeId: 'EMP002', nameKhmer: 'ច័ន្ទ សុជាតា', nameEnglish: 'Chan Socheata', gender: 'Female', dob: '1992-05-20', salaryRiel: 2400000, salaryUsd: 600 },
];

export const initialPurchases: Purchase[] = [
    { id: 'PUR001', date: '2023-10-15', type: 'Goods', invoice: 'INV-P-001', supplierId: 'SUP001', productId: 'P019', vatTin: '12345', description: 'iPhone 15 Pro Max 256GB', quantity: 10, unit: 'pcs', cost: 1200, assets: 0, goodsForSale: 12000, services: 0, staffCost: 0, utilities: 0, rental: 0, others: 0, salesTax: 1200, exchangeRate: 4100, staffUser: 'Sok Sok', status: 'Approved' },
    { id: 'PUR002', date: '2023-10-20', type: 'Utilities', invoice: 'INV-P-002', supplierId: 'SUP006', vatTin: '67890', description: 'Electricity Bill', quantity: 1, unit: 'month', cost: 200, assets: 0, goodsForSale: 0, services: 0, staffCost: 0, utilities: 200, rental: 0, others: 0, salesTax: 20, exchangeRate: 4100, staffUser: 'Admin', status: 'Paid' },
];

export const initialSales: Sale[] = [
    { id: 'SALE001', date: '2023-10-25', invoice: 'INV-S-001', customer: 'Customer A', productId: 'P019', description: 'iPhone 15 Pro Max 256GB', quantity: 2, unit: 'pcs', cost: 1350, goods: 2700, services: 0, others: 0, salesTax: 270, cgs: 2400, seller: 'Chan Socheata', exchangeRate: 4100 },
    { id: 'SALE002', date: '2023-10-28', invoice: 'INV-S-002', customer: 'Customer B', productId: 'P018', description: 'iPhone 15 Pro 128GB', quantity: 1, unit: 'pcs', cost: 1100, goods: 1100, services: 0, others: 0, salesTax: 110, cgs: 980, seller: 'Chan Socheata', exchangeRate: 4100 },
];

export const initialRentals: Rental[] = [
    { id: 'RENT001', date: '2023-09-30', recipient: 'លោក ឡូ វួយភាគ', object: 'Rental for Sep-2023', invoice: 'N/A', amountUsd: 1000, exchangeRate: 4010 }
];

// Icons
export const DashboardIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>);
export const PurchaseIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>);
export const SaleIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>);
export const InventoryIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>);
export const ProductIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>);
export const StaffIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.122-1.28-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.122-1.28.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>);
export const RentalIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>);
export const NssfIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>);
export const ReportIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h5l4 4h5a2 2 0 012 2v5a2 2 0 01-2 2z" /></svg>);
export const PrintIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H7a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>);
export const SupplierIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>);


export const navItems = [
    { name: 'Dashboard', icon: DashboardIcon },
    { name: 'Purchases', icon: PurchaseIcon },
    { name: 'Sales', icon: SaleIcon },
    { name: 'Inventory', icon: InventoryIcon },
    { name: 'Products', icon: ProductIcon },
    { name: 'Suppliers', icon: SupplierIcon },
    { name: 'Staff', icon: StaffIcon },
    { name: 'Rental', icon: RentalIcon },
    { name: 'NSSF', icon: NssfIcon },
    { name: 'Reports', icon: ReportIcon },
];