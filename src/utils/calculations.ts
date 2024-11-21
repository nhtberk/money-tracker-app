import { Transaction } from '@/types';

// Mevcut fonksiyonlar...

// Kategori bazlı aylık analiz
export function calculateMonthlyCategories(transactions: Transaction[]) {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  return transactions
    .filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === currentMonth && 
             date.getFullYear() === currentYear;
    })
    .reduce((acc, t) => {
      const key = `${t.categoryId}-${t.type}`;
      acc[key] = (acc[key] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);
}

// Günlük ortalama hesaplama
export function calculateDailyAverage(transactions: Transaction[]) {
  const grouped = groupTransactionsByDate(transactions);
  
  const totals = grouped.reduce((acc, day) => {
    acc.income += day.income;
    acc.expense += day.expense;
    return acc;
  }, { income: 0, expense: 0 });

  return {
    averageIncome: totals.income / grouped.length,
    averageExpense: totals.expense / grouped.length
  };
}

// Toplam hesaplama
export function calculateTotals(transactions: Transaction[]) {
  return transactions.reduce(
    (acc, transaction) => {
      if (transaction.type === 'income') {
        acc.totalIncome += transaction.amount;
      } else {
        acc.totalExpense += transaction.amount;
      }
      return acc;
    },
    { totalIncome: 0, totalExpense: 0 }
  );
}

// Aylık gruplandırma
export function groupTransactionsByMonth(transactions: Transaction[]) {
  const monthlyData = transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date);
    const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
    
    if (!acc[monthKey]) {
      acc[monthKey] = {
        month: new Date(date.getFullYear(), date.getMonth(), 1)
          .toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' }),
        income: 0,
        expense: 0
      };
    }

    if (transaction.type === 'income') {
      acc[monthKey].income += transaction.amount;
    } else {
      acc[monthKey].expense += transaction.amount;
    }

    return acc;
  }, {} as Record<string, { month: string; income: number; expense: number }>);

  // Son 6 ayı al ve sırala
  return Object.values(monthlyData)
    .sort((a, b) => {
      const [aMonth, aYear] = a.month.split(' ');
      const [bMonth, bYear] = b.month.split(' ');
      return new Date(`${aMonth} 1, ${aYear}`).getTime() - new Date(`${bMonth} 1, ${bYear}`).getTime();
    })
    .slice(-6);
}

// Tarihe göre gruplandırma
export function groupTransactionsByDate(transactions: Transaction[]) {
  const dailyData = transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date).toLocaleDateString('tr-TR');
    
    if (!acc[date]) {
      acc[date] = {
        date,
        income: 0,
        expense: 0
      };
    }

    if (transaction.type === 'income') {
      acc[date].income += transaction.amount;
    } else {
      acc[date].expense += transaction.amount;
    }

    return acc;
  }, {} as Record<string, { date: string; income: number; expense: number }>);

  return Object.values(dailyData).sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

export const calculateCurrentSpending = (
    transactions: Transaction[], 
    categoryId: string,
    date: Date = new Date()
) => {
    const currentMonth = date.getMonth();
    const currentYear = date.getFullYear();

    return transactions
        .filter(t => {
            const transactionDate = new Date(t.date);
            return t.categoryId === categoryId && 
                   t.type === 'expense' &&
                   transactionDate.getMonth() === currentMonth &&
                   transactionDate.getFullYear() === currentYear;
        })
        .reduce((total, t) => total + t.amount, 0);
}; 