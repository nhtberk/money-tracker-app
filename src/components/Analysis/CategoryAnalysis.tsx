'use client';

import { Card } from '@/components/ui/Card';
import { Transaction } from '@/types';
import { getCategoryById } from '@/utils/categories';
import { formatCurrency } from '@/utils/format';

interface CategoryAnalysisProps {
  type: 'expense' | 'income';
  transactions: Transaction[];
}

export function CategoryAnalysis({ type, transactions}: CategoryAnalysisProps) {

  // Kategori bazlı toplam hesaplama
  const categoryTotals = transactions
    .filter(t => t.type === type)
    .reduce((acc, transaction) => {
      const category = getCategoryById(transaction.categoryId);
      if (!category) return acc;

      if (!acc[category.id]) {
        acc[category.id] = {
          name: category.name,
          total: 0,
          color: category.color,
          type: category.type
        };
      }
      acc[category.id].total += transaction.amount;
      return acc;
    }, {} as Record<string, { name: string; total: number; color: string; type: string }>);

  const filteredCategories = Object.values(categoryTotals)
    .sort((a, b) => b.total - a.total);

  return (
    <Card className="p-6 bg-white dark:bg-gray-800">
      <h2 className="font-semibold mb-4 text-gray-800 dark:text-white">
        Kategori Bazlı Harcamalar
      </h2>
      <div className="space-y-4">
        {filteredCategories.map((category, index) => (
          <div 
            key={index} 
            className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <span className="text-gray-700 dark:text-gray-300">
                {category.name}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {formatCurrency(category.total)}
              </span>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {((category.total / filteredCategories.reduce((acc, cat) => acc + cat.total, 0)) * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        ))}
        
        {filteredCategories.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400">
            Bu dönemde harcama bulunmuyor
          </p>
        )}
      </div>
    </Card>
  );
} 