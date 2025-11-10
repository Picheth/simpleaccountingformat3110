
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Purchases from './components/Purchases';
import Sales from './components/Sales';
import Inventory from './components/Inventory';
import Products from './components/Products';
import Suppliers from './components/Suppliers';
import StaffPage from './components/Staff';
import RentalPage from './components/Rental';
import NSSF from './components/NSSF';
import Reports from './components/Reports';
import PurchaseInvoice from './components/PurchaseInvoice';
import SaleInvoice from './components/SaleInvoice';
import Spinner from './components/Spinner';
import { navItems } from './constants';
import * as api from './api';
import { Product, Purchase, Sale, Staff, Rental, Supplier } from './types';
import useLocalStorage from './hooks/useLocalStorage';

const App: React.FC = () => {
    const [activePage, setActivePage] = useState('Dashboard');
    const [loading, setLoading] = useState(true);

    // Use localStorage to persist data
    const [products, setProducts] = useLocalStorage<Product[]>('saf_products', []);
    const [suppliers, setSuppliers] = useLocalStorage<Supplier[]>('saf_suppliers', []);
    const [staff, setStaff] = useLocalStorage<Staff[]>('saf_staff', []);
    const [purchases, setPurchases] = useLocalStorage<Purchase[]>('saf_purchases', []);
    const [sales, setSales] = useLocalStorage<Sale[]>('saf_sales', []);
    const [rentals, setRentals] = useLocalStorage<Rental[]>('saf_rentals', []);
    
    const [purchaseToPrint, setPurchaseToPrint] = useState<Purchase | null>(null);
    const [saleToPrint, setSaleToPrint] = useState<Sale | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                // Only load from API if localStorage is empty
                if (products.length === 0 || suppliers.length === 0 || staff.length === 0) {
                    const [
                        productsData, suppliersData, staffData, purchasesData, salesData, rentalsData
                    ] = await Promise.all([
                        api.getProducts(), api.getSuppliers(), api.getStaff(),
                        api.getPurchases(), api.getSales(), api.getRentals(),
                    ]);
                    setProducts(productsData);
                    setSuppliers(suppliersData);
                    setStaff(staffData);
                    setPurchases(purchasesData);
                    setSales(salesData);
                    setRentals(rentalsData);
                }
            } catch (error) {
                console.error("Failed to fetch initial data:", error);
                // Optionally, set an error state here to show a message to the user
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const addPurchase = async (purchase: Omit<Purchase, 'id'>) => {
        const newPurchase = await api.addPurchase(purchase);
        setPurchases(prev => [newPurchase, ...prev]);
    };
    
    const updatePurchase = async (purchase: Purchase) => {
        const updatedPurchase = await api.updatePurchase(purchase);
        setPurchases(prev => prev.map(p => p.id === updatedPurchase.id ? updatedPurchase : p));
    };

    const deletePurchase = async (purchaseId: string) => {
        await api.deletePurchase(purchaseId);
        setPurchases(prev => prev.filter(p => p.id !== purchaseId));
    };

    const addSale = async (sale: Omit<Sale, 'id'>) => {
        const newSale = await api.addSale(sale);
        setSales(prev => [newSale, ...prev]);
    };

    const updateSale = async (sale: Sale) => {
        const updatedSale = await api.updateSale(sale);
        setSales(prev => prev.map(s => s.id === updatedSale.id ? updatedSale : s));
    };

    const deleteSale = async (saleId: string) => {
        await api.deleteSale(saleId);
        setSales(prev => prev.filter(s => s.id !== saleId));
    };

    const addStaff = async (staffData: Omit<Staff, 'id'>) => {
        const newStaff = await api.addStaff(staffData);
        setStaff(prev => [newStaff, ...prev]);
    };

    const updateStaff = async (staffData: Staff) => {
        const updatedStaff = await api.updateStaff(staffData);
        setStaff(prev => prev.map(s => s.id === updatedStaff.id ? updatedStaff : s));
    };

    const deleteStaff = async (staffId: string) => {
        try {
            await api.deleteStaff(staffId);
            setStaff(prev => prev.filter(s => s.id !== staffId));
        } catch (error) {
            // Delete was cancelled or failed
            console.log('Delete cancelled or failed');
        }
    };

    const addSupplier = async (supplierData: Omit<Supplier, 'id'>) => {
        const newSupplier = await api.addSupplier(supplierData);
        setSuppliers(prev => [newSupplier, ...prev]);
    };

    const updateSupplier = async (supplierData: Supplier) => {
        const updatedSupplier = await api.updateSupplier(supplierData);
        setSuppliers(prev => prev.map(s => s.id === updatedSupplier.id ? updatedSupplier : s));
    };

    const deleteSupplier = async (supplierId: string) => {
        try {
            await api.deleteSupplier(supplierId);
            setSuppliers(prev => prev.filter(s => s.id !== supplierId));
        } catch (error) {
            // Delete was cancelled or failed
            console.log('Delete cancelled or failed');
        }
    };


    const renderPage = () => {
        switch (activePage) {
            case 'Dashboard':
                return <Dashboard purchases={purchases} sales={sales} />;
            case 'Purchases':
                return <Purchases purchases={purchases} suppliers={suppliers} products={products} addPurchase={addPurchase} updatePurchase={updatePurchase} deletePurchase={deletePurchase} onPrint={setPurchaseToPrint} />;
            case 'Sales':
                return <Sales sales={sales} products={products} addSale={addSale} updateSale={updateSale} deleteSale={deleteSale} onPrint={setSaleToPrint} />;
            case 'Inventory':
                return <Inventory products={products} purchases={purchases} sales={sales} />;
            case 'Products':
                return <Products products={products} />;
            case 'Suppliers':
                return <Suppliers suppliers={suppliers} purchases={purchases} addSupplier={addSupplier} updateSupplier={updateSupplier} deleteSupplier={deleteSupplier} />;
            case 'Staff':
                return <StaffPage staff={staff} addStaff={addStaff} updateStaff={updateStaff} deleteStaff={deleteStaff} />;
            case 'Rental':
                return <RentalPage rentals={rentals} />;
            case 'NSSF':
                return <NSSF />;
            case 'Reports':
                return <Reports purchases={purchases} sales={sales} suppliers={suppliers} />;
            default:
                return <Dashboard purchases={purchases} sales={sales} />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar navItems={navItems} activePage={activePage} setActivePage={setActivePage} />
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow-sm p-4">
                    <h2 className="text-xl font-semibold text-gray-700">{activePage}</h2>
                </header>
                <div className="flex-1 p-6 overflow-y-auto">
                    {loading ? <Spinner /> : renderPage()}
                </div>
            </main>
            <PurchaseInvoice purchase={purchaseToPrint} suppliers={suppliers} onClose={() => setPurchaseToPrint(null)} />
            <SaleInvoice sale={saleToPrint} onClose={() => setSaleToPrint(null)} />
        </div>
    );
};

export default App;