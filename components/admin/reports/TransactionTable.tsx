import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, ChevronLeft, ChevronRight, MoreHorizontal, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Reset to first page when transactions change (e.g. date range change)
  React.useEffect(() => {
    setCurrentPage(1);
  }, [transactions]);

  // Pagination calculations
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = transactions.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...');
      } else if (currentPage >= totalPages - 2) {
        pages.push('...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push('...', currentPage - 1, currentPage, currentPage + 1, '...');
      }
    }
    return pages;
  };

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
                <th className="px-3 py-3 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {currentItems.length > 0 ? (
                currentItems.map((transaction) => (
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
                    <td className="px-3 py-4 text-center">
                      <Link href={`/admin/reports/invoice/${transaction.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1 text-xs hover:bg-indigo-50 hover:text-indigo-600"
                        >
                          <Eye className="h-3 w-3" />
                          <span className="hidden lg:inline">View</span>
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                        <Receipt className="w-6 h-6 text-slate-400" />
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
        {currentItems.length > 0 ? (
          currentItems.map((transaction) => (
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

              {/* View Details Button */}
              <div className="mt-3 pt-3 border-t border-slate-100">
                <Link href={`/admin/reports/invoice/${transaction.id}`} className="w-full">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-2 text-xs"
                  >
                    <Eye className="h-3 w-3" />
                    View Invoice Details
                  </Button>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white border border-slate-200 rounded-lg p-8 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Receipt className="w-8 h-8 text-slate-400" />
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

      {/* Pagination Controls */}
      {transactions.length > itemsPerPage && (
        <div className="flex items-center justify-between px-2 py-4 border-t border-slate-100 mt-2">
          <div className="hidden sm:flex flex-1 items-center justify-between">
            <div>
              <p className="text-xs text-slate-700">
                Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(indexOfLastItem, transactions.length)}
                </span>{' '}
                of <span className="font-medium">{transactions.length}</span> results
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                  onClick={() => paginate(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-200 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </button>
                {getPageNumbers().map((number, index) => (
                  number === '...' ? (
                    <span
                      key={`dots-${index}`}
                      className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-inset ring-slate-200 focus:outline-offset-0"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </span>
                  ) : (
                    <button
                      key={number}
                      onClick={() => paginate(Number(number))}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${currentPage === number
                        ? 'z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                        : 'text-slate-900 ring-1 ring-inset ring-slate-200 hover:bg-slate-50 focus:z-20 focus:outline-offset-0'
                        }`}
                    >
                      {number}
                    </button>
                  )
                ))}
                <button
                  onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-200 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>

          {/* Mobile Pagination */}
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => paginate(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Previous
            </button>
            <div className="flex items-center">
              <span className="text-xs text-slate-700">
                Page {currentPage} of {totalPages}
              </span>
            </div>
            <button
              onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

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