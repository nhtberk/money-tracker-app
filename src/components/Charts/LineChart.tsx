'use client';

import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { groupTransactionsByMonth } from '@/utils/calculations';
import { Transaction } from '@/types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export function LineChart({ transactions }: { transactions: Transaction[] }) {
  const monthlyData = groupTransactionsByMonth(transactions);

  const data = {
    labels: monthlyData.map(d => d.month),
    datasets: [
      {
        label: 'Gelir',
        data: monthlyData.map(d => d.income),
        borderColor: 'rgb(34, 197, 94)',
        tension: 0.1
      },
      {
        label: 'Gider',
        data: monthlyData.map(d => d.expense),
        borderColor: 'rgb(239, 68, 68)',
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgb(156, 163, 175)',
        }
      },
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

  return <Line data={data} options={options} />;
} 