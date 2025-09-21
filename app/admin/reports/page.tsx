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
  BarChart3,
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
      <div className="min-h-screen bg-slate-50">
        <AdminSidebar />
        <main className="md:ml-64 min-h-screen transition-all duration-300 ease-in-out">
          <div className="p-4 md:p-8 mt-16 md:mt-0">
            <div className="max-w-4xl mx-auto">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 md:p-8 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <RefreshCw className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-lg md:text-xl font-semibold text-red-800 mb-2">Error Memuat Data</h2>
                <p className="text-red-600 mb-6 text-sm md:text-base">{error}</p>
                <button
                  onClick={refetch}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Coba Lagi
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />
      
      {/* Main content with responsive spacing */}
      <main className="md:ml-64 min-h-screen transition-all duration-300 ease-in-out">
        {/* Header Section */}
        <div className="bg-white border-b border-slate-200 px-4 md:px-6 py-4 md:py-6 shadow-sm mt-16 md:mt-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Reports & Analytics
              </h1>
              <p className="text-sm text-slate-600 mt-1 md:mt-2">
                Comprehensive sales analytics and business insights
              </p>
            </div>
            <div className="flex items-center justify-end">
              <div className="text-right bg-slate-50 px-3 md:px-4 py-2 rounded-lg border border-slate-200">
                <p className="text-xs md:text-sm font-semibold text-slate-800">
                  {dateRange === 'week' ? '7 Days' : dateRange === 'month' ? '30 Days' : '1 Year'} Report
                </p>
                <p className="text-xs text-slate-500">
                  Analytics Dashboard
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="bg-white border-b border-slate-100 px-4 md:px-6 py-3 md:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Date Range Filter */}
            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => handleDateRangeChange('week')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  dateRange === 'week' 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                7 Days
              </button>
              <button
                onClick={() => handleDateRangeChange('month')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  dateRange === 'month' 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                30 Days
              </button>
              <button
                onClick={() => handleDateRangeChange('year')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  dateRange === 'year' 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                1 Year
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={refetch}
                disabled={loading}
                className="inline-flex items-center gap-2 px-3 md:px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50 text-sm"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <button
                onClick={handleExport}
                className="inline-flex items-center gap-2 px-3 md:px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-8 space-y-6 md:space-y-8">
          {loading ? (
            /* Loading State */
            <div className="space-y-6 md:space-y-8">
              {/* Stats Cards Loading */}
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white p-4 md:p-6 rounded-xl shadow-sm animate-pulse border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 bg-slate-200 rounded-lg"></div>
                      <div className="text-right space-y-2">
                        <div className="w-16 h-6 bg-slate-200 rounded"></div>
                        <div className="w-12 h-4 bg-slate-200 rounded"></div>
                      </div>
                    </div>
                    <div className="w-24 h-4 bg-slate-200 rounded"></div>
                  </div>
                ))}
              </div>

              {/* Charts Loading */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm animate-pulse border border-slate-200">
                  <div className="w-32 h-6 bg-slate-200 rounded mb-4"></div>
                  <div className="w-full h-64 bg-slate-200 rounded"></div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm animate-pulse border border-slate-200">
                  <div className="w-32 h-6 bg-slate-200 rounded mb-4"></div>
                  <div className="w-full h-64 bg-slate-200 rounded"></div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Overview Stats */}
              {reportData.overview && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 md:w-10 h-8 md:h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg md:rounded-xl flex items-center justify-center">
                      <BarChart3 className="w-4 md:w-5 h-4 md:h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg md:text-xl font-bold text-slate-800">
                        Performance Overview
                      </h2>
                      <p className="text-xs md:text-sm text-slate-600">
                        Key metrics for the selected period
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                    <StatsCard
                      title="Total Revenue"
                      value={new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        minimumFractionDigits: 0,
                      }).format(reportData.overview.totalSales)}
                      change={`${dateRange === 'week' ? '7 days' : dateRange === 'month' ? '30 days' : '1 year'} period`}
                      icon={DollarSign}
                      iconColor="text-green-600"
                      iconBgColor="bg-green-100"
                    />
                    <StatsCard
                      title="Transactions"
                      value={reportData.overview.totalTransactions.toString()}
                      change={`Total orders`}
                      icon={ShoppingCart}
                      iconColor="text-blue-600"
                      iconBgColor="bg-blue-100"
                    />
                    <StatsCard
                      title="Avg Order"
                      value={new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        minimumFractionDigits: 0,
                      }).format(reportData.overview.avgTransaction)}
                      change={`Per transaction`}
                      icon={TrendingUp}
                      iconColor="text-purple-600"
                      iconBgColor="bg-purple-100"
                    />
                    <StatsCard
                      title="Items Sold"
                      value={reportData.overview.totalProductsSold.toString()}
                      change={`Total items`}
                      icon={Package}
                      iconColor="text-orange-600"
                      iconBgColor="bg-orange-100"
                    />
                  </div>
                </div>
              )}

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {/* Sales Chart */}
                {reportData.overview?.dailySales && (
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
                    <div className="px-4 md:px-6 py-4 md:py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-8 md:w-10 h-8 md:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg md:rounded-xl flex items-center justify-center">
                          <TrendingUp className="w-4 md:w-5 h-4 md:h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-base md:text-lg font-bold text-slate-800">Sales Trend</h3>
                          <p className="text-xs md:text-sm text-slate-600">Daily sales performance</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 md:p-6">
                      <SalesChart
                        data={reportData.overview.dailySales.map((item) => ({
                          date: item.date,
                          value: item.value,
                        }))}
                      />
                    </div>
                  </div>
                )}

                {/* Category Performance */}
                {reportData.products?.categoryPerformance && (
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
                    <div className="px-4 md:px-6 py-4 md:py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-8 md:w-10 h-8 md:h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg md:rounded-xl flex items-center justify-center">
                          <Package className="w-4 md:w-5 h-4 md:h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-base md:text-lg font-bold text-slate-800">Category Performance</h3>
                          <p className="text-xs md:text-sm text-slate-600">Sales by category</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 md:p-6">
                      <CategoryChart data={reportData.products.categoryPerformance} />
                    </div>
                  </div>
                )}
              </div>

              {/* Tables Section */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
                {/* Top Products Table */}
                {reportData.products?.products && (
                  <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
                    <div className="px-4 md:px-6 py-4 md:py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-8 md:w-10 h-8 md:h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg md:rounded-xl flex items-center justify-center">
                          <Package className="w-4 md:w-5 h-4 md:h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-base md:text-lg font-bold text-slate-800">Top Products</h3>
                          <p className="text-xs md:text-sm text-slate-600">Best selling items</p>
                        </div>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <ProductTable products={reportData.products.products} />
                    </div>
                  </div>
                )}

                {/* Recent Transactions */}
                {reportData.transactions?.transactions && (
                  <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
                    <div className="px-4 md:px-6 py-4 md:py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-8 md:w-10 h-8 md:h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg md:rounded-xl flex items-center justify-center">
                          <ShoppingCart className="w-4 md:w-5 h-4 md:h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-base md:text-lg font-bold text-slate-800">Recent Transactions</h3>
                          <p className="text-xs md:text-sm text-slate-600">Latest orders</p>
                        </div>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <TransactionTable transactions={reportData.transactions.transactions} />
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Empty State */}
          {!loading && !reportData.overview && !error && (
            <div className="text-center py-16 md:py-20">
              <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
                <Calendar className="w-10 h-10 md:w-12 md:h-12 text-slate-400" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-slate-900 mb-2">No Data Available</h3>
              <p className="text-slate-600 mb-8 text-sm md:text-base max-w-md mx-auto">
                No transaction data found for the selected period. Try adjusting the date range.
              </p>
              <button
                onClick={refetch}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Data
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ReportsPage;