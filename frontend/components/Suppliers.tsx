
import React, { useState, useMemo } from 'react';
import { Supplier, Purchase } from '../types';
import Modal from './Modal';

interface SuppliersProps {
  suppliers: Supplier[];
  purchases: Purchase[];
  addSupplier: (supplier: Omit<Supplier, 'id'>) => void;
  updateSupplier: (supplier: Supplier) => void;
  deleteSupplier: (id: string) => void;
}

const SupplierForm: React.FC<{
    onSave: (data: Omit<Supplier, 'id'>) => void;
    onClose: () => void;
    initialData?: Supplier | null;
}> = ({ onSave, onClose, initialData }) => {
    const [formData, setFormData] = useState<Omit<Supplier, 'id'>>(() => {
        if (initialData) {
            const { id, ...rest } = initialData;
            return rest;
        }
        return {
            name: ''
        };
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Supplier Name</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter supplier name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            <div className="flex justify-end gap-2 mt-6">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    {initialData ? 'Update' : 'Add'} Supplier
                </button>
            </div>
        </form>
    );
};

const SupplierView: React.FC<{
    supplier: Supplier & { totalPaid: number; purchaseCount: number };
    purchases: Purchase[];
    onClose: () => void;
}> = ({ supplier, purchases, onClose }) => {
    const supplierPurchases = purchases.filter(p => p.supplierId === supplier.id);

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                    <label className="block text-sm font-medium text-gray-600">Supplier ID</label>
                    <p className="text-lg font-semibold text-gray-800">{supplier.id}</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600">Supplier Name</label>
                    <p className="text-lg font-semibold text-gray-800">{supplier.name}</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600">Total Purchases</label>
                    <p className="text-lg font-semibold text-blue-600">{supplier.purchaseCount}</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600">Total Amount Paid</label>
                    <p className="text-lg font-semibold text-green-600">{supplier.totalPaid.toLocaleString()} KHR</p>
                </div>
            </div>

            <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Recent Purchases</h3>
                <div className="max-h-64 overflow-y-auto">
                    {supplierPurchases.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No purchases from this supplier</p>
                    ) : (
                        <table className="w-full text-sm">
                            <thead className="bg-gray-100 sticky top-0">
                                <tr>
                                    <th className="px-2 py-2 text-left">Date</th>
                                    <th className="px-2 py-2 text-left">Invoice</th>
                                    <th className="px-2 py-2 text-left">Description</th>
                                    <th className="px-2 py-2 text-right">Amount (KHR)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {supplierPurchases.slice(0, 10).map(p => {
                                    const total = p.assets + p.goodsForSale + p.services + p.staffCost + 
                                                p.utilities + p.rental + p.others + p.salesTax;
                                    return (
                                        <tr key={p.id} className="border-b hover:bg-gray-50">
                                            <td className="px-2 py-2">{p.date}</td>
                                            <td className="px-2 py-2">{p.invoice}</td>
                                            <td className="px-2 py-2">{p.description}</td>
                                            <td className="px-2 py-2 text-right">{total.toLocaleString()}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            <div className="flex justify-end mt-6">
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

const Suppliers: React.FC<SuppliersProps> = ({ suppliers, purchases, addSupplier, updateSupplier, deleteSupplier }) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<number | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [viewingSupplier, setViewingSupplier] = useState<(Supplier & { totalPaid: number; purchaseCount: number }) | null>(null);

  // Generate year options (last 5 years)
  const yearOptions = useMemo(() => {
    const years = [];
    for (let i = 0; i < 5; i++) {
      years.push(currentYear - i);
    }
    return years;
  }, [currentYear]);

  // Calculate total paid to each supplier
  const supplierTotals = useMemo(() => {
    return suppliers.map(supplier => {
      const supplierPurchases = purchases.filter(p => {
        if (p.supplierId !== supplier.id) return false;
        
        const purchaseDate = new Date(p.date);
        const purchaseYear = purchaseDate.getFullYear();
        const purchaseMonth = purchaseDate.getMonth() + 1;
        
        if (purchaseYear !== selectedYear) return false;
        if (selectedMonth !== 'all' && purchaseMonth !== selectedMonth) return false;
        
        return true;
      });

      const totalPaid = supplierPurchases.reduce((sum, p) => {
        return sum + p.assets + p.goodsForSale + p.services + p.staffCost + 
               p.utilities + p.rental + p.others + p.salesTax;
      }, 0);

      return {
        ...supplier,
        totalPaid,
        purchaseCount: supplierPurchases.length
      };
    });
  }, [suppliers, purchases, selectedYear, selectedMonth]);

  const handleAddSupplier = (supplierData: Omit<Supplier, 'id'>) => {
    addSupplier(supplierData);
  };

  const handleEditSupplier = (supplierData: Omit<Supplier, 'id'>) => {
    if (editingSupplier) {
      updateSupplier({ ...supplierData, id: editingSupplier.id });
    }
  };

  const handleEdit = (supplier: Supplier & { totalPaid: number; purchaseCount: number }) => {
    setEditingSupplier({ id: supplier.id, name: supplier.name });
    setIsModalOpen(true);
  };

  const handleView = (supplier: Supplier & { totalPaid: number; purchaseCount: number }) => {
    setViewingSupplier(supplier);
    setIsViewModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSupplier(null);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setViewingSupplier(null);
  };

  return (
    <div>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Suppliers</h1>
          
          <div className="flex gap-3">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Year:</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {yearOptions.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Month:</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Months</option>
                <option value={1}>January</option>
                <option value={2}>February</option>
                <option value={3}>March</option>
                <option value={4}>April</option>
                <option value={5}>May</option>
                <option value={6}>June</option>
                <option value={7}>July</option>
                <option value={8}>August</option>
                <option value={9}>September</option>
                <option value={10}>October</option>
                <option value={11}>November</option>
                <option value={12}>December</option>
              </select>
            </div>

            <button
              onClick={() => { setEditingSupplier(null); setIsModalOpen(true); }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Supplier
            </button>
          </div>
        </div>

        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">
              Period: {selectedMonth === 'all' ? `All of ${selectedYear}` : `${new Date(selectedYear, selectedMonth - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`}
            </span>
            <span className="text-lg font-bold text-blue-600">
              Total Paid: {supplierTotals.reduce((sum, s) => sum + s.totalPaid, 0).toLocaleString()} KHR
            </span>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-4 py-3 border">No.</th>
                <th className="px-4 py-3 border">Supplier ID</th>
                <th className="px-4 py-3 border">Supplier Name</th>
                <th className="px-4 py-3 border text-center">Purchases</th>
                <th className="px-4 py-3 border text-right">Total Paid (KHR)</th>
                <th className="px-4 py-3 border text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {supplierTotals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    No suppliers yet. Click "Add New Supplier" to get started.
                  </td>
                </tr>
              ) : (
                supplierTotals.map((supplier, index) => (
                  <tr key={supplier.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-4 py-3 border">{index + 1}</td>
                    <td className="px-4 py-3 border">{supplier.id}</td>
                    <td className="px-4 py-3 border font-medium">{supplier.name}</td>
                    <td className="px-4 py-3 border text-center text-gray-700">{supplier.purchaseCount}</td>
                    <td className="px-4 py-3 border text-right font-semibold text-blue-600">
                      {supplier.totalPaid.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 border text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleView(supplier)}
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs"
                          title="View details"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEdit(supplier)}
                          className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs"
                          title="Edit supplier"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteSupplier(supplier.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                          title="Delete supplier"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}>
          <SupplierForm
            onSave={editingSupplier ? handleEditSupplier : handleAddSupplier}
            onClose={handleCloseModal}
            initialData={editingSupplier}
          />
        </Modal>

        <Modal isOpen={isViewModalOpen} onClose={handleCloseViewModal} title="Supplier Details">
          {viewingSupplier && (
            <SupplierView
              supplier={viewingSupplier}
              purchases={purchases}
              onClose={handleCloseViewModal}
            />
          )}
        </Modal>
    </div>
  );
};

export default Suppliers;