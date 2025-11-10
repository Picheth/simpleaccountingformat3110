import React, { useState } from 'react';
import { Product } from '../types';
import DataTable from './DataTable';

interface ProductsProps {
  products: Product[];
}

const Products: React.FC<ProductsProps> = ({ products }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [stockFilter, setStockFilter] = useState('All');

  // Filter products based on search and filters
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;
    
    const matchesStock = 
      stockFilter === 'All' ||
      (stockFilter === 'In Stock' && (product.currentStock || 0) > 0) ||
      (stockFilter === 'Out of Stock' && (product.currentStock || 0) === 0) ||
      (stockFilter === 'Low Stock' && (product.currentStock || 0) > 0 && (product.currentStock || 0) <= 10);
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

  // Fix: Explicitly define the type for the columns array.
  // This ensures that string accessors are correctly typed as `keyof Product`.
  const columns: {
    header: string;
    accessor: keyof Product | ((item: Product) => React.ReactNode);
    className?: string;
  }[] = [
    { header: 'Product ID', accessor: 'id' },
    { header: 'Product Name', accessor: 'name' },
    { 
      header: 'Category', 
      accessor: (item: Product) => item.category || 'N/A' 
    },
    { 
      header: 'Purchase Price', 
      accessor: (item: Product) => item.purchasePrice ? `$${item.purchasePrice.toFixed(2)}` : 'N/A',
      className: 'text-right'
    },
    { 
      header: 'Selling Price', 
      accessor: (item: Product) => item.sellingPrice ? `$${item.sellingPrice.toFixed(2)}` : 'N/A',
      className: 'text-right'
    },
    { 
      header: 'Margin', 
      accessor: (item: Product) => {
        if (item.purchasePrice && item.sellingPrice) {
          const margin = ((item.sellingPrice - item.purchasePrice) / item.purchasePrice * 100).toFixed(1);
          return <span className={parseFloat(margin) >= 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>{margin}%</span>;
        }
        return 'N/A';
      },
      className: 'text-right'
    },
    { 
      header: 'Stock', 
      accessor: (item: Product) => {
        const stock = item.currentStock !== undefined ? item.currentStock : 0;
        let colorClass = 'text-gray-700';
        if (stock === 0) colorClass = 'text-red-600 font-semibold';
        else if (stock <= 10) colorClass = 'text-yellow-600 font-semibold';
        else colorClass = 'text-green-600 font-semibold';
        return <span className={colorClass}>{stock}</span>;
      },
      className: 'text-center'
    },
    { 
      header: 'Unit', 
      accessor: (item: Product) => item.unit || 'pcs' 
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Products</h1>
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow-md transition-colors duration-200 flex items-center gap-2"
          onClick={() => alert('Add New Product functionality coming soon!')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add New Product
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Stock Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock Status</label>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock (≤10)</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mt-3 text-sm text-gray-600">
          Showing {filteredProducts.length} of {products.length} products
          {searchTerm && ` (filtered by "${searchTerm}")`}
        </div>
      </div>

      <DataTable<Product> columns={columns} data={filteredProducts} />
    </div>
  );
};

export default Products;