import { useState } from 'react';
import { useBudget } from '@/context/BudgetContext';
import { useNotification } from '@/context/NotificationContext';
import { generateTransactionsPDF, generateCategoryReportPDF } from '@/utils/pdfGenerator';
import { Card } from '../ui/Card';
import { BsFileArrowDown } from 'react-icons/bs';

export function FinancialReports() {
  const { transactions } = useBudget();
  const { showNotification } = useNotification();
  const [dateRange, setDateRange] = useState('all');

  const filteredTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    const today = new Date();

    switch (dateRange) {
      case 'month':
        return (
          transactionDate.getMonth() === today.getMonth() &&
          transactionDate.getFullYear() === today.getFullYear()
        );
      case 'year':
        return transactionDate.getFullYear() === today.getFullYear();
      default:
        return true;
    }
  });

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const handleGenerateReport = (type: 'transactions' | 'categories') => {
    try {
      const dateRangeText = dateRange === 'month' ? 'Aylık' : 
                           dateRange === 'year' ? 'Yıllık' : 
                           'Tüm Zamanlar';

      if (type === 'transactions') {
        generateTransactionsPDF(
          filteredTransactions,
          dateRangeText,
          totalIncome,
          totalExpense
        );
      } else {
        generateCategoryReportPDF(filteredTransactions, dateRangeText);
      }

      showNotification('Rapor başarıyla oluşturuldu', 'success');
    } catch (error) {
      showNotification('Rapor oluşturulurken bir hata oluştu', 'error');
    }
  };

  return (
    <Card className="p-6 bg-white dark:bg-gray-800">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
        Finansal Raporlar
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Dönem Seçin
          </label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-600"
          >
            <option value="all">Tüm Zamanlar</option>
            <option value="month">Bu Ay</option>
            <option value="year">Bu Yıl</option>
          </select>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => handleGenerateReport('transactions')}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
          >
            <BsFileArrowDown className="w-5 h-5" />
            İşlem Raporu İndir
          </button>

          <button
            onClick={() => handleGenerateReport('categories')}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200"
          >
            <BsFileArrowDown className="w-5 h-5" />
            Kategori Raporu İndir
          </button>
        </div>
      </div>
    </Card>
  );
} 