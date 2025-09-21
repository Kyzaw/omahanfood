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

interface TooltipProps {
  active?: boolean;
  payload?: {
    name: string;
    value: number;
    payload: CategoryData;
  }[];
}

// Modern gradient color palette
const COLORS = [
  '#6366f1', // Indigo
  '#8b5cf6', // Purple  
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#84cc16', // Lime
  '#f97316'  // Orange
];

// Enhanced custom tooltip component
const CustomTooltip: React.FC<TooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white/95 backdrop-blur-sm p-4 border-none rounded-xl shadow-2xl">
        <p className="font-bold text-slate-900 text-sm mb-2">{data.name}</p>
        <div className="space-y-1">
          <p className="text-sm text-slate-700">
            <span className="font-semibold text-indigo-600">{data.value}</span> products sold
          </p>
          <p className="text-sm text-slate-700">
            <span className="font-semibold text-purple-600">{data.payload.percentage}%</span> of total sales
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export const CategoryChart: React.FC<CategoryChartProps> = ({ data }) => {
  return (
    <div className="w-full">
      {data.length > 0 ? (
        <div className="space-y-4 md:space-y-6">
          {/* Chart Container */}
          <div className="relative">
            {/* Mobile View */}
            <div className="block md:hidden">
              <div className="h-64 sm:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <defs>
                      {COLORS.map((color, index) => (
                        <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor={color} stopOpacity={1} />
                          <stop offset="100%" stopColor={color} stopOpacity={0.7} />
                        </linearGradient>
                      ))}
                    </defs>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={35}
                      dataKey="value"
                      stroke="rgba(255, 255, 255, 0.8)"
                      strokeWidth={2}
                    >
                      {data.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={`url(#gradient-${index % COLORS.length})`}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Desktop View */}
            <div className="hidden md:block">
              <div className="h-80 lg:h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <defs>
                      {COLORS.map((color, index) => (
                        <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor={color} stopOpacity={1} />
                          <stop offset="100%" stopColor={color} stopOpacity={0.7} />
                        </linearGradient>
                      ))}
                      <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#6366f1" floodOpacity="0.2"/>
                      </filter>
                    </defs>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      innerRadius={50}
                      dataKey="value"
                      stroke="rgba(255, 255, 255, 0.9)"
                      strokeWidth={3}
                      filter="url(#shadow)"
                    >
                      {data.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={`url(#gradient-${index % COLORS.length})`}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          {/* Enhanced Legend */}
          <div className="space-y-3 md:space-y-4">
            <h4 className="text-sm md:text-base font-semibold text-slate-900 flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
              Category Breakdown
            </h4>
            
            {/* Mobile Legend - Simplified */}
            <div className="grid grid-cols-1 gap-2 md:hidden">
              {data.map((category, index) => (
                <div key={category.name} className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm font-medium text-slate-900 truncate">
                      {category.name}
                    </span>
                  </div>
                  <div className="text-right flex-shrink-0 ml-3">
                    <div className="text-sm font-bold text-slate-900">
                      {category.percentage}%
                    </div>
                    <div className="text-xs text-slate-500">
                      {category.value} items
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Legend - Enhanced */}
            <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 gap-3">
              {data.map((category, index) => (
                <div key={category.name} className="group flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-white hover:from-slate-100 hover:to-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 transition-all duration-200 hover:shadow-md">
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className="relative">
                      <div
                        className="w-4 h-4 rounded-full flex-shrink-0 group-hover:scale-110 transition-transform"
                        style={{ 
                          background: `linear-gradient(135deg, ${COLORS[index % COLORS.length]}, ${COLORS[index % COLORS.length]}80)`
                        }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-slate-900 truncate group-hover:text-indigo-700 transition-colors">
                      {category.name}
                    </span>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <div className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {category.percentage}%
                    </div>
                    <div className="text-xs text-slate-500 group-hover:text-slate-600">
                      {category.value} items sold
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Stats */}
            <div className="mt-6 pt-4 border-t border-slate-200">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                <div className="text-center p-3 md:p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <div className="text-lg md:text-xl font-bold text-blue-700">
                    {data.length}
                  </div>
                  <div className="text-xs md:text-sm text-blue-600 font-medium">
                    Categories
                  </div>
                </div>
                
                <div className="text-center p-3 md:p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <div className="text-lg md:text-xl font-bold text-green-700">
                    {data.reduce((sum, item) => sum + item.value, 0)}
                  </div>
                  <div className="text-xs md:text-sm text-green-600 font-medium">
                    Total Items
                  </div>
                </div>

                <div className="text-center p-3 md:p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg border border-purple-200 col-span-2 sm:col-span-1">
                  <div className="text-lg md:text-xl font-bold text-purple-700">
                    {Math.max(...data.map(d => d.percentage))}%
                  </div>
                  <div className="text-xs md:text-sm text-purple-600 font-medium">
                    Top Category
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Enhanced Empty State */
        <div className="text-center py-12 md:py-16">
          <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 md:w-12 md:h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
          </div>
          <h4 className="text-lg md:text-xl font-semibold text-slate-900 mb-3">No Category Data</h4>
          <p className="text-slate-600 text-sm md:text-base max-w-md mx-auto leading-relaxed">
            No sales data available by category for the selected period. Data will appear here once transactions are recorded.
          </p>
        </div>
      )}
    </div>
  );
};