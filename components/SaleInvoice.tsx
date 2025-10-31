import React from 'react';
import { Sale } from '../types';

interface SaleInvoiceProps {
  sale: Sale | null;
  onClose: () => void;
}

const SaleInvoice: React.FC<SaleInvoiceProps> = ({ sale, onClose }) => {
  if (!sale) return null;

  const subtotal = sale.goods + sale.services + sale.others;
  const total = subtotal + sale.salesTax;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-8 relative">
        <div className="printable-content">
          <h1 className="text-3xl font-bold text-center mb-2">Sale Invoice</h1>
          <p className="text-center text-gray-500 mb-8">Invoice #{sale.invoice}</p>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div>
              <h2 className="font-bold text-gray-700">Bill To:</h2>
              <p>{sale.customer}</p>
              <p>VAT TIN: {sale.vatTin || 'N/A'}</p>
            </div>
            <div className="text-right">
              <h2 className="font-bold text-gray-700">Date:</h2>
              <p>{new Date(sale.date).toLocaleDateString()}</p>
            </div>
          </div>

          <table className="w-full mb-8">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Description</th>
                <th className="p-2 text-right">Quantity</th>
                <th className="p-2 text-right">Unit Price</th>
                <th className="p-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2">{sale.description}</td>
                <td className="p-2 text-right">{sale.quantity}</td>
                <td className="p-2 text-right">{sale.cost.toLocaleString()} ៛</td>
                <td className="p-2 text-right">{sale.goods.toLocaleString()} ៛</td>
              </tr>
            </tbody>
          </table>
          
          <div className="flex justify-end">
            <div className="w-64">
              <div className="flex justify-between py-1 text-gray-700">
                <span>Subtotal</span>
                <span>{subtotal.toLocaleString()} ៛</span>
              </div>
              <div className="flex justify-between py-1 text-gray-700">
                <span>Sales Tax</span>
                <span>{sale.salesTax.toLocaleString()} ៛</span>
              </div>
              <div className="flex justify-between py-1 text-xl font-bold border-t mt-2">
                <span>Total</span>
                <span>{total.toLocaleString()} ៛</span>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center text-sm text-gray-500">
            <p>Thank you for your business!</p>
            <p>Sold by: {sale.seller}</p>
          </div>
        </div>
        
        <div className="mt-8 text-center space-x-4 no-print">
            <button onClick={() => window.print()} className="px-4 py-2 bg-primary text-white rounded">Print</button>
            <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Close</button>
        </div>
        <style>{`
          @media print {
            body * {
              visibility: hidden;
            }
            .printable-content, .printable-content * {
              visibility: visible;
            }
            .printable-content {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
            .no-print {
              display: none;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default SaleInvoice;