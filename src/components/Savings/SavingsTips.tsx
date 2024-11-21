import { useBudget } from '@/context/BudgetContext';
import { analyzeSavings } from '@/utils/savingsAnalysis';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/utils/format';
import { BsCheckCircle, BsExclamationCircle, BsFillLightbulbFill } from 'react-icons/bs';

export function SavingsTips() {
  const { transactions } = useBudget();
  const analysis = analyzeSavings(transactions);

  const getIconForTipType = (type: string) => {
    switch (type) {
      case 'warning':
        return <BsExclamationCircle className="w-5 h-5 text-red-500" />;
      case 'suggestion':
        return <BsFillLightbulbFill className="w-5 h-5 text-yellow-500" />;
      case 'achievement':
        return <BsCheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <BsFillLightbulbFill className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white dark:bg-gray-800">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          Aylık Karşılaştırma
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <p className="text-sm text-gray-500 dark:text-gray-400">Bu Ay</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {formatCurrency(analysis.monthlyComparison.current)}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <p className="text-sm text-gray-500 dark:text-gray-400">Geçen Ay</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {formatCurrency(analysis.monthlyComparison.previous)}
            </p>
          </div>
        </div>
        <div className="mt-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
          <p className="text-sm text-gray-700 dark:text-gray-300">
          <div className="flex items-center gap-2">
            {analysis.monthlyComparison.difference > 0 
              ? <BsExclamationCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              : <BsCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            }
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {analysis.monthlyComparison.difference > 0 
                ? `Bu ay geçen aya göre ${formatCurrency(analysis.monthlyComparison.difference)} daha fazla harcama yaptınız.`
                : `Bu ay geçen aya göre ${formatCurrency(Math.abs(analysis.monthlyComparison.difference))} tasarruf ettiniz.`
              }
            </p>
          </div>
          </p>
        </div>
      </Card>

      <Card className="p-6 bg-white dark:bg-gray-800">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          Tasarruf Önerileri
        </h2>
        <div className="space-y-4">
          {analysis.tips.map((tip) => (
            <div 
              key={tip.id}
              className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50"
            >
              {getIconForTipType(tip.type)}
              <div>
                <p className="text-gray-700 dark:text-gray-300">
                  {tip.message}
                </p>
                {tip.saved && (
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    Potansiyel Tasarruf: {formatCurrency(tip.saved)}
                  </p>
                )}
              </div>
            </div>
          ))}
          
          {analysis.tips.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400">
              Şu an için yeni tasarruf önerisi bulunmuyor.
            </p>
          )}
        </div>
      </Card>

      <Card className="p-6 bg-white dark:bg-gray-800">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          Kategori Analizi
        </h2>
        <div className="space-y-4">
          {analysis.categoryAnalysis.map((category) => (
            <div 
              key={category.categoryId}
              className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-gray-800 dark:text-white">
                  {category.name}
                </h3>
                <span className={`text-sm ${
                  category.trend > 0 ? 'text-red-500' : 'text-green-500'
                }`}>
                  {category.trend > 0 ? '↑' : '↓'} {Math.abs(category.trend).toFixed(1)}%
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Bu Ay</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatCurrency(category.currentSpending)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Ortalama İşlem</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatCurrency(category.averageTransaction)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
} 