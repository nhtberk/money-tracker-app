import { Transaction } from '@/types';
import { getCategoryById } from './categories';
import { SavingsAnalysis, CategoryAnalysis, SavingTip } from '@/types/savings';
import { formatCurrency } from './format';

// Belirli bir tarih aralığındaki işlemleri filtrele
const filterTransactionsByDate = (
  transactions: Transaction[],
  startDate: Date,
  endDate: Date
) => {
  return transactions.filter(t => {
    const date = new Date(t.date);
    return date >= startDate && date <= endDate && t.type === 'expense';
  });
};

// Kategori bazlı analiz yap
const analyzeCategorySpending = (
  currentTransactions: Transaction[],
  previousTransactions: Transaction[]
): CategoryAnalysis[] => {
  const categories = new Map<string, CategoryAnalysis>();

  // Mevcut ay analizi
  currentTransactions.forEach(t => {
    const category = getCategoryById(t.categoryId);
    if (!category) return;

    if (!categories.has(category.id)) {
      categories.set(category.id, {
        categoryId: category.id,
        name: category.name,
        currentSpending: 0,
        previousSpending: 0,
        trend: 0,
        frequency: 0,
        averageTransaction: 0
      });
    }

    const analysis = categories.get(category.id)!;
    analysis.currentSpending += t.amount;
    analysis.frequency += 1;
  });

  // Önceki ay analizi ve trend hesaplama
  previousTransactions.forEach(t => {
    const category = getCategoryById(t.categoryId);
    if (!category || !categories.has(category.id)) return;

    const analysis = categories.get(category.id)!;
    analysis.previousSpending += t.amount;
  });

  // Ortalama işlem ve trend hesaplama
  return Array.from(categories.values()).map(analysis => ({
    ...analysis,
    averageTransaction: analysis.currentSpending / analysis.frequency,
    trend: ((analysis.currentSpending - analysis.previousSpending) / analysis.previousSpending) * 100
  }));
};

// Tasarruf önerileri oluştur
const generateTips = (categoryAnalysis: CategoryAnalysis[]): SavingTip[] => {
  const tips: SavingTip[] = [];

  categoryAnalysis.forEach(analysis => {
    // Yüksek harcama artışı
    if (analysis.trend > 20) {
      tips.push({
        id: `high-increase-${analysis.categoryId}`,
        message: `${analysis.name} kategorisinde geçen aya göre %${analysis.trend.toFixed(0)} artış var. Harcamalarınızı gözden geçirmenizi öneririz.`,
        type: 'warning',
        category: analysis.name,
        impact: 'high'
      });
    }

    // Sık işlem uyarısı
    if (analysis.frequency > 10) {
      tips.push({
        id: `high-frequency-${analysis.categoryId}`,
        message: `${analysis.name} kategorisinde çok sık işlem yapıyorsunuz. Toplu alışveriş yaparak tasarruf edebilirsiniz.`,
        type: 'suggestion',
        category: analysis.name,
        impact: 'medium'
      });
    }

    // Yüksek ortalama işlem
    if (analysis.averageTransaction > 500) {
      tips.push({
        id: `high-average-${analysis.categoryId}`,
        message: `${analysis.name} kategorisinde ortalama işlem tutarınız ${formatCurrency(analysis.averageTransaction)}. Daha uygun alternatifler araştırabilirsiniz.`,
        type: 'suggestion',
        category: analysis.name,
        impact: 'medium'
      });
    }
  });

  return tips;
};

// Ana analiz fonksiyonu
export const analyzeSavings = (transactions: Transaction[]): SavingsAnalysis => {
  const today = new Date();
  const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const previousMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);

  const currentTransactions = filterTransactionsByDate(transactions, currentMonthStart, today);
  const previousTransactions = filterTransactionsByDate(transactions, previousMonthStart, currentMonthStart);

  const categoryAnalysis = analyzeCategorySpending(currentTransactions, previousTransactions);
  const tips = generateTips(categoryAnalysis);

  const currentTotal = currentTransactions.reduce((sum, t) => sum + t.amount, 0);
  const previousTotal = previousTransactions.reduce((sum, t) => sum + t.amount, 0);

  return {
    tips,
    potentialSavings: Math.max(0, currentTotal - previousTotal),
    categoryAnalysis,
    monthlyComparison: {
      current: currentTotal,
      previous: previousTotal,
      difference: currentTotal - previousTotal,
      percentageChange: ((currentTotal - previousTotal) / previousTotal) * 100
    }
  };
}; 