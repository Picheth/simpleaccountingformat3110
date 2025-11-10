
import React, { useState, useEffect, useMemo } from 'react';
import { Sale, Product } from '../types';
import DataTable from './DataTable';
import Modal from './Modal';
import { PrintIcon } from '../constants';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';

interface SalesProps {
  sales: Sale[];
  products: Product[];
  addSale: (sale: Omit<Sale, 'id'>) => void;
  updateSale: (sale: Sale) => void;
  deleteSale: (id: string) => void;
  onPrint: (sale: Sale) => void;
}

const SaleForm: React.FC<{ 
    onSave: (data: Omit<Sale, 'id'>) => void; 
    onClose: () => void; 
    products: Product[];
    initialData?: Sale | null;
}> = ({ onSave, onClose, products, initialData }) => {
    const getInitialFormData = (): Omit<Sale, 'id'> => {
        const firstProduct = products[0];
        return {
            date: new Date().toISOString().split('T')[0],
            invoice: '',
            customer: '',
            productId: firstProduct?.id || '',
            description: firstProduct?.name || '',
            quantity: 1,
            unit: 'pcs',
            cost: 0,
            goods: 0,
            services: 0,
            others: 0,
            salesTax: 0,
            cgs: 0,
            seller: 'Admin',
            exchangeRate: 4100
        };
    };

    const [formData, setFormData] = useState<Omit<Sale, 'id'>>(getInitialFormData());

    useEffect(() => {
        if (initialData) {
            const { id, ...dataToEdit } = initialData;
            setFormData(dataToEdit);
        } else {
            setFormData(getInitialFormData());
        }
    }, [initialData, products]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const numericFields = ['quantity', 'cost', 'goods', 'services', 'others', 'cgs', 'exchangeRate', 'salesTax'];
        const isNumber = numericFields.includes(name);
        const numValue = parseFloat(value) || 0;

        setFormData(prevData => {
            let newData = { ...prevData, [name]: isNumber ? numValue : value };

            if (name === 'productId') {
                const selectedProduct = products.find(p => p.id === value);
                if (selectedProduct) {
                    newData.description = selectedProduct.name;
                }
            }
            
            if (name === 'quantity' || name === 'cost') {
                const quantity = name === 'quantity' ? numValue : newData.quantity;
                const cost = name === 'cost' ? numValue : newData.cost;
                newData.goods = quantity * cost;
            }

            return newData;
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const totalAmount = formData.goods + formData.services + formData.others + formData.salesTax;

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="date" type="date" value={formData.date} onChange={handleChange} className="p-2 border rounded-md" required />
                <input name="invoice" placeholder="Invoice #" value={formData.invoice} onChange={handleChange} className="p-2 border rounded-md" required />
                <input name="customer" placeholder="Customer" value={formData.customer} onChange={handleChange} className="p-2 border rounded-md" required />
                <input name="vatTin" placeholder="VAT TIN" value={formData.vatTin || ''} onChange={handleChange} className="p-2 border rounded-md" />
                <div className="md:col-span-2">
                    <label htmlFor="productId" className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                    <select id="productId" name="productId" value={formData.productId} onChange={handleChange} className="p-2 border rounded-md w-full" required>
                        {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                </div>
                <input name="description" value={formData.description} className="p-2 border rounded-md bg-gray-100 md:col-span-2" readOnly />

                <input name="quantity" type="number" placeholder="Quantity" value={formData.quantity} onChange={handleChange} className="p-2 border rounded-md" />
                <input name="unit" placeholder="Unit" value={formData.unit} onChange={handleChange} className="p-2 border rounded-md" />
                <input name="cost" type="number" step="0.01" placeholder="Unit Price (KHR)" value={formData.cost} onChange={handleChange} className="p-2 border rounded-md" />
                <input name="services" type="number" step="0.01" placeholder="Services (KHR)" value={formData.services} onChange={handleChange} className="p-2 border rounded-md" />
                <input name="salesTax" type="number" step="0.01" placeholder="Sales Tax (KHR)" value={formData.salesTax} onChange={handleChange} className="p-2 border rounded-md" />
                <input name="cgs" type="number" step="0.01" placeholder="Cost of Goods Sold (CGS)" value={formData.cgs} onChange={handleChange} className="p-2 border rounded-md" />
                <input name="seller" placeholder="Seller" value={formData.seller} onChange={handleChange} className="p-2 border rounded-md" />
                 <div className="p-2 bg-gray-100 rounded text-right md:col-span-2">
                    Total Amount: <strong className="text-lg">{totalAmount.toLocaleString()} ៛</strong>
                </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark">Save Sale</button>
            </div>
        </form>
    );
};

const Sales: React.FC<SalesProps> = ({ sales, products, addSale, updateSale, deleteSale, onPrint }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredSales = useMemo(() => {
    return sales.filter(sale => {
      // Search Term Filter
      const lowercasedTerm = searchTerm.toLowerCase();
      const termMatch = !searchTerm || 
        sale.customer.toLowerCase().includes(lowercasedTerm) ||
        sale.description.toLowerCase().includes(lowercasedTerm);

      if (!termMatch) return false;

      // Date Range Filter
      if (startDate || endDate) {
        if (!sale.date || isNaN(new Date(sale.date).getTime())) return false;
        const itemDate = new Date(sale.date);
        itemDate.setHours(0, 0, 0, 0);

        if (startDate) {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            if (itemDate < start) return false;
        }
        if (endDate) {
            const end = new Date(endDate);
            end.setHours(0, 0, 0, 0);
            if (itemDate > end) return false;
        }
      }

      return true;
    });
  }, [sales, searchTerm, startDate, endDate]);

  const columns: {
    header: string;
    accessor: keyof Sale | ((item: Sale) => React.ReactNode);
    className?: string;
  }[] = [
    { header: 'Date', accessor: 'date' },
    { header: 'Invoice', accessor: 'invoice' },
    { header: 'Customer', accessor: 'customer' },
    { header: 'Description', accessor: 'description' },
    { header: 'Qty', accessor: 'quantity', className: 'text-right' },
    { header: 'Unit Price', accessor: (item: Sale) => `${item.cost.toLocaleString()} ៛`, className: 'text-right' },
    { header: 'Total Amount', accessor: (item: Sale) => `${(item.goods + item.services + item.others + item.salesTax).toLocaleString()} ៛`, className: 'text-right font-semibold' },
    { header: 'COGS', accessor: (item: Sale) => `${item.cgs.toLocaleString()} ៛`, className: 'text-right text-red-500' },
    { header: 'Profit', accessor: (item: Sale) => `${(item.goods + item.services + item.others - item.cgs).toLocaleString()} ៛`, className: 'text-right text-green-600' },
    { header: 'Seller', accessor: 'seller' },
  ];
  
  const handleAdd = () => {
    setEditingSale(null);
    setIsModalOpen(true);
  };
  
  const handleEdit = (sale: Sale) => {
    setEditingSale(sale);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this sale record?')) {
      deleteSale(id);
    }
  };
  
  const handleSave = (saleData: Omit<Sale, 'id'>) => {
    if (editingSale) {
        updateSale({ ...saleData, id: editingSale.id });
    } else {
        addSale(saleData);
    }
    setIsModalOpen(false);
    setEditingSale(null);
  };

  const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>;
  const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
  const ExcelIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;

  const exportToExcel = () => {
    // Prepare data for Excel
    const excelData = filteredSales.map(sale => {
      const productName = products.find(p => p.id === sale.productId)?.name || sale.productId;
      const totalAmount = sale.goods + sale.services + sale.others + sale.salesTax;
      const grossProfit = (sale.goods + sale.services + sale.others) - sale.cgs;
      const totalUsd = sale.exchangeRate > 0 ? totalAmount / sale.exchangeRate : 0;

      return {
        'Date': sale.date,
        'Invoice': sale.invoice,
        'Customer': sale.customer,
        'VAT TIN': sale.vatTin || '',
        'Product ID': sale.productId,
        'Product Name': productName,
        'Description': sale.description,
        'Quantity': sale.quantity,
        'Unit': sale.unit,
        'Unit Price (KHR)': sale.cost,
        'Goods (KHR)': sale.goods,
        'Services (KHR)': sale.services,
        'Others (KHR)': sale.others,
        'Sales Tax (KHR)': sale.salesTax,
        'Total Amount (KHR)': totalAmount,
        'Cost of Goods Sold (KHR)': sale.cgs,
        'Gross Profit (KHR)': grossProfit,
        'Exchange Rate': sale.exchangeRate,
        'Total (USD)': totalUsd.toFixed(2),
        'Seller': sale.seller,
      };
    });

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    
    // Set column widths
    const columnWidths = [
      { wch: 12 }, // Date
      { wch: 15 }, // Invoice
      { wch: 20 }, // Customer
      { wch: 15 }, // VAT TIN
      { wch: 12 }, // Product ID
      { wch: 25 }, // Product Name
      { wch: 30 }, // Description
      { wch: 10 }, // Quantity
      { wch: 8 },  // Unit
      { wch: 15 }, // Unit Price
      { wch: 15 }, // Goods
      { wch: 15 }, // Services
      { wch: 15 }, // Others
      { wch: 15 }, // Sales Tax
      { wch: 18 }, // Total Amount
      { wch: 20 }, // CGS
      { wch: 18 }, // Gross Profit
      { wch: 12 }, // Exchange Rate
      { wch: 15 }, // Total USD
      { wch: 15 }, // Seller
    ];
    worksheet['!cols'] = columnWidths;

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sales');

    // Generate filename with current date
    const fileName = `Sales_${new Date().toISOString().split('T')[0]}.xlsx`;

    // Save file
    XLSX.writeFile(workbook, fileName);
  };

  const importFromExcel = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Get raw data to access cell types
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false, defval: '' }) as any[];

        let importedCount = 0;
        let errorCount = 0;

        // Helper function to convert Excel date
        const parseExcelDate = (dateValue: any): string => {
          if (!dateValue) return new Date().toISOString().split('T')[0];
          
          // If it's already in YYYY-MM-DD format
          if (typeof dateValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
            return dateValue;
          }
          
          // If it's a Date object
          if (dateValue instanceof Date && !isNaN(dateValue.getTime())) {
            const year = dateValue.getFullYear();
            const month = String(dateValue.getMonth() + 1).padStart(2, '0');
            const day = String(dateValue.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
          }
          
          // If it's Excel serial number
          if (typeof dateValue === 'number') {
            // Excel date serial: days since 1900-01-01 (with 1900 leap year bug)
            const excelEpoch = new Date(1900, 0, 1);
            const daysOffset = dateValue > 59 ? dateValue - 2 : dateValue - 1; // Account for Excel 1900 leap year bug
            const date = new Date(excelEpoch.getTime() + daysOffset * 86400 * 1000);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
          }
          
          // Try to parse as date string
          try {
            const date = new Date(dateValue);
            if (!isNaN(date.getTime())) {
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const day = String(date.getDate()).padStart(2, '0');
              return `${year}-${month}-${day}`;
            }
          } catch (err) {
            console.error('Date parsing error:', err);
          }
          
          return new Date().toISOString().split('T')[0];
        };

        for (const row of jsonData) {
          try {
            // Find product by name or ID
            const product = products.find(p => 
              p.name.toLowerCase() === String(row['Product Name'] || '').toLowerCase() ||
              p.id === row['Product ID']
            );

            const saleData: Omit<Sale, 'id'> = {
              date: parseExcelDate(row['Date']),
              invoice: row['Invoice'] || '',
              customer: row['Customer'] || '',
              vatTin: row['VAT TIN'] || '',
              productId: product?.id || products[0]?.id || '',
              description: row['Description'] || row['Product Name'] || '',
              quantity: Number(row['Quantity']) || 0,
              unit: row['Unit'] || 'pcs',
              cost: Number(row['Unit Price (KHR)']) || 0,
              goods: Number(row['Goods (KHR)']) || 0,
              services: Number(row['Services (KHR)']) || 0,
              others: Number(row['Others (KHR)']) || 0,
              salesTax: Number(row['Sales Tax (KHR)']) || 0,
              cgs: Number(row['Cost of Goods Sold (KHR)']) || 0,
              seller: row['Seller'] || 'Admin',
              exchangeRate: Number(row['Exchange Rate']) || 4100,
            };

            // Add sale sequentially to avoid localStorage conflicts
            await addSale(saleData);
            importedCount++;
          } catch (error) {
            console.error('Error importing row:', row, error);
            errorCount++;
          }
        }

        // Show import results
        if (importedCount > 0) {
          await Swal.fire({
            title: "Import Complete!",
            html: `✅ Successfully imported: <strong>${importedCount}</strong><br>❌ Errors: <strong>${errorCount}</strong>`,
            icon: importedCount > 0 ? "success" : "warning",
            timer: 3000,
            showConfirmButton: true
          });
        } else {
          await Swal.fire({
            title: "No Data Imported",
            text: `All ${errorCount} rows had errors. Please check the file format.`,
            icon: "error"
          });
        }

        // Reset the file input
        event.target.value = '';
      } catch (error) {
        console.error('Error reading Excel file:', error);
        await Swal.fire({
          title: "Import Error",
          text: "Error reading Excel file. Please check the file format.",
          icon: "error"
        });
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div>
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Sales</h1>
            <div className="flex gap-2">
                <button 
                    onClick={exportToExcel} 
                    className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition flex items-center gap-2"
                >
                    <ExcelIcon />
                    Export to Excel
                </button>
                <label className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition flex items-center gap-2 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Import from Excel
                    <input 
                        type="file" 
                        accept=".xlsx,.xls" 
                        onChange={importFromExcel} 
                        className="hidden"
                    />
                </label>
                <button onClick={handleAdd} className="px-4 py-2 bg-primary text-white rounded-lg shadow hover:bg-primary-dark transition">
                    Add Sale
                </button>
            </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                    <label htmlFor="search-input" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                    <input 
                        id="search-input"
                        type="text"
                        placeholder="Search customer or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
                <div>
                    <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input 
                        type="date" 
                        id="start-date"
                        value={startDate} 
                        onChange={e => setStartDate(e.target.value)}
                        className="p-2 border rounded-md w-full"
                    />
                </div>
                <div>
                    <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input 
                        type="date" 
                        id="end-date"
                        value={endDate}
                        onChange={e => setEndDate(e.target.value)}
                        className="p-2 border rounded-md w-full"
                    />
                </div>
            </div>
        </div>

        <DataTable<Sale> 
            columns={columns} 
            data={filteredSales}
            renderActions={(sale) => (
                <div className="flex items-center space-x-2">
                    <button onClick={() => onPrint(sale)} className="p-1 text-gray-500 hover:text-primary" title="Print"><PrintIcon /></button>
                    <button onClick={() => handleEdit(sale)} className="p-1 text-gray-500 hover:text-blue-600" title="Edit"><EditIcon /></button>
                    <button onClick={() => handleDelete(sale.id)} className="p-1 text-gray-500 hover:text-red-600" title="Delete"><DeleteIcon /></button>
                </div>
            )}
        />
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingSale ? 'Edit Sale' : 'New Sale'}>
            <SaleForm 
                products={products} 
                onSave={handleSave} 
                onClose={() => setIsModalOpen(false)}
                initialData={editingSale}
            />
        </Modal>
    </div>
  );
};

export default Sales;
