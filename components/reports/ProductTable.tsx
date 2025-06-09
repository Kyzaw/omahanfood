import React from 'react';
import { formatCurrency } from '@/hooks/useReports';

interface Product {
  name: string;
  category: string;
  sold: number;
  revenue: number;
}

interface ProductTableProps {
  products: Product[];
}

export const ProductTable: React.FC<ProductTableProps> = ({ products }) => {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Produk Terlaris</h3>
        <p className="text-sm text-gray-600">Berdasarkan jumlah terjual</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produk</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Terjual</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pendapatan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.length > 0 ? (
              products.map((product, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{product.sold}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{formatCurrency(product.revenue)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  Tidak ada data produk
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};