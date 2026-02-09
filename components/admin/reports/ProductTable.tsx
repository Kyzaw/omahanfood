import React from 'react';
import { Package } from 'lucide-react';
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
    <div className="w-full">
      {/* Desktop Table View */}
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-right text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Sold
                </th>
                <th className="px-4 py-3 text-right text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {products.length > 0 ? (
                products.map((product, index) => (
                  <tr key={index} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-4 text-sm font-semibold text-slate-900">
                      {product.name}
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm font-bold text-slate-900 text-right">
                      {product.sold}
                    </td>
                    <td className="px-4 py-4 text-sm font-bold text-green-600 text-right">
                      {formatCurrency(product.revenue)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                        <Package className="w-6 h-6 text-slate-400" />
                      </div>
                      <p className="font-medium">No products data</p>
                      <p className="text-sm">Product sales will appear here</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {products.length > 0 ? (
          products.map((product, index) => (
            <div
              key={index}
              className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-slate-900 mb-1 truncate">
                    {product.name}
                  </h4>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                    {product.category}
                  </span>
                </div>
                <div className="text-right ml-3 flex-shrink-0">
                  <div className="text-lg font-bold text-green-600 mb-1">
                    {formatCurrency(product.revenue)}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-xs text-slate-600 font-medium">Items Sold</span>
                </div>
                <div className="text-sm font-bold text-slate-900">
                  {product.sold}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white border border-slate-200 rounded-lg p-8 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              No products data
            </h3>
            <p className="text-slate-600 text-sm">
              Product sales information will appear here once data is available
            </p>
          </div>
        )}
      </div>

      {/* Mobile Summary Stats */}
      {products.length > 0 && (
        <div className="md:hidden mt-4 pt-4 border-t border-slate-200">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
              <div className="text-sm font-bold text-slate-900">
                {products.length}
              </div>
              <div className="text-xs text-slate-600">Products</div>
            </div>
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
              <div className="text-sm font-bold text-slate-900">
                {products.reduce((sum, p) => sum + p.sold, 0)}
              </div>
              <div className="text-xs text-slate-600">Total Sold</div>
            </div>
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
              <div className="text-sm font-bold text-green-600">
                {formatCurrency(products.reduce((sum, p) => sum + p.revenue, 0))}
              </div>
              <div className="text-xs text-slate-600">Total Revenue</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};