'use client';

import DashboardLayout from '@/components/Layout/DashboardLayout';
import BudgetSummary from '@/components/Dashboard/BudgetSummary';
import TransactionList from '@/components/Dashboard/TransactionList';
import ExpenseChart from '@/components/Dashboard/ExpenseChart';
import QuickAddTransaction from '@/components/Dashboard/QuickAddTransaction';
import { useNotification } from '@/context/NotificationContext';

export default function Home() {
  const { showNotification } = useNotification();

  const handleTransactionSuccess = () => {
    showNotification('İşlem başarıyla eklendi', 'success');
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Finansal Gösterge Paneli
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <BudgetSummary />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                Aylık Harcama Analizi
              </h2>
              <ExpenseChart />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                Hızlı İşlem Ekle
              </h2>
              <QuickAddTransaction onSuccess={handleTransactionSuccess} />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                Son İşlemler
              </h2>
              <TransactionList />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
