'use client';

import { useState } from 'react';
import { useBudget } from '@/context/BudgetContext';
import { getCategoriesByType } from '@/utils/categories';
import { useNotification } from '@/context/NotificationContext';

export function AddTransaction() {
  const { addTransaction } = useBudget();
  const { showNotification } = useNotification();
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const categories = getCategoriesByType(type);

  const [formData, setFormData] = useState({
    categoryId: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.categoryId) return;

    addTransaction({
      ...formData,
      amount: Number(formData.amount),
      type: type
    });

    // İşlem başarılı bildirimi
    showNotification(
      `${type === 'income' ? 'Gelir' : 'Gider'} işlemi başarıyla eklendi`,
      'success'
    );

    // Form temizleme
    setFormData({
      categoryId: '',
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        {/* İşlem Tipi Seçimi */}
        <div>
          <label className="block text-sm font-medium mb-2">İşlem Tipi</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as 'income' | 'expense')}
            className="w-full p-2 border rounded"
          >
            <option value="expense">Gider</option>
            <option value="income">Gelir</option>
          </select>
        </div>

        {/* Kategori Seçimi */}
        <div>
          <label className="block text-sm font-medium mb-2">Kategori</label>
          <select
            value={formData.categoryId}
            onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
            className="w-full p-2 border rounded"
          >
            <option value="">Kategori Seçin</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Diğer form alanları... */}
      </div>
    </form>
  );
} 