
import React from 'react';

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  renderActions?: (item: T) => React.ReactNode;
}

const DataTable = <T extends { id: string },>({ columns, data, renderActions }: DataTableProps<T>): React.ReactElement => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-x-auto">
      <table className="w-full min-w-max text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            {columns.map((col, index) => (
              <th key={index} scope="col" className={`px-6 py-3 ${col.className || ''}`}>
                {col.header}
              </th>
            ))}
            {renderActions && <th scope="col" className="px-6 py-3">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
              {columns.map((col, index) => (
                <td key={index} className={`px-6 py-4 ${col.className || ''}`}>
                  {typeof col.accessor === 'function'
                    ? col.accessor(item)
                    : (item[col.accessor] as React.ReactNode)}
                </td>
              ))}
              {renderActions && (
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    {renderActions(item)}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
