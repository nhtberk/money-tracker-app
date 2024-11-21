import { Transaction } from "@/types";
import { getCategoryById } from "./categories";

export const generateSavingsTips = (transactions: Transaction[]): string[] => {
  const tips: string[] = [];
  
  // Son ayın harcamaları
  const lastMonthTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    return date >= lastMonth && t.type === 'expense';
  });

  // Kategori bazlı analiz
  const categoryTotals = lastMonthTransactions.reduce((acc, t) => {
    const category = getCategoryById(t.categoryId);
    if (!category) return acc;
    
    if (!acc[category.id]) {
      acc[category.id] = {
        name: category.name,
        total: 0,
        transactions: 0
      };
    }
    
    acc[category.id].total += t.amount;
    acc[category.id].transactions += 1;
    return acc;
  }, {} as Record<string, { name: string; total: number; transactions: number }>);

  // En yüksek harcama kategorileri
  const highSpendingCategories = Object.values(categoryTotals)
    .sort((a, b) => b.total - a.total)
    .slice(0, 3);
  // Kategori bazlı öneriler
  highSpendingCategories.forEach((category) => {
    if (category.total > 1000) {
      tips.push(`${category.name} kategorisinde yüksek harcama tespit edildi. Bu alanda tasarruf yapabilirsiniz.`);
    }
    if (category.transactions > 10) {
      tips.push(`${category.name} kategorisinde sık harcama yapıyorsunuz. Harcama sıklığını azaltmayı deneyebilirsiniz.`);
    }
  });

  // Genel öneriler
  const totalExpense = lastMonthTransactions.reduce((sum, t) => sum + t.amount, 0);
  if (totalExpense > 5000) {
    tips.push('Aylık harcamalarınız yüksek seviyede. Bütçe planı oluşturmayı düşünebilirsiniz.');
  }

  return tips;
}; 