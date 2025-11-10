import React from 'react';
import { Rental } from '../types';

interface RentalProps {
  rentals: Rental[];
}

const RentalPage: React.FC<RentalProps> = ({ rentals }) => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Rental Expenses</h1>
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="w-full min-w-max text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th rowSpan={2} className="px-2 py-3 border">Date</th>
              <th rowSpan={2} className="px-2 py-3 border">Recipient</th>
              <th rowSpan={2} className="px-2 py-3 border">Object of Payment</th>
              <th rowSpan={2} className="px-2 py-3 border">Invoice #</th>
              <th className="px-2 py-3 border text-center">Amount Before Tax (KHR)</th>
              <th rowSpan={2} className="px-2 py-3 border">Tax Rate</th>
              <th className="px-2 py-3 border text-center">Withholding Tax (KHR)</th>
              <th className="px-2 py-3 border text-center">Amount as Expense (KHR)</th>
            </tr>
          </thead>
          <tbody>
            {rentals.map((rental) => {
              const taxRate = 0.10;
              const amountKhr = rental.amountUsd * rental.exchangeRate;
              const taxKhr = amountKhr * taxRate;
              const expenseKhr = amountKhr - taxKhr;

              return (
                <tr key={rental.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-2 py-2 border">{rental.date}</td>
                  <td className="px-2 py-2 border">{rental.recipient}</td>
                  <td className="px-2 py-2 border">{rental.object}</td>
                  <td className="px-2 py-2 border">{rental.invoice}</td>
                  <td className="px-2 py-2 border text-right">{amountKhr.toLocaleString()} ៛</td>
                  <td className="px-2 py-2 border text-center">{(taxRate * 100).toFixed(0)}%</td>
                  <td className="px-2 py-2 border text-right text-red-500">{taxKhr.toLocaleString()} ៛</td>
                  <td className="px-2 py-2 border text-right font-bold">{expenseKhr.toLocaleString()} ៛</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RentalPage;