
import React, { useState, useEffect, useMemo } from 'react';
import { Sale, Product } from '../types';
import DataTable from './DataTable';
import Modal from './Modal';
import { PrintIcon } from '../constants';

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

  return (
    <div>
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Sales</h1>
            <button onClick={handleAdd} className="px-4 py-2 bg-primary text-white rounded-lg shadow hover:bg-primary-dark transition">
                Add Sale
            </button>
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
