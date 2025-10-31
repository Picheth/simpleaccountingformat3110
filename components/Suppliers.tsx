
import React from 'react';
import { Supplier } from '../types';
import DataTable from './DataTable';

interface SuppliersProps {
  suppliers: Supplier[];
}

const Suppliers: React.FC<SuppliersProps> = ({ suppliers }) => {
  const columns: {
    header: string;
    accessor: keyof Supplier | ((item: Supplier) => React.ReactNode);
    className?: string;
  }[] = [
    { header: 'Supplier ID', accessor: 'id' },
    { header: 'Supplier Name', accessor: 'name' },
  ];

  return (
    <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Suppliers</h1>
        <DataTable<Supplier> columns={columns} data={suppliers} />
    </div>
  );
};

export default Suppliers;