'use client';

import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { getCategoryById } from '@/utils/categories';
import { Transaction } from '@/types';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  type?: 'expense' | 'income';
  transactions: Transaction[];
}

export function PieChart({ type = 'expense', transactions }: PieChartProps) {

  const filteredTransactions = transactions.filter((t: Transaction) => t.type === type);
  
  if (filteredTransactions.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] text-gray-500 dark:text-gray-400">
        Veri bulunmuyor
      </div>
    );
  }

  // Kategori bazlı toplam hesaplama
  const categoryTotals = filteredTransactions
    .reduce((acc, transaction) => {
      const category = getCategoryById(transaction.categoryId);
      if (!category) return acc;

      acc[category.name] = (acc[category.name] || 0) + transaction.amount;
      return acc;
    }, {} as Record<string, number>);

  const data = {
    labels: Object.keys(categoryTotals),
    datasets: [{
      data: Object.values(categoryTotals),
      backgroundColor: type === 'expense' 
        ? ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
        : ['#4CAF50', '#8BC34A', '#CDDC39', '#FFC107']
    }]
  };

  const options = {
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: 'rgb(156, 163, 175)',
        }
      }
    }
  };

  return <Pie data={data} options={options} />;
} 