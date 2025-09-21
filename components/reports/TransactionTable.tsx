import React from 'react';
import { formatCurrency, formatDate, getStatusColor, getStatusText } from '@/hooks/useReports';

interface Transaction {
  id: string;
  invoice: string;
  date: string;
  customer: string;
  items: number;
  paymentMethod: string;
  total: number;
  status: string;
}

interface TransactionTableProps {
  transactions: Transaction[];
}

export const TransactionTable: React.FC<TransactionTableProps> = ({ transactions }) => {
  return (
    <div className="w-full">
      {/* Desktop Table View */}
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Invoice
                </th>
                <th className="px-3 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-3 py-3 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-3 py-3 text-right text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-3 py-3 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-3 py-4">
                      <div>
                        <div className="text-sm font-semibold text-slate-900">
                          {transaction.invoice}
                        </div>
                        <div className="text-xs text-slate-500">
                          {formatDate(transaction.date)}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <div>
                        <div className="text-sm font-medium text-slate-900 truncate max-w-32">
                          {transaction.customer}
                        </div>
                        <div className="text-xs text-slate-500">
                          {transaction.paymentMethod}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {transaction.items}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-right">
                      <div className="text-sm font-bold text-green-600">
                        {formatCurrency(transaction.total)}
                      </div>
                    </td>
                    <td className="px-3 py-4 text-center">
                      <span className={`inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full ${getStatusColor(transaction.status)}`}>
                        {getStatusText(transaction.status)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                        <span className="text-2xl">🧾</span>
                      </div>
                      <p className="font-medium">No transactions data</p>
                      <p className="text-sm">Recent transactions will appear here</p>
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
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-900 mb-1">
                    {transaction.invoice}
                  </div>
                  <div className="text-xs text-slate-500">
                    {formatDate(transaction.date)}
                  </div>
                </div>
                <div className="ml-3 flex-shrink-0">
                  <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(transaction.status)}`}>
                    {getStatusText(transaction.status)}
                  </span>
                </div>
              </div>

              {/* Customer & Payment */}
              <div className="mb-3">
                <div className="text-sm font-medium text-slate-900 mb-1 truncate">
                  {transaction.customer}
                </div>
                <div className="text-xs text-slate-600">
                  {transaction.paymentMethod}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-xs text-slate-600">{transaction.items} items</span>
                  </div>
                </div>
                <div className="text-base font-bold text-green-600">
                  {formatCurrency(transaction.total)}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white border border-slate-200 rounded-lg p-8 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🧾</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              No transactions data
            </h3>
            <p className="text-slate-600 text-sm">
              Recent transaction history will appear here once available
            </p>
          </div>
        )}
      </div>

      {/* Mobile Summary Stats */}
      {transactions.length > 0 && (
        <div className="md:hidden mt-4 pt-4 border-t border-slate-200">
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
              <div className="text-sm font-bold text-slate-900">
                {transactions.length}
              </div>
              <div className="text-xs text-slate-600">Transactions</div>
            </div>
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
              <div className="text-sm font-bold text-green-600">
                {formatCurrency(transactions.reduce((sum, t) => sum + t.total, 0))}
              </div>
              <div className="text-xs text-slate-600">Total Value</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};