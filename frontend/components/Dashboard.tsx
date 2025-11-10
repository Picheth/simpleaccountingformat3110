import React from 'react';
import { Purchase, Sale } from '../types';
import StatCard from './StatCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  purchases: Purchase[];
  sales: Sale[];
}

const Dashboard: React.FC<DashboardProps> = ({ purchases, sales }) => {
  const totalSales = sales.reduce((sum, sale) => sum + sale.goods + sale.services + sale.others, 0);
  const totalPurchases = purchases.reduce((sum, p) => sum + p.assets + p.goodsForSale + p.services + p.staffCost + p.utilities + p.rental + p.others + p.salesTax, 0);
  // Fix: Correctly access `sale.others` instead of undefined `others` variable.
  const totalProfit = sales.reduce((sum, sale) => sum + (sale.goods + sale.services + sale.others - sale.cgs), 0);
  const totalCustomers = new Set(sales.map(s => s.customer)).size;

  const salesByMonth = sales.reduce((acc, sale) => {
    const month = new Date(sale.date).toLocaleString('default', { month: 'short' });
    acc[month] = (acc[month] || 0) + sale.goods + sale.services + sale.others;
    return acc;
  }, {} as Record<string, number>);

  const purchasesByMonth = purchases.reduce((acc, purchase) => {
    const month = new Date(purchase.date).toLocaleString('default', { month: 'short' });
    const total = purchase.assets + purchase.goodsForSale + purchase.services + purchase.staffCost + purchase.utilities + purchase.rental + purchase.others + purchase.salesTax;
    acc[month] = (acc[month] || 0) + total;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Array.from(new Set([...Object.keys(salesByMonth), ...Object.keys(purchasesByMonth)]))
    .map(month => ({
      name: month,
      Sales: salesByMonth[month] || 0,
      Purchases: purchasesByMonth[month] || 0,
    }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Sales" value={`${totalSales.toLocaleString()} ៛`} icon={<div className="text-white">💰</div>} color="bg-green-500" />
        <StatCard title="Total Purchases" value={`${totalPurchases.toLocaleString()} ៛`} icon={<div className="text-white">🛒</div>} color="bg-red-500" />
        <StatCard title="Total Profit" value={`${totalProfit.toLocaleString()} ៛`} icon={<div className="text-white">📈</div>} color="bg-blue-500" />
        <StatCard title="Total Customers" value={totalCustomers.toString()} icon={<div className="text-white">👥</div>} color="bg-yellow-500" />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Sales vs Purchases Overview</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Sales" fill="#34D399" />
            <Bar dataKey="Purchases" fill="#F87171" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;