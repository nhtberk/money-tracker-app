'use client';

import { useBudget } from '@/context/BudgetContext';
import { formatCurrency, formatDate } from '@/utils/format';
import { BsArrowUpCircle, BsArrowDownCircle } from 'react-icons/bs';
import { useNotification } from '@/context/NotificationContext';

export default function TransactionList() {
  const { transactions, deleteTransaction } = useBudget();
  const { showNotification } = useNotification();

  const handleDelete = (transactionId: string) => {
    if (window.confirm('Bu işlemi silmek istediğinizden emin misiniz?')) {
      deleteTransaction(transactionId);
      showNotification('İşlem başarıyla silindi', 'success');
    }
  };

  // Son 5 işlemi göster
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-4">
      {recentTransactions.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          Henüz işlem bulunmuyor
        </p>
      ) : (
        recentTransactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${
                transaction.type === 'income' 
                  ? 'bg-green-100 dark:bg-green-900/20 text-green-500' 
                  : 'bg-red-100 dark:bg-red-900/20 text-red-500'
              }`}>
                {transaction.type === 'income' 
                  ? <BsArrowUpCircle className="w-5 h-5" />
                  : <BsArrowDownCircle className="w-5 h-5" />
                }
              </div>
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  {transaction.description}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(transaction.date)}
                </p>
              </div>
            </div>
            <span className={`font-medium ${
              transaction.type === 'income' 
                ? 'text-green-500' 
                : 'text-red-500'
            }`}>
              {transaction.type === 'income' ? '+' : '-'}
              {formatCurrency(transaction.amount)}
            </span>
          </div>
        ))
      )}
    </div>
  );
} 