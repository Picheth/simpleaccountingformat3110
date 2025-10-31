
import React, { useState, useMemo } from 'react';
import { Purchase, Sale, Supplier, PurchaseStatus } from '../types';
import DataTable from './DataTable';

interface ReportsProps {
  purchases: Purchase[];
  sales: Sale[];
  suppliers: Supplier[];
}

type ReportType = 'sales' | 'purchases';

const Reports: React.FC<ReportsProps> = ({ purchases, sales, suppliers }) => {
  const [reportType, setReportType] = useState<ReportType>('sales');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredData = useMemo(() => {
    const data = reportType === 'sales' ? sales : purchases;
    
    if (!startDate && !endDate) {
      return data;
    }

    return data.filter(item => {
      // Ensure date is valid before creating a Date object
      if (!item.date || isNaN(new Date(item.date).getTime())) return false;

      const itemDate = new Date(item.date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      
      // Reset time for accurate date-only comparison
      itemDate.setHours(0, 0, 0, 0);
      if(start) start.setHours(0, 0, 0, 0);
      if(end) end.setHours(0, 0, 0, 0);

      if (start && itemDate < start) return false;
      if (end && itemDate > end) return false;
      
      return true;
    });
  }, [reportType, sales, purchases, startDate, endDate]);

  const statusColors: Record<PurchaseStatus, string> = {
    Pending: 'bg-yellow-100 text-yellow-800',
    Approved: 'bg-blue-100 text-blue-800',
    Paid: 'bg-green-100 text-green-800',
    Cancelled: 'bg-red-100 text-red-800',
  };

  const purchaseColumns: {
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
    { header: 'Staff/User', accessor: 'staffUser' },
  ];

  const saleColumns: {
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

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Reports</h1>
      
      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
                <div className="flex rounded-md shadow-sm">
                    <button 
                        onClick={() => setReportType('sales')}
                        className={`px-4 py-2 rounded-l-md w-full transition-colors ${reportType === 'sales' ? 'bg-primary text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                    >
                        Sales
                    </button>
                    <button 
                        onClick={() => setReportType('purchases')}
                        className={`px-4 py-2 rounded-r-md w-full transition-colors ${reportType === 'purchases' ? 'bg-primary text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                    >
                        Purchases
                    </button>
                </div>
            </div>
            <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input 
                    type="date" 
                    id="startDate"
                    value={startDate} 
                    onChange={e => setStartDate(e.target.value)}
                    className="p-2 border rounded-md w-full"
                />
            </div>
            <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input 
                    type="date" 
                    id="endDate"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="p-2 border rounded-md w-full"
                />
            </div>
        </div>
      </div>
      
      <div>
        {reportType === 'sales' ? (
            <DataTable<Sale> columns={saleColumns} data={filteredData as Sale[]} />
        ) : (
            <DataTable<Purchase> columns={purchaseColumns} data={filteredData as Purchase[]} />
        )}
      </div>
    </div>
  );
};

export default Reports;