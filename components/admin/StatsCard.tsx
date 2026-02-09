import { ReactNode } from 'react';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  icon?: ReactNode;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
}

export function StatsCard({ 
  title, 
  value, 
  icon, 
  trend, 
  trendDirection = 'neutral' 
}: StatsCardProps) {
  const getTrendColor = () => {
    switch (trendDirection) {
      case 'up':
        return 'text-green-600 bg-green-50';
      case 'down':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getTrendIcon = () => {
    switch (trendDirection) {
      case 'up':
        return <TrendingUp className="w-3 h-3" />;
      case 'down':
        return <TrendingDown className="w-3 h-3" />;
      default:
        return <ArrowRight className="w-3 h-3" />;
    }
  };

  return (
    <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-slate-200 p-3 md:p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 group">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {/* Mobile: Stack icon and title vertically, Desktop: horizontal */}
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 mb-2 md:mb-3">
            {icon && (
              <div className="group-hover:scale-110 transition-transform duration-300 flex-shrink-0">{icon}</div>
            )}
            <h3 className="text-xs md:text-sm font-semibold text-slate-600 uppercase tracking-wide leading-tight">{title}</h3>
          </div>
          
          <div className="flex items-end gap-2 md:gap-3">
            <p className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent leading-none">
              {value.toLocaleString()}
            </p>
            
            {trend && (
              <div className={`flex items-center gap-1 px-2 md:px-3 py-1 rounded-full text-xs font-semibold ${getTrendColor()}`}>
                <span>{getTrendIcon()}</span>
                <span>{trend}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}