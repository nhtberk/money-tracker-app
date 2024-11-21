'use client';


import { formatCurrency } from '@/utils/format';
import { Card } from '../ui/Card';

interface SummaryCardsProps {
  totalIncome: number;
  totalExpense: number;
}

export function SummaryCards({ totalIncome, totalExpense }: SummaryCardsProps) {
  const balance = totalIncome - totalExpense;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="p-6">
        <h2 className="font-semibold text-gray-500 mb-2">Toplam Gelir</h2>
        <p className="text-2xl font-bold text-green-600">
          {formatCurrency(totalIncome)}
        </p>
      </Card>
      
      <Card className="p-6">
        <h2 className="font-semibold text-gray-500 mb-2">Toplam Gider</h2>
        <p className="text-2xl font-bold text-red-600">
          {formatCurrency(totalExpense)}
        </p>
      </Card>

      <Card className="p-6">
        <h2 className="font-semibold text-gray-500 mb-2">Net Bakiye</h2>
        <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {formatCurrency(balance)}
        </p>
      </Card>
    </div>
  );
}