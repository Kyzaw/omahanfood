// components/reports/CategoryChart.tsx
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface CategoryData {
  name: string;
  value: number;
  percentage: number;
}

interface CategoryChartProps {
  data: CategoryData[];
}

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

// Custom tooltip component
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900">{data.name}</p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">{data.value}</span> produk terjual
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">{data.payload.percentage}%</span> dari total
        </p>
      </div>
    );
  }
  return null;
};

export const CategoryChart: React.FC<CategoryChartProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Performa Kategori</h3>
        <p className="text-sm text-gray-600">Distribusi penjualan berdasarkan kategori produk</p>
      </div>
      <div className="p-6">
        {data.length > 0 ? (
          <>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={40}
                    dataKey="value"
                    stroke="#fff"
                    strokeWidth={2}
                  >
                    {data.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Custom Legend */}
            <div className="mt-6 space-y-3">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Kategori:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {data.map((category, index) => (
                  <div key={category.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full flex-shrink-0"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <span className="text-sm font-medium text-gray-900 truncate">
                        {category.name}
                      </span>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <div className="text-sm font-semibold text-gray-900">
                        {category.percentage}%
                      </div>
                      <div className="text-xs text-gray-500">
                        {category.value} item
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">Tidak Ada Data Kategori</h4>
            <p className="text-gray-500">
              Belum ada data penjualan berdasarkan kategori untuk periode yang dipilih
            </p>
          </div>
        )}
      </div>
    </div>
  );
};