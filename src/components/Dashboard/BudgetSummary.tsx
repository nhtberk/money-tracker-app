'use client';

import { useBudget } from '@/context/BudgetContext';
import { calculateTotals } from '@/utils/calculations';
import { 
  BsWallet2, 
  BsArrowUpCircle, 
  BsArrowDownCircle, 
  BsPiggyBank 
} from 'react-icons/bs';

export default function BudgetSummary() {
  const { transactions } = useBudget();
  const { totalIncome, totalExpense } = calculateTotals(transactions);

  const balance = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 
    ? ((totalIncome - totalExpense) / totalIncome) * 100 
    : 0;
  const summaryCards = [
    {
      title: 'Toplam Bakiye',
      amount: balance,
      icon: BsWallet2,
      color: 'text-blue-500',
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
    },
    {
      title: 'Gelirler',
      amount: totalIncome,
      icon: BsArrowUpCircle,
      color: 'text-green-500',
      bgColor: 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20',
      borderColor: 'border-green-200 dark:border-green-800',
    },
    {
      title: 'Giderler',
      amount: totalExpense,
      icon: BsArrowDownCircle,
      color: 'text-red-500',
      bgColor: 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20',
      borderColor: 'border-red-200 dark:border-red-800',
    },
    {
      title: 'Tasarruf',
      amount: savingsRate,
      icon: BsPiggyBank,
      color: 'text-purple-500',
      bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20',
      borderColor: 'border-purple-200 dark:border-purple-800',
      isPercentage: true,
    },
  ];

  return (
    <>
      {summaryCards.map((card, index) => (
        <div
          key={index}
          className={`relative overflow-hidden rounded-xl border ${card.borderColor} ${card.bgColor} p-6 transition-all duration-200 hover:shadow-lg`}
        >
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {card.title}
              </p>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                {card.isPercentage 
                  ? `%${Number(card.amount).toFixed(1)}`
                  : new Intl.NumberFormat('tr-TR', {
                      style: 'currency',
                      currency: 'TRY',
                      maximumFractionDigits: 0
                    }).format(card.amount)
                }
              </h3>
            </div>
            <div className={`rounded-full p-3 ${card.color} bg-white/80 dark:bg-gray-800/80`}>
              <card.icon className="w-6 h-6" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
} 