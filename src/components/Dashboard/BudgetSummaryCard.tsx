interface BudgetSummaryCardProps {
  title: string;
  amount: number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  isPercentage?: boolean;
  trend?: number; // Önceki döneme göre değişim
}

export default function BudgetSummaryCard({
  title,
  amount,
  icon: Icon,
  color,
  bgColor,
  isPercentage,
  trend
}: BudgetSummaryCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transform transition-all duration-200 hover:scale-105 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
            {isPercentage 
              ? `%${amount.toFixed(1)}`
              : new Intl.NumberFormat('tr-TR', {
                  style: 'currency',
                  currency: 'TRY'
                }).format(amount)
            }
          </h3>
          {trend !== undefined && (
            <p className={`text-sm mt-2 ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${bgColor}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </div>
  );
} 