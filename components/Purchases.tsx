
import React, { useState, useEffect, useMemo } from 'react';
import { Purchase, Supplier, PurchaseStatus, Product } from '../types';
import DataTable from './DataTable';
import Modal from './Modal';
import { PrintIcon } from '../constants';

interface PurchasesProps {
  purchases: Purchase[];
  suppliers: Supplier[];
  products: Product[];
  addPurchase: (purchase: Omit<Purchase, 'id'>) => void;
  updatePurchase: (purchase: Purchase) => void;
  deletePurchase: (id: string) => void;
  onPrint: (purchase: Purchase) => void;
}

const PurchaseForm: React.FC<{ 
    onSave: (data: Omit<Purchase, 'id'>) => void; 
    onClose: () => void; 
    suppliers: Supplier[];
    products: Product[];
    initialData?: Purchase | null;
}> = ({ onSave, onClose, suppliers, products, initialData }) => {
    const [isBreakdownVisible, setIsBreakdownVisible] = useState(true);
    const getInitialFormData = (): Omit<Purchase, 'id'> => {
        const firstProduct = products[0];
        return {
            date: new Date().toISOString().split('T')[0], type: 'Goods', invoice: '', supplierId: suppliers[0]?.id || '',
            productId: firstProduct?.id || '',
            vatTin: '', 
            description: firstProduct?.name || '', 
            quantity: 1, unit: 'pcs',
            cost: 0, assets: 0, goodsForSale: 0, services: 0, staffCost: 0, utilities: 0, rental: 0, others: 0, salesTax: 0, exchangeRate: 4100, staffUser: 'Admin', status: 'Pending'
        };
    };
    
    const [formData, setFormData] = useState<Omit<Purchase, 'id'>>(getInitialFormData());
    
    useEffect(() => {
        if (initialData) {
            const { id, ...dataToEdit } = initialData;
            setFormData(dataToEdit);
        } else {
            setFormData(getInitialFormData());
        }
    }, [initialData, suppliers, products]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const numericFields = ['quantity', 'cost', 'assets', 'goodsForSale', 'services', 'staffCost', 'utilities', 'rental', 'others', 'exchangeRate', 'primaryCost', 'salesTax'];
        const isNumber = numericFields.includes(name);
        const numValue = parseFloat(value) || 0;

        setFormData(prevData => {
            let newData = { ...prevData, [name]: isNumber ? numValue : value };

            if (name === 'type') {
                const newType = value;
                let newDescription = '';
                let newProductId: string | undefined = undefined;
    
                if (newType === 'Goods') {
                    const firstProduct = products[0];
                    newProductId = firstProduct?.id || '';
                    newDescription = firstProduct?.name || '';
                }
                
                return {
                    ...newData,
                    productId: newProductId,
                    description: newDescription,
                    quantity: 1,
                    cost: 0,
                    assets: 0, goodsForSale: 0, services: 0, staffCost: 0, utilities: 0, rental: 0, others: 0,
                };
            }

            if (name === 'productId') {
                const selectedProductID = products.find(p => p.id === value);
                if (selectedProductID) {
                    newData.description = selectedProductID.name;
                }
            }
            
            if ((name === 'quantity' || name === 'cost') && newData.type === 'Goods') {
                const quantity = name === 'quantity' ? numValue : newData.quantity;
                const cost = name === 'cost' ? numValue : newData.cost;
                newData.goodsForSale = quantity * cost;
            }

            if (name === 'primaryCost') {
                newData = { ...newData, assets: 0, goodsForSale: 0, services: 0, staffCost: 0, utilities: 0, rental: 0, others: 0 };
                
                switch(newData.type) {
                    case 'Services': newData.services = numValue; break;
                    case 'Assets': newData.assets = numValue; break;
                    case 'Utilities': newData.utilities = numValue; break;
                    case 'Rental': newData.rental = numValue; break;
                    case 'Staff Cost': newData.staffCost = numValue; break;
                    case 'Others': newData.others = numValue; break;
                }
            }

            return newData;
        });
    };

    const getPrimaryCost = (data: Omit<Purchase, 'id'>): number => {
        switch(data.type) {
            case 'Services': return data.services;
            case 'Assets': return data.assets;
            case 'Utilities': return data.utilities;
            case 'Rental': return data.rental;
            case 'Staff Cost': return data.staffCost;
            case 'Others': return data.others;
            default: return 0;
        }
    };

    const isReadOnly = (fieldName: string, type: string): boolean => {
        const typeToFieldMap: Record<string, string> = {
            'Goods': 'goodsForSale', 'Services': 'services', 'Assets': 'assets', 'Utilities': 'utilities',
            'Rental': 'rental', 'Staff Cost': 'staffCost', 'Others': 'others',
        };
        return typeToFieldMap[type] === fieldName;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const totalCost = formData.assets + formData.goodsForSale + formData.services + formData.staffCost + formData.utilities + formData.rental + formData.others + formData.salesTax;

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input name="date" type="date" value={formData.date} onChange={handleChange} className="p-2 border rounded-md" required />
                <input name="invoice" placeholder="Invoice #" value={formData.invoice} onChange={handleChange} className="p-2 border rounded-md" required />
                <select name="status" value={formData.status} onChange={handleChange} className="p-2 border rounded-md">
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Paid">Paid</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
                <select name="type" value={formData.type} onChange={handleChange} className="p-2 border rounded-md">
                    <option>Goods</option>
                    <option>Services</option>
                    <option>Assets</option>
                    <option>Utilities</option>
                    <option>Rental</option>
                    <option>Staff Cost</option>
                    <option>Others</option>
                </select>
                <select name="supplierId" value={formData.supplierId} onChange={handleChange} className="p-2 border rounded-md" required>
                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <input name="vatTin" placeholder="VAT TIN" value={formData.vatTin} onChange={handleChange} className="p-2 border rounded-md" />

                {formData.type === 'Goods' ? (
                    <>
                        <div className="md:col-span-1">
                            <label htmlFor="productId" className="block text-sm font-medium text-gray-700 mb-1">Product ID</label>
                            <select id="productId" name="productId" value={formData.productId || ''} onChange={handleChange} className="p-2 border rounded-md w-full" required>
                                {products.map(p => <option key={p.id} value={p.id}>{p.id}</option>)}
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <input id="description" name="description" value={formData.description} className="p-2 border rounded-md w-full bg-gray-100" readOnly required />
                        </div>
                    </>
                ) : (
                    <input name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="p-2 border rounded-md col-span-full" required />
                )}
                
                {formData.type === 'Goods' ? (
                    <>
                        <input name="quantity" type="number" placeholder="Quantity" value={formData.quantity} onChange={handleChange} className="p-2 border rounded-md" />
                        <input name="unit" placeholder="Unit (e.g., pcs)" value={formData.unit} onChange={handleChange} className="p-2 border rounded-md" />
                        <input name="cost" type="number" step="0.01" placeholder="Unit Price (KHR)" value={formData.cost} onChange={handleChange} className="p-2 border rounded-md" />
                    </>
                ) : (
                    <div className="md:col-span-3">
                         <label htmlFor="primaryCost" className="block text-sm font-medium text-gray-700 mb-1">Amount (KHR)</label>
                        <input 
                            id="primaryCost"
                            name="primaryCost" 
                            type="number" 
                            step="0.01" 
                            placeholder="Total Amount (KHR)" 
                            value={getPrimaryCost(formData)}
                            onChange={handleChange}
                            className="p-2 border rounded-md w-full"
                        />
                    </div>
                )}
            </div>

            <fieldset className="border p-4 rounded-md">
                <legend 
                    className="px-2 font-semibold text-gray-700 cursor-pointer flex items-center select-none"
                    onClick={() => setIsBreakdownVisible(!isBreakdownVisible)}
                >
                    Cost Breakdown (KHR)
                    <svg className={`w-4 h-4 ml-2 transition-transform ${isBreakdownVisible ? '' : '-rotate-90'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </legend>
                {isBreakdownVisible && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                         <div>
                            <label htmlFor="goodsForSale" className="block text-sm font-medium text-gray-700 mb-1">Goods for Sale</label>
                            <input id="goodsForSale" name="goodsForSale" type="number" step="0.01" value={formData.goodsForSale} onChange={handleChange} className={`p-2 border rounded-md w-full ${isReadOnly('goodsForSale', formData.type) ? 'bg-gray-100' : ''}`} readOnly={isReadOnly('goodsForSale', formData.type)} />
                        </div>
                        <div>
                            <label htmlFor="assets" className="block text-sm font-medium text-gray-700 mb-1">Assets</label>
                            <input id="assets" name="assets" type="number" step="0.01" value={formData.assets} onChange={handleChange} className={`p-2 border rounded-md w-full ${isReadOnly('assets', formData.type) ? 'bg-gray-100' : ''}`} readOnly={isReadOnly('assets', formData.type)} />
                        </div>
                        <div>
                            <label htmlFor="services" className="block text-sm font-medium text-gray-700 mb-1">Services</label>
                            <input id="services" name="services" type="number" step="0.01" value={formData.services} onChange={handleChange} className={`p-2 border rounded-md w-full ${isReadOnly('services', formData.type) ? 'bg-gray-100' : ''}`} readOnly={isReadOnly('services', formData.type)} />
                        </div>
                        <div>
                            <label htmlFor="staffCost" className="block text-sm font-medium text-gray-700 mb-1">Staff Cost</label>
                            <input id="staffCost" name="staffCost" type="number" step="0.01" value={formData.staffCost} onChange={handleChange} className={`p-2 border rounded-md w-full ${isReadOnly('staffCost', formData.type) ? 'bg-gray-100' : ''}`} readOnly={isReadOnly('staffCost', formData.type)} />
                        </div>
                        <div>
                            <label htmlFor="utilities" className="block text-sm font-medium text-gray-700 mb-1">Utilities</label>
                            <input id="utilities" name="utilities" type="number" step="0.01" value={formData.utilities} onChange={handleChange} className={`p-2 border rounded-md w-full ${isReadOnly('utilities', formData.type) ? 'bg-gray-100' : ''}`} readOnly={isReadOnly('utilities', formData.type)} />
                        </div>
                        <div>
                            <label htmlFor="rental" className="block text-sm font-medium text-gray-700 mb-1">Rental</label>
                            <input id="rental" name="rental" type="number" step="0.01" value={formData.rental} onChange={handleChange} className={`p-2 border rounded-md w-full ${isReadOnly('rental', formData.type) ? 'bg-gray-100' : ''}`} readOnly={isReadOnly('rental', formData.type)} />
                        </div>
                        <div>
                            <label htmlFor="others" className="block text-sm font-medium text-gray-700 mb-1">Others</label>
                            <input id="others" name="others" type="number" step="0.01" value={formData.others} onChange={handleChange} className={`p-2 border rounded-md w-full ${isReadOnly('others', formData.type) ? 'bg-gray-100' : ''}`} readOnly={isReadOnly('others', formData.type)} />
                        </div>
                    </div>
                )}
            </fieldset>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <div>
                    <label htmlFor="salesTax" className="block text-sm font-medium text-gray-700 mb-1">Sales Tax (KHR)</label>
                    <input id="salesTax" name="salesTax" type="number" step="0.01" value={formData.salesTax} onChange={handleChange} className="p-2 border rounded-md w-full" />
                </div>
                <div>
                    <label htmlFor="exchangeRate" className="block text-sm font-medium text-gray-700 mb-1">Exchange Rate</label>
                    <input id="exchangeRate" name="exchangeRate" type="number" value={formData.exchangeRate} onChange={handleChange} className="p-2 border rounded-md w-full" />
                </div>
                <div>
                    <label htmlFor="staffUser" className="block text-sm font-medium text-gray-700 mb-1">Staff/User</label>
                    <input id="staffUser" name="staffUser" value={formData.staffUser} onChange={handleChange} className="p-2 border rounded-md w-full" />
                </div>
            </div>
            
            <div className="p-2 bg-gray-100 rounded text-right">
                Total Amount: <strong className="text-lg">{totalCost.toLocaleString()} ៛</strong>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark">Save Purchase</button>
            </div>
        </form>
    );
};

const Purchases: React.FC<PurchasesProps> = ({ purchases, suppliers, products, addPurchase, updatePurchase, deletePurchase, onPrint }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState<Purchase | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredPurchases = useMemo(() => {
    return purchases.filter(purchase => {
      // Search Term Filter
      const lowercasedTerm = searchTerm.toLowerCase();
      const supplierName = suppliers.find(s => s.id === purchase.supplierId)?.name || '';
      const termMatch = !searchTerm || 
        purchase.description.toLowerCase().includes(lowercasedTerm) ||
        supplierName.toLowerCase().includes(lowercasedTerm);

      if (!termMatch) return false;

      // Date Range Filter
      if (startDate || endDate) {
        if (!purchase.date || isNaN(new Date(purchase.date).getTime())) return false;
        const itemDate = new Date(purchase.date);
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

      // Status Filter
      if (statusFilter !== 'All' && purchase.status !== statusFilter) {
          return false;
      }

      return true;
    });
  }, [purchases, suppliers, searchTerm, startDate, endDate, statusFilter]);

  const statusColors: Record<PurchaseStatus, string> = {
    Pending: 'bg-yellow-100 text-yellow-800',
    Approved: 'bg-blue-100 text-blue-800',
    Paid: 'bg-green-100 text-green-800',
    Cancelled: 'bg-red-100 text-red-800',
  };

  const columns: {
    header: string;
    accessor: keyof Purchase | ((item: Purchase) => React.ReactNode);
    className?: string;
  }[] = [
    { header: 'Date', accessor: 'date' },
    { header: 'Type', accessor: 'type' },
    { 
        header: 'Status', 
        accessor: (p: Purchase) => (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[p.status]}`}>
            {p.status}
          </span>
        )
      },
    { header: 'Invoice', accessor: 'invoice' },
    { header: 'Supplier', accessor: p => suppliers.find(s => s.id === p.supplierId)?.name || p.supplierId },
    { header: 'Description', accessor: 'description', className: 'min-w-[200px]' },
    { header: 'Qty', accessor: 'quantity', className: 'text-right' },
    { header: 'Unit Price', accessor: p => `${p.cost.toLocaleString()} ៛`, className: 'text-right' },
    { header: 'Total Cost', accessor: (item: Purchase) => {
        const total = item.assets + item.goodsForSale + item.services + item.staffCost + item.utilities + item.rental + item.others + item.salesTax;
        return `${total.toLocaleString()} ៛`;
      }, className: 'text-right font-semibold bg-gray-50'
    },
    { header: 'Total (USD)', accessor: (item: Purchase) => {
        const total = item.assets + item.goodsForSale + item.services + item.staffCost + item.utilities + item.rental + item.others + item.salesTax;
        if (item.exchangeRate === 0) return '$0.00';
        const totalUsd = total / item.exchangeRate;
        return `$${totalUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      }, className: 'text-right font-semibold'
    },
    { header: 'Staff/User', accessor: 'staffUser' },
  ];
  
  const handleAdd = () => {
    setEditingPurchase(null);
    setIsModalOpen(true);
  };

  const handleEdit = (purchase: Purchase) => {
    setEditingPurchase(purchase);
    setIsModalOpen(true);
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this purchase record?')) {
      deletePurchase(id);
    }
  };

  const handleSave = (purchaseData: Omit<Purchase, 'id'>) => {
    if (editingPurchase) {
        updatePurchase({ ...purchaseData, id: editingPurchase.id });
    } else {
        addPurchase(purchaseData);
    }
    setIsModalOpen(false);
    setEditingPurchase(null);
  };

  const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>;
  const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;


  return (
    <div>
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Purchases</h1>
            <button onClick={handleAdd} className="px-4 py-2 bg-primary text-white rounded-lg shadow hover:bg-primary-dark transition whitespace-nowrap">
                Add Purchase
            </button>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <div className="lg:col-span-2">
                    <label htmlFor="search-input" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                    <input 
                        id="search-input"
                        type="text"
                        placeholder="Search description or supplier..."
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
                <div className="lg:col-start-3">
                    <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select 
                        id="status-filter"
                        value={statusFilter} 
                        onChange={e => setStatusFilter(e.target.value)}
                        className="p-2 border rounded-md w-full"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Paid">Paid</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>
            </div>
        </div>

        <DataTable<Purchase> 
            columns={columns} 
            data={filteredPurchases} 
            renderActions={(purchase) => (
                <div className="flex items-center space-x-2">
                    <button onClick={() => onPrint(purchase)} className="p-1 text-gray-500 hover:text-primary" title="Print"><PrintIcon /></button>
                    <button onClick={() => handleEdit(purchase)} className="p-1 text-gray-500 hover:text-blue-600" title="Edit"><EditIcon /></button>
                    <button onClick={() => handleDelete(purchase.id)} className="p-1 text-gray-500 hover:text-red-600" title="Delete"><DeleteIcon /></button>
                </div>
            )}
        />
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingPurchase ? 'Edit Purchase' : 'New Purchase'}>
            <PurchaseForm 
                suppliers={suppliers} 
                products={products}
                onSave={handleSave} 
                onClose={() => setIsModalOpen(false)} 
                initialData={editingPurchase}
             />
        </Modal>
    </div>
  );
};

export default Purchases;
