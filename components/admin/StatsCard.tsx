interface StatsCardProps {
  title: string;
  value: number;
  icon?: string;
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
        return '↗️';
      case 'down':
        return '↘️';
      default:
        return '➡️';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 group">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            {icon && (
              <div className="text-3xl group-hover:scale-110 transition-transform duration-300">{icon}</div>
            )}
            <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">{title}</h3>
          </div>
          
          <div className="flex items-end gap-3">
            <p className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              {value.toLocaleString()}
            </p>
            
            {trend && (
              <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getTrendColor()}`}>
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