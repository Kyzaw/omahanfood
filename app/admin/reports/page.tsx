'use client';

import React, { useState } from 'react';
import { useReports } from '@/hooks/useReports';
import { StatsCard } from '@/components/reports/StatsCard';
import { SalesChart } from '@/components/reports/SalesChart';
import { ProductTable } from '@/components/reports/ProductTable';
import { CategoryChart } from '@/components/reports/CategoryChart';
import { TransactionTable } from '@/components/reports/TransactionTable';
import { 
  TrendingUp, 
  ShoppingCart, 
  DollarSign, 
  Package,
  Calendar,
  RefreshCw,
  Download,
} from 'lucide-react';
import AdminSidebar from '@/components/AdminNavbar';

const ReportsPage = () => {
  const [dateRange, setDateRange] = useState('week');
  const { reportData, loading, error, refetch } = useReports(dateRange);

  const handleDateRangeChange = (range: string) => {
    setDateRange(range);
  };

  const handleExport = () => {
    // Implementasi export data (misal CSV atau Excel)
    console.log('Exporting report data...');
  };


  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Error Memuat Data</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={refetch}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar/>
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manajemen Laporan</h1>
              <p className="text-gray-600 mt-1">Dashboard analitik dan laporan penjualan</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Date Range Filter */}
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => handleDateRangeChange('week')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    dateRange === 'week' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  7 Hari
                </button>
                <button
                  onClick={() => handleDateRangeChange('month')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    dateRange === 'month' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  30 Hari
                </button>
                <button
                  onClick={() => handleDateRangeChange('year')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    dateRange === 'year' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  1 Tahun
                </button>
              </div>

              {/* Action Buttons */}
              <button
                onClick={refetch}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={handleExport}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl ml-96 mx-auto p-6 space-y-6">
        {loading ? (
          /* Loading State */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                  <div className="text-right space-y-2">
                    <div className="w-16 h-6 bg-gray-200 rounded"></div>
                    <div className="w-12 h-4 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="w-24 h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Overview Stats */}
            {reportData.overview && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                  title="Total Pendapatan"
                  value={new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                  }).format(reportData.overview.totalSales)}
                  change={`${dateRange === 'week' ? '7 hari terakhir' : dateRange === 'month' ? '30 hari terakhir' : '1 tahun terakhir'}`}
                  icon={DollarSign}
                  iconColor="text-green-600"
                  iconBgColor="bg-green-100"
                />
                <StatsCard
                  title="Total Transaksi"
                  value={reportData.overview.totalTransactions.toString()}
                  change={`${dateRange === 'week' ? '7 hari terakhir' : dateRange === 'month' ? '30 hari terakhir' : '1 tahun terakhir'}`}
                  icon={ShoppingCart}
                  iconColor="text-blue-600"
                  iconBgColor="bg-blue-100"
                />
                <StatsCard
                  title="Rata-rata Transaksi"
                  value={new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                  }).format(reportData.overview.avgTransaction)}
                  change={`Per transaksi`}
                  icon={TrendingUp}
                  iconColor="text-purple-600"
                  iconBgColor="bg-purple-100"
                />
                <StatsCard
                  title="Produk Terjual"
                  value={reportData.overview.totalProductsSold.toString()}
                  change={`Total item`}
                  icon={Package}
                  iconColor="text-orange-600"
                  iconBgColor="bg-orange-100"
                />
              </div>
            )}

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sales Chart - Penjualan Harian */}
              {reportData.overview?.dailySales && (
                <SalesChart
                  data={reportData.overview.dailySales.map((item) => ({
                    date: item.date,
                    value: item.value,
                  }))}
                />
              )}

              {/* Category Performance */}
              {reportData.products?.categoryPerformance && (
                <CategoryChart data={reportData.products.categoryPerformance} />
              )}
            </div>

            {/* Tables Section */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Top Products Table */}
              {reportData.products?.products && (
                <ProductTable products={reportData.products.products} />
              )}

              {/* Recent Transactions */}
              <div className="xl:col-span-1">
                {reportData.transactions?.transactions && (
                  <TransactionTable transactions={reportData.transactions.transactions} />
                )}
              </div>
            </div>

            {/* Full Width Transactions Table for smaller screens */}
            <div className="xl:hidden">
              {reportData.transactions?.transactions && (
                <TransactionTable transactions={reportData.transactions.transactions} />
              )}
            </div>
          </>
        )}

        {/* Empty State */}
        {!loading && !reportData.overview && !error && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Calendar className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak Ada Data</h3>
            <p className="text-gray-600 mb-6">
              Belum ada data transaksi untuk periode yang dipilih
            </p>
            <button
              onClick={refetch}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Muat Ulang Data
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
