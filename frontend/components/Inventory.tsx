import React, { useMemo } from 'react';
import { Product, Purchase, Sale } from '../types';

interface InventoryProps {
  products: Product[];
  purchases: Purchase[];
  sales: Sale[];
}

interface InventoryRow {
  id: string;
  productId: string;
  productName: string;
  purchaseQty: number;
  purchaseValue: number;
  saleQty: number;
  saleValue: number;
  closingQty: number;
  closingValue: number;
}

const Inventory: React.FC<InventoryProps> = ({ products, purchases, sales }) => {
  const inventoryData: InventoryRow[] = useMemo(() => {
    return products.map(product => {
      const relevantPurchases = purchases.filter(p => p.description.includes(product.name));
      const relevantSales = sales.filter(s => s.productId === product.id);

      const purchaseQty = relevantPurchases.reduce((sum, p) => sum + p.quantity, 0);
      const purchaseValue = relevantPurchases.reduce((sum, p) => sum + p.goodsForSale, 0);
      const avgPurchasePrice = purchaseQty > 0 ? purchaseValue / purchaseQty : 0;

      const saleQty = relevantSales.reduce((sum, s) => sum + s.quantity, 0);
      const saleValue = relevantSales.reduce((sum, s) => sum + s.goods, 0);

      const closingQty = purchaseQty - saleQty;
      const closingValue = closingQty * avgPurchasePrice;

      return {
        id: product.id,
        productId: product.id,
        productName: product.name,
        purchaseQty,
        purchaseValue,
        saleQty,
        saleValue,
        closingQty,
        closingValue
      };
    });
  }, [products, purchases, sales]);

  return (
    <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Inventory Report</h1>
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
            <table className="w-full min-w-max text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th rowSpan={2} className="px-2 py-3 border">លរ (No.)</th>
                        <th rowSpan={2} className="px-2 py-3 border">Product ID</th>
                        <th rowSpan={2} className="px-2 py-3 border">ឈ្មោះផលិតផល (Product Name)</th>
                        <th colSpan={3} className="px-2 py-3 border text-center">ទំនិញទិញចូល (Purchases)</th>
                        <th colSpan={3} className="px-2 py-3 border text-center">ទំនិញលក់ចេញ (Sales)</th>
                        <th colSpan={3} className="px-2 py-3 border text-center">ស្តុកចុងគ្រា (Closing Stock)</th>
                    </tr>
                    <tr>
                        <th className="px-2 py-2 border">បរិមាណ (Qty)</th>
                        <th className="px-2 py-2 border">ឯកតា (Unit)</th>
                        <th className="px-2 py-2 border">តម្លៃសរុប (Value)</th>
                        <th className="px-2 py-2 border">បរិមាណ (Qty)</th>
                        <th className="px-2 py-2 border">ឯកតា (Unit)</th>
                        <th className="px-2 py-2 border">តម្លៃសរុប (Value)</th>
                        <th className="px-2 py-2 border">បរិមាណ (Qty)</th>
                        <th className="px-2 py-2 border">ឯកតា (Unit)</th>
                        <th className="px-2 py-2 border">តម្លៃសរុប (Value)</th>
                    </tr>
                </thead>
                <tbody>
                    {inventoryData.map((item, index) => (
                        <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                            <td className="px-2 py-2 border">{index + 1}</td>
                            <td className="px-2 py-2 border">{item.productId}</td>
                            <td className="px-2 py-2 border font-medium">{item.productName}</td>
                            <td className="px-2 py-2 border text-right">{item.purchaseQty}</td>
                            <td className="px-2 py-2 border">pcs</td>
                            <td className="px-2 py-2 border text-right">{item.purchaseValue.toLocaleString()} ៛</td>
                            <td className="px-2 py-2 border text-right">{item.saleQty}</td>
                            <td className="px-2 py-2 border">pcs</td>
                            <td className="px-2 py-2 border text-right">{item.saleValue.toLocaleString()} ៛</td>
                            <td className="px-2 py-2 border text-right font-bold">{item.closingQty}</td>
                            <td className="px-2 py-2 border">pcs</td>
                            <td className="px-2 py-2 border text-right font-bold">{item.closingValue.toLocaleString()} ៛</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default Inventory;