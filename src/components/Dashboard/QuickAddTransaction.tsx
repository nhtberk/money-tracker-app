'use client';
import { useState } from 'react';
import { useBudget } from '@/context/BudgetContext';
import { getCategoriesByType } from '@/utils/categories';
import { useNotification } from '@/context/NotificationContext';
import { calculateCurrentSpending } from '@/utils/calculations';

export default function QuickAddTransaction({ onSuccess }: { onSuccess: () => void }) {
    const { addTransaction, budgetLimits, transactions } = useBudget();
    const { showNotification } = useNotification();
    const [type, setType] = useState<'income' | 'expense'>('expense');
    const categories = getCategoriesByType(type);
    
    const today = new Date().toISOString().split('T')[0];
    
    const [formData, setFormData] = useState({
        amount: '',
        description: '',
        categoryId: '',
        date: today,
    });

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (Number(value) > 0) {
            setFormData(prev => ({ ...prev, amount: value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.amount ||!formData.description || !formData.categoryId || Number(formData.amount) <= 0) return;

        addTransaction({
            type,
            amount: Number(formData.amount),
            description: formData.description,
            categoryId: formData.categoryId,
            date: formData.date,
        });

        // İşlem başarılı bildirimi
        showNotification(
            `${type === 'income' ? 'Gelir' : 'Gider'} işlemi başarıyla eklendi`,
            'success'
        );

        // Bütçe limit kontrolü (sadece gider işlemleri için)
        if (type === 'expense') {
            const limit = budgetLimits.find(l => l.categoryId === formData.categoryId);
            if (limit) {
                const currentSpending = calculateCurrentSpending(transactions, formData.categoryId);
                const newTotal = currentSpending + Number(formData.amount);
                const percentage = (newTotal / limit.amount) * 100;
                const category = categories.find(c => c.id === formData.categoryId);

                if (percentage >= 80 && percentage < 90) {
                    showNotification(
                        `${category?.name} kategorisinde bütçe limitinin %${percentage.toFixed(0)}'ine ulaştınız!`,
                        'warning'
                    );
                } else if (percentage >= 90 && percentage < 100) {
                    showNotification(
                        `Dikkat! ${category?.name} kategorisinde bütçe limitinin %${percentage.toFixed(0)}'ine ulaştınız!`,
                        'error'
                    );
                } else if (percentage >= 100) {
                    showNotification(
                        `${category?.name} kategorisinde bütçe limitini aştınız!`,
                        'error'
                    );
                }
            }
        }

        setFormData({
            amount: '',
            description: '',
            categoryId: '',
            date: today,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={() => setType('expense')}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium ${type === 'expense' ? 'bg-red-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                    Gider
                </button>
                <button
                    type="button"
                    onClick={() => setType('income')}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium ${type === 'income' ? 'bg-green-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                    Gelir
                </button>
            </div>

            <div>
                <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                    className="w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-600"
                    required>
                    <option value="">Kategori Seçin</option>
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <input
                    type="number"
                    value={formData.amount}
                    onChange={handleAmountChange}
                    placeholder="Tutar"
                    min="0.01"
                    step="0.01"
                    className="w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-600"
                    required
                />
            </div>

            <div>
                <input
                    type="text"
                    value={formData.description}
                    required
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Açıklama"
                    className="w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-600"
                />
            </div>

            <div>
                <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    max={today}
                    className="w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-600"
                    required
                />
            </div>

            <button
                type="submit"
                className={`w-full py-2 px-4 rounded-lg font-medium text-white ${type === 'expense' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}>
                {type === 'expense' ? 'Gider Ekle' : 'Gelir Ekle'}
            </button>
        </form>
    );
}
