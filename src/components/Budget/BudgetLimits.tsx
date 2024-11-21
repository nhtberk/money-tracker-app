'use client';

import { useEffect, useState } from 'react';
import { useBudget } from '@/context/BudgetContext';
import { useNotification } from '@/context/NotificationContext';
import { getCategoriesByType } from '@/utils/categories';
import { Card } from '../ui/Card';
import { formatCurrency } from '@/utils/format';
import { BudgetLimit } from '@/types';
import { BsPen, BsTrash } from 'react-icons/bs';

export function BudgetLimits() {
  const { budgetLimits, setBudgetLimit, deleteBudgetLimit, updateBudgetLimit, transactions } = useBudget();
  const { showNotification } = useNotification();
  const expenseCategories = getCategoriesByType('expense');
  
  const [editingLimit, setEditingLimit] = useState<BudgetLimit | null>(null);
  const [formData, setFormData] = useState({
    categoryId: '',
    amount: '',
    period: ''
  });

  // Mevcut harcamaları hesapla ve limit kontrolü yap
  const calculateCurrentSpending = (categoryId: string) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const total = transactions
      .filter(t => {
        const date = new Date(t.date);
        return t.categoryId === categoryId && 
               t.type === 'expense' &&
               date.getMonth() === currentMonth &&
               date.getFullYear() === currentYear;
      })
      .reduce((total, t) => total + t.amount, 0);

    return total;
  };

  // Limit kontrolü ve uyarı gösterimi
  const checkBudgetLimits = () => {
    budgetLimits.forEach(limit => {
      const currentSpending = calculateCurrentSpending(limit.categoryId);
      const percentage = (currentSpending / limit.amount) * 100;
      const category = expenseCategories.find(c => c.id === limit.categoryId);
      
      if (!category) return;

      if (percentage >= 80 && percentage < 90) {
        showNotification(
          `${category.name} kategorisinde bütçe limitinin %${percentage.toFixed(0)}'ine ulaştınız!`,
          'warning'
        );
      } else if (percentage >= 90 && percentage < 100) {
        showNotification(
          `Dikkat! ${category.name} kategorisinde bütçe limitinin %${percentage.toFixed(0)}'ine ulaştınız!`,
          'error'
        );
      } else if (percentage >= 100) {
        showNotification(
          `${category.name} kategorisinde bütçe limitini aştınız!`,
          'error'
        );
      }
    });
  };

  // Component mount olduğunda ve transactions değiştiğinde limit kontrolü yap
  useEffect(() => {
    checkBudgetLimits();
  }, [transactions]); // transactions değiştiğinde kontrol et

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId || !formData.amount) return;

    const newLimit = {
      categoryId: formData.categoryId,
      amount: Number(formData.amount),
      period: formData.period as 'monthly' | 'yearly'
    };

    if (editingLimit) {
      updateBudgetLimit(newLimit);
      showNotification('Bütçe limiti başarıyla güncellendi', 'success');
    } else {
      setBudgetLimit(newLimit);
      showNotification('Yeni bütçe limiti eklendi', 'success');
    }

    setFormData({
      categoryId: '',
      amount: '',
      period: 'monthly'
    });
    setEditingLimit(null);
  };

  const handleEdit = (limit: BudgetLimit) => {
    setEditingLimit(limit);
    setFormData({
      categoryId: limit.categoryId,
      amount: limit.amount.toString(),
      period: limit.period
    });
  };

  const handleDelete = (categoryId: string) => {
    if (window.confirm('Bu bütçe limitini silmek istediğinizden emin misiniz?')) {
      deleteBudgetLimit(categoryId);
      showNotification('Bütçe limiti silindi', 'warning');
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white dark:bg-gray-800">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          {editingLimit ? 'Bütçe Limitini Düzenle' : 'Yeni Bütçe Limiti Ekle'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
              className="w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              required
              disabled={!!editingLimit}
            >
              <option value="" className="text-gray-800 dark:text-gray-200">Kategori Seçin</option>
              {expenseCategories.map(category => (
                <option key={category.id} value={category.id} className="text-gray-800 dark:text-gray-200">
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              placeholder="Limit Tutarı"
              min="0"
              step="0.01"
              className="w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <select
              value={formData.period}
              onChange={(e) => setFormData(prev => ({ ...prev, period: e.target.value as 'monthly' | 'yearly' }))}
              className="w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            >
              <option value="monthly" className="text-gray-800 dark:text-gray-200">Aylık</option>
              <option value="yearly" className="text-gray-800 dark:text-gray-200">Yıllık</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors duration-200"
            >
              {editingLimit ? 'Güncelle' : 'Limit Ekle'}
            </button>
            
            {editingLimit && (
              <button
                type="button"
                onClick={() => {
                  setEditingLimit(null);
                  setFormData({
                    categoryId: '',
                    amount: '',
                    period: 'monthly'
                  });
                }}
                className="py-2 px-4 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors duration-200"
              >
                İptal
              </button>
            )}
          </div>
        </form>
      </Card>

      <Card className="p-6 bg-white dark:bg-gray-800">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Mevcut Limitler</h2>
        <div className="space-y-4">
          {budgetLimits.map(limit => {
            const category = expenseCategories.find(c => c.id === limit.categoryId);
            if (!category) return null;

            const currentSpending = calculateCurrentSpending(limit.categoryId);
            const percentage = (currentSpending / limit.amount) * 100;
            const isWarning = percentage >= 80;

            return (
              <div key={limit.categoryId} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-800 dark:text-white">{category.name}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      ({limit.period === 'monthly' ? 'Aylık' : 'Yıllık'})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`${isWarning ? 'text-red-500' : 'text-gray-600 dark:text-gray-300'}`}>
                      {formatCurrency(currentSpending)} / {formatCurrency(limit.amount)}
                    </span>
                    <button
                      onClick={() => handleEdit(limit)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors duration-200"
                    >
                      <BsPen className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </button>
                    <button
                      onClick={() => handleDelete(limit.categoryId)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors duration-200"
                    >
                      <BsTrash className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${
                      isWarning ? 'bg-red-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
                {isWarning && (
                  <p className="text-sm text-red-500 mt-1">
                    Limit uyarısı: Bütçenin %{percentage.toFixed(0)}&#39;ına ulaştınız!
                  </p>
                )}
              </div>
            );
          })}
          {budgetLimits.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400 text-center">Henüz limit belirlenmemiş</p>
          )}
        </div>
      </Card>
    </div>
  );
} 