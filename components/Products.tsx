import React from 'react';
import { Product } from '../types';
import DataTable from './DataTable';

interface ProductsProps {
  products: Product[];
}

const Products: React.FC<ProductsProps> = ({ products }) => {
  // Fix: Explicitly define the type for the columns array.
  // This ensures that string accessors are correctly typed as `keyof Product`.
  const columns: {
    header: string;
    accessor: keyof Product | ((item: Product) => React.ReactNode);
    className?: string;
  }[] = [
    { header: 'Product ID', accessor: 'id' },
    { header: 'Product Name', accessor: 'name' },
  ];

  return (
    <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Products</h1>
        <DataTable<Product> columns={columns} data={products} />
    </div>
  );
};

export default Products;