// Data Management Utilities
import { 
    initialPurchases, 
    initialSales, 
    initialProducts, 
    initialSuppliers, 
    initialStaff, 
    initialRentals 
} from '../constants';

const STORAGE_KEYS = {
    purchases: 'saf_purchases',
    sales: 'saf_sales',
    products: 'saf_products',
    suppliers: 'saf_suppliers',
    staff: 'saf_staff',
    rentals: 'saf_rentals',
};

/**
 * Reset all data to initial values
 */
export const resetAllData = (): void => {
    if (confirm('⚠️ WARNING: This will delete all your data and reset to initial values. Are you sure?')) {
        localStorage.setItem(STORAGE_KEYS.purchases, JSON.stringify(initialPurchases));
        localStorage.setItem(STORAGE_KEYS.sales, JSON.stringify(initialSales));
        localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(initialProducts));
        localStorage.setItem(STORAGE_KEYS.suppliers, JSON.stringify(initialSuppliers));
        localStorage.setItem(STORAGE_KEYS.staff, JSON.stringify(initialStaff));
        localStorage.setItem(STORAGE_KEYS.rentals, JSON.stringify(initialRentals));
        
        alert('✅ Data has been reset to initial values. Please refresh the page.');
        window.location.reload();
    }
};

/**
 * Export all data as JSON file
 */
export const exportAllData = (): void => {
    const data = {
        exportDate: new Date().toISOString(),
        purchases: JSON.parse(localStorage.getItem(STORAGE_KEYS.purchases) || '[]'),
        sales: JSON.parse(localStorage.getItem(STORAGE_KEYS.sales) || '[]'),
        products: JSON.parse(localStorage.getItem(STORAGE_KEYS.products) || '[]'),
        suppliers: JSON.parse(localStorage.getItem(STORAGE_KEYS.suppliers) || '[]'),
        staff: JSON.parse(localStorage.getItem(STORAGE_KEYS.staff) || '[]'),
        rentals: JSON.parse(localStorage.getItem(STORAGE_KEYS.rentals) || '[]'),
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SAF_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

/**
 * Import all data from JSON file
 */
export const importAllData = (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target?.result as string);
                
                // Validate the data structure
                if (!data.purchases || !data.sales || !data.products || !data.suppliers || !data.staff || !data.rentals) {
                    throw new Error('Invalid backup file format');
                }

                // Confirm before importing
                if (confirm('⚠️ This will replace all current data with the backup. Continue?')) {
                    localStorage.setItem(STORAGE_KEYS.purchases, JSON.stringify(data.purchases));
                    localStorage.setItem(STORAGE_KEYS.sales, JSON.stringify(data.sales));
                    localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(data.products));
                    localStorage.setItem(STORAGE_KEYS.suppliers, JSON.stringify(data.suppliers));
                    localStorage.setItem(STORAGE_KEYS.staff, JSON.stringify(data.staff));
                    localStorage.setItem(STORAGE_KEYS.rentals, JSON.stringify(data.rentals));
                    
                    alert('✅ Data imported successfully! Please refresh the page.');
                    window.location.reload();
                }
                
                resolve();
            } catch (error) {
                alert('❌ Error importing data: ' + (error instanceof Error ? error.message : 'Unknown error'));
                reject(error);
            }
        };
        
        reader.onerror = () => {
            reject(new Error('Failed to read file'));
        };
        
        reader.readAsText(file);
    });
};

/**
 * Get storage usage information
 */
export const getStorageInfo = (): { used: string; total: string; percentage: number } => {
    let totalSize = 0;
    
    Object.values(STORAGE_KEYS).forEach(key => {
        const item = localStorage.getItem(key);
        if (item) {
            totalSize += item.length * 2; // UTF-16 = 2 bytes per character
        }
    });

    const totalSizeKB = (totalSize / 1024).toFixed(2);
    const maxSizeKB = '5120'; // 5MB typical localStorage limit
    const percentage = (totalSize / (5 * 1024 * 1024)) * 100;

    return {
        used: `${totalSizeKB} KB`,
        total: `${maxSizeKB} KB`,
        percentage: parseFloat(percentage.toFixed(2))
    };
};

/**
 * Clear all application data
 */
export const clearAllData = (): void => {
    if (confirm('⚠️ WARNING: This will permanently delete ALL data. This cannot be undone! Continue?')) {
        if (confirm('Are you absolutely sure? This action is IRREVERSIBLE!')) {
            Object.values(STORAGE_KEYS).forEach(key => {
                localStorage.removeItem(key);
            });
            
            alert('✅ All data has been cleared. The page will reload.');
            window.location.reload();
        }
    }
};
