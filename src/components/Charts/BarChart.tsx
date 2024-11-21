'use client';

import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { getCategoryById } from '@/utils/categories';
import { Transaction } from '@/types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BarChartProps {
  type: 'expense' | 'income';
  transactions: Transaction[];
}

export function BarChart({ type, transactions }: BarChartProps) {

  // Seçilen tipe göre işlemleri filtrele
  const filteredTotals = transactions
    .filter(t => t.type === type)
    .reduce((acc, transaction) => {
      const category = getCategoryById(transaction.categoryId);
      if (!category) return acc;

      acc[category.name] = (acc[category.name] || 0) + transaction.amount;
      return acc;
    }, {} as Record<string, number>);

  // En yüksek 5 kategoriyi al
  const sortedCategories = Object.entries(filteredTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const data = {
    labels: sortedCategories.map(([name]) => name),
    datasets: [
        {
            label: type === 'expense' ? 'Gider' : 'Gelir',
            data: sortedCategories.map(([, amount]) => amount),
            backgroundColor: type === 'expense' 
              ? [
                  'rgba(239, 68, 68, 0.5)',  // red-500 with opacity
                  'rgba(239, 68, 68, 0.45)',
                  'rgba(239, 68, 68, 0.4)',
                  'rgba(239, 68, 68, 0.35)',
                  'rgba(239, 68, 68, 0.3)',
                ]
              : [
                  'rgba(34, 197, 94, 0.5)',  // green-500 with opacity
                  'rgba(34, 197, 94, 0.45)',
                  'rgba(34, 197, 94, 0.4)',
                  'rgba(34, 197, 94, 0.35)',
                  'rgba(34, 197, 94, 0.3)',
                ],
            borderColor: type === 'expense'
              ? [
                  'rgb(239, 68, 68)',  // red-500
                  'rgb(239, 68, 68)',
                  'rgb(239, 68, 68)',
                  'rgb(239, 68, 68)',
                  'rgb(239, 68, 68)',
                ]
              : [
                  'rgb(34, 197, 94)',  // green-500
                  'rgb(34, 197, 94)',
                  'rgb(34, 197, 94)',
                  'rgb(34, 197, 94)',
                  'rgb(34, 197, 94)',
                ],
            borderWidth: 1,
          },
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
        }
      }
    }
  };

  return <Bar data={data} options={options} />;
} 