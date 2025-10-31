import { 
    initialPurchases, 
    initialSales, 
    initialProducts, 
    initialSuppliers, 
    initialStaff, 
    initialRentals 
} from './constants';
import { Purchase, Sale, Product, Supplier, Staff, Rental } from './types';

// Simulate a database in memory with initial data, using deep copies
let purchases: Purchase[] = JSON.parse(JSON.stringify(initialPurchases));
let sales: Sale[] = JSON.parse(JSON.stringify(initialSales));
let products: Product[] = JSON.parse(JSON.stringify(initialProducts));
let suppliers: Supplier[] = JSON.parse(JSON.stringify(initialSuppliers));
let staff: Staff[] = JSON.parse(JSON.stringify(initialStaff));
let rentals: Rental[] = JSON.parse(JSON.stringify(initialRentals));

const simulateNetworkDelay = (delay = 400) => new Promise(res => setTimeout(res, delay));

// --- GET Endpoints ---
export const getPurchases = async (): Promise<Purchase[]> => {
    await simulateNetworkDelay();
    return JSON.parse(JSON.stringify(purchases));
};

export const getSales = async (): Promise<Sale[]> => {
    await simulateNetworkDelay();
    return JSON.parse(JSON.stringify(sales));
};

export const getProducts = async (): Promise<Product[]> => {
    await simulateNetworkDelay();
    return JSON.parse(JSON.stringify(products));
};

export const getSuppliers = async (): Promise<Supplier[]> => {
    await simulateNetworkDelay();
    return JSON.parse(JSON.stringify(suppliers));
};

export const getStaff = async (): Promise<Staff[]> => {
    await simulateNetworkDelay();
    return JSON.parse(JSON.stringify(staff));
};

export const getRentals = async (): Promise<Rental[]> => {
    await simulateNetworkDelay();
    return JSON.parse(JSON.stringify(rentals));
};


// --- POST Endpoints ---
export const addPurchase = async (purchaseData: Omit<Purchase, 'id'>): Promise<Purchase> => {
    await simulateNetworkDelay(600);
    const newPurchase: Purchase = {
        ...purchaseData,
        id: `PUR${Date.now()}`
    };
    purchases.unshift(newPurchase); // Add to beginning for visibility
    return JSON.parse(JSON.stringify(newPurchase));
};

export const addSale = async (saleData: Omit<Sale, 'id'>): Promise<Sale> => {
    await simulateNetworkDelay(600);
    const newSale: Sale = {
        ...saleData,
        id: `SALE${Date.now()}`
    };
    sales.unshift(newSale);
    return JSON.parse(JSON.stringify(newSale));
};

// --- PUT Endpoint ---
export const updatePurchase = async (purchaseData: Purchase): Promise<Purchase> => {
    await simulateNetworkDelay(600);
    const index = purchases.findIndex(p => p.id === purchaseData.id);
    if (index === -1) {
        throw new Error('Purchase not found');
    }
    purchases[index] = purchaseData;
    return JSON.parse(JSON.stringify(purchaseData));
};

export const updateSale = async (saleData: Sale): Promise<Sale> => {
    await simulateNetworkDelay(600);
    const index = sales.findIndex(s => s.id === saleData.id);
    if (index === -1) {
        throw new Error('Sale not found');
    }
    sales[index] = saleData;
    return JSON.parse(JSON.stringify(saleData));
};


// --- DELETE Endpoint ---
export const deletePurchase = async (purchaseId: string): Promise<void> => {
    await simulateNetworkDelay(600);
    purchases = purchases.filter(p => p.id !== purchaseId);
};

export const deleteSale = async (saleId: string): Promise<void> => {
    await simulateNetworkDelay(600);
    sales = sales.filter(s => s.id !== saleId);
};