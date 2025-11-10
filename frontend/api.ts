import { 
    initialPurchases, 
    initialSales, 
    initialProducts, 
    initialSuppliers, 
    initialStaff, 
    initialRentals 
} from './constants';
import { Purchase, Sale, Product, Supplier, Staff, Rental } from './types';
import Swal from 'sweetalert2';

// localStorage keys
const STORAGE_KEYS = {
    purchases: 'saf_purchases',
    sales: 'saf_sales',
    products: 'saf_products',
    suppliers: 'saf_suppliers',
    staff: 'saf_staff',
    rentals: 'saf_rentals',
};

// Helper functions for localStorage
const getFromStorage = <T,>(key: string, defaultValue: T): T => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error reading ${key} from localStorage:`, error);
        return defaultValue;
    }
};

const saveToStorage = <T,>(key: string, value: T): void => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error saving ${key} to localStorage:`, error);
    }
};

// Initialize data in localStorage if not present
const initializeStorage = () => {
    if (!localStorage.getItem(STORAGE_KEYS.purchases)) {
        saveToStorage(STORAGE_KEYS.purchases, initialPurchases);
    }
    if (!localStorage.getItem(STORAGE_KEYS.sales)) {
        saveToStorage(STORAGE_KEYS.sales, initialSales);
    }
    if (!localStorage.getItem(STORAGE_KEYS.products)) {
        saveToStorage(STORAGE_KEYS.products, initialProducts);
    }
    if (!localStorage.getItem(STORAGE_KEYS.suppliers)) {
        saveToStorage(STORAGE_KEYS.suppliers, initialSuppliers);
    }
    if (!localStorage.getItem(STORAGE_KEYS.staff)) {
        saveToStorage(STORAGE_KEYS.staff, initialStaff);
    }
    if (!localStorage.getItem(STORAGE_KEYS.rentals)) {
        saveToStorage(STORAGE_KEYS.rentals, initialRentals);
    }
};

// Initialize storage on module load
initializeStorage();

const simulateNetworkDelay = (delay = 400) => new Promise(res => setTimeout(res, delay));

// --- GET Endpoints ---
export const getPurchases = async (): Promise<Purchase[]> => {
    await simulateNetworkDelay();
    return getFromStorage(STORAGE_KEYS.purchases, initialPurchases);
};

export const getSales = async (): Promise<Sale[]> => {
    await simulateNetworkDelay();
    return getFromStorage(STORAGE_KEYS.sales, initialSales);
};

export const getProducts = async (): Promise<Product[]> => {
    await simulateNetworkDelay();
    return getFromStorage(STORAGE_KEYS.products, initialProducts);
};

export const getSuppliers = async (): Promise<Supplier[]> => {
    await simulateNetworkDelay();
    return getFromStorage(STORAGE_KEYS.suppliers, initialSuppliers);
};

export const getStaff = async (): Promise<Staff[]> => {
    await simulateNetworkDelay();
    return getFromStorage(STORAGE_KEYS.staff, initialStaff);
};

export const getRentals = async (): Promise<Rental[]> => {
    await simulateNetworkDelay();
    return getFromStorage(STORAGE_KEYS.rentals, initialRentals);
};

export const addStaff = async (staffData: Omit<Staff, 'id'>): Promise<Staff> => {
    await simulateNetworkDelay(600);
    try {
        const staff = getFromStorage<Staff[]>(STORAGE_KEYS.staff, []);
        const newStaff: Staff = {
            ...staffData,
            id: `STF${Date.now()}`
        };
        staff.unshift(newStaff);
        saveToStorage(STORAGE_KEYS.staff, staff);
        
        await Swal.fire({
            title: "Success!",
            text: "Staff member added successfully!",
            icon: "success",
            timer: 2000,
            showConfirmButton: false
        });
        
        return newStaff;
    } catch (error) {
        await Swal.fire({
            title: "Error!",
            text: "Failed to add staff member",
            icon: "error"
        });
        throw error;
    }
};

export const updateStaff = async (staffData: Staff): Promise<Staff> => {
    await simulateNetworkDelay(600);
    try {
        const staff = getFromStorage<Staff[]>(STORAGE_KEYS.staff, []);
        const index = staff.findIndex(s => s.id === staffData.id);
        if (index !== -1) {
            staff[index] = staffData;
            saveToStorage(STORAGE_KEYS.staff, staff);
            
            await Swal.fire({
                title: "Success!",
                text: "Staff member updated successfully!",
                icon: "success",
                timer: 2000,
                showConfirmButton: false
            });
        }
        return staffData;
    } catch (error) {
        await Swal.fire({
            title: "Error!",
            text: "Failed to update staff member",
            icon: "error"
        });
        throw error;
    }
};

export const deleteStaff = async (id: string): Promise<void> => {
    await simulateNetworkDelay(500);
    const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    });

    if (result.isConfirmed) {
        try {
            const staff = getFromStorage<Staff[]>(STORAGE_KEYS.staff, []);
            const filtered = staff.filter(s => s.id !== id);
            saveToStorage(STORAGE_KEYS.staff, filtered);
            
            await Swal.fire({
                title: "Deleted!",
                text: "Staff member has been deleted.",
                icon: "success",
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            await Swal.fire({
                title: "Error!",
                text: "Failed to delete staff member",
                icon: "error"
            });
            throw error;
        }
    } else {
        throw new Error('Delete cancelled');
    }
};

export const addSupplier = async (supplierData: Omit<Supplier, 'id'>): Promise<Supplier> => {
    await simulateNetworkDelay(600);
    try {
        const suppliers = getFromStorage<Supplier[]>(STORAGE_KEYS.suppliers, []);
        const newSupplier: Supplier = {
            ...supplierData,
            id: `SUP${Date.now()}`
        };
        suppliers.unshift(newSupplier);
        saveToStorage(STORAGE_KEYS.suppliers, suppliers);
        
        await Swal.fire({
            title: "Success!",
            text: "Supplier added successfully!",
            icon: "success",
            timer: 2000,
            showConfirmButton: false
        });
        
        return newSupplier;
    } catch (error) {
        await Swal.fire({
            title: "Error!",
            text: "Failed to add supplier",
            icon: "error"
        });
        throw error;
    }
};

export const updateSupplier = async (supplierData: Supplier): Promise<Supplier> => {
    await simulateNetworkDelay(600);
    try {
        const suppliers = getFromStorage<Supplier[]>(STORAGE_KEYS.suppliers, []);
        const index = suppliers.findIndex(s => s.id === supplierData.id);
        if (index !== -1) {
            suppliers[index] = supplierData;
            saveToStorage(STORAGE_KEYS.suppliers, suppliers);
            
            await Swal.fire({
                title: "Success!",
                text: "Supplier updated successfully!",
                icon: "success",
                timer: 2000,
                showConfirmButton: false
            });
        }
        return supplierData;
    } catch (error) {
        await Swal.fire({
            title: "Error!",
            text: "Failed to update supplier",
            icon: "error"
        });
        throw error;
    }
};

export const deleteSupplier = async (id: string): Promise<void> => {
    await simulateNetworkDelay(500);
    const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    });

    if (result.isConfirmed) {
        try {
            const suppliers = getFromStorage<Supplier[]>(STORAGE_KEYS.suppliers, []);
            const filtered = suppliers.filter(s => s.id !== id);
            saveToStorage(STORAGE_KEYS.suppliers, filtered);
            
            await Swal.fire({
                title: "Deleted!",
                text: "Supplier has been deleted.",
                icon: "success",
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            await Swal.fire({
                title: "Error!",
                text: "Failed to delete supplier",
                icon: "error"
            });
            throw error;
        }
    } else {
        throw new Error('Delete cancelled');
    }
};


// --- POST Endpoints ---
export const addPurchase = async (purchaseData: Omit<Purchase, 'id'>): Promise<Purchase> => {
    await simulateNetworkDelay(600);
    try {
        const purchases = getFromStorage<Purchase[]>(STORAGE_KEYS.purchases, []);
        const newPurchase: Purchase = {
            ...purchaseData,
            id: `PUR${Date.now()}`
        };
        purchases.unshift(newPurchase); // Add to beginning for visibility
        saveToStorage(STORAGE_KEYS.purchases, purchases);
        
        await Swal.fire({
            title: "Success!",
            text: "Purchase added successfully!",
            icon: "success",
            timer: 2000,
            showConfirmButton: false
        });
        
        return newPurchase;
    } catch (error) {
        await Swal.fire({
            title: "Error!",
            text: "Failed to add purchase",
            icon: "error"
        });
        throw error;
    }
};

export const addSale = async (saleData: Omit<Sale, 'id'>): Promise<Sale> => {
    await simulateNetworkDelay(600);
    try {
        const sales = getFromStorage<Sale[]>(STORAGE_KEYS.sales, []);
        const newSale: Sale = {
            ...saleData,
            id: `SALE${Date.now()}`
        };
        sales.unshift(newSale);
        saveToStorage(STORAGE_KEYS.sales, sales);
        
        await Swal.fire({
            title: "Success!",
            text: "Sale added successfully!",
            icon: "success",
            timer: 2000,
            showConfirmButton: false
        });
        
        return newSale;
    } catch (error) {
        await Swal.fire({
            title: "Error!",
            text: "Failed to add sale",
            icon: "error"
        });
        throw error;
    }
};

// --- PUT Endpoint ---
export const updatePurchase = async (purchaseData: Purchase): Promise<Purchase> => {
    await simulateNetworkDelay(600);
    try {
        const purchases = getFromStorage<Purchase[]>(STORAGE_KEYS.purchases, []);
        const index = purchases.findIndex(p => p.id === purchaseData.id);
        if (index === -1) {
            throw new Error('Purchase not found');
        }
        purchases[index] = purchaseData;
        saveToStorage(STORAGE_KEYS.purchases, purchases);
        
        await Swal.fire({
            title: "Updated!",
            text: "Purchase updated successfully!",
            icon: "success",
            timer: 2000,
            showConfirmButton: false
        });
        
        return purchaseData;
    } catch (error) {
        await Swal.fire({
            title: "Error!",
            text: error instanceof Error ? error.message : "Failed to update purchase",
            icon: "error"
        });
        throw error;
    }
};

export const updateSale = async (saleData: Sale): Promise<Sale> => {
    await simulateNetworkDelay(600);
    try {
        const sales = getFromStorage<Sale[]>(STORAGE_KEYS.sales, []);
        const index = sales.findIndex(s => s.id === saleData.id);
        if (index === -1) {
            throw new Error('Sale not found');
        }
        sales[index] = saleData;
        saveToStorage(STORAGE_KEYS.sales, sales);
        
        await Swal.fire({
            title: "Updated!",
            text: "Sale updated successfully!",
            icon: "success",
            timer: 2000,
            showConfirmButton: false
        });
        
        return saleData;
    } catch (error) {
        await Swal.fire({
            title: "Error!",
            text: error instanceof Error ? error.message : "Failed to update sale",
            icon: "error"
        });
        throw error;
    }
};


// --- DELETE Endpoint ---
export const deletePurchase = async (purchaseId: string): Promise<void> => {
    const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    });

    if (result.isConfirmed) {
        await simulateNetworkDelay(600);
        const purchases = getFromStorage<Purchase[]>(STORAGE_KEYS.purchases, []);
        const updatedPurchases = purchases.filter(p => p.id !== purchaseId);
        saveToStorage(STORAGE_KEYS.purchases, updatedPurchases);
        
        await Swal.fire({
            title: "Deleted!",
            text: "Purchase has been deleted.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false
        });
    }
};

export const deleteSale = async (saleId: string): Promise<void> => {
    const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    });

    if (result.isConfirmed) {
        await simulateNetworkDelay(600);
        const sales = getFromStorage<Sale[]>(STORAGE_KEYS.sales, []);
        const updatedSales = sales.filter(s => s.id !== saleId);
        saveToStorage(STORAGE_KEYS.sales, updatedSales);
        
        await Swal.fire({
            title: "Deleted!",
            text: "Sale has been deleted.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false
        });
    }
};