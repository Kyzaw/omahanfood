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
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Riwayat Transaksi</h3>
        <p className="text-sm text-gray-600">Daftar transaksi terbaru</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No. Invoice</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pelanggan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Metode Pembayaran</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{transaction.invoice}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{formatDate(transaction.date)}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{transaction.customer}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{transaction.items}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{transaction.paymentMethod}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{formatCurrency(transaction.total)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(transaction.status)}`}>
                      {getStatusText(transaction.status)}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  Tidak ada data transaksi
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};