'use client';

import { Card } from '@/components/ui/Card';
import { SummaryCards } from '@/components/Analysis/SummaryCards';
import { useState } from 'react';
import { useBudget } from '@/context/BudgetContext';
import { calculateTotals } from '@/utils/calculations';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { BarChart } from '@/components/Charts/BarChart';
import { LineChart } from '@/components/Charts/LineChart';
import { PieChart } from '@/components/Charts/PieChart';
import { CategoryAnalysis } from '@/components/Analysis/CategoryAnalysis';

export default function AnalysisPage() {
    const { transactions } = useBudget();
    const [timeRange, setTimeRange] = useState('month');
    const [pieChartType, setPieChartType] = useState<'expense' | 'income'>('expense');
    const [barChartType, setBarChartType] = useState<'expense' | 'income'>('expense');
    const [categoryAnalysisType, setCategoryAnalysisType] = useState<'expense' | 'income'>('expense');
    const { totalIncome, totalExpense } = calculateTotals(transactions);

    // Tarih aralığına göre işlemleri filtrele
    const getFilteredTransactions = () => {
        const now = new Date();
        const startDate = new Date();

        switch (timeRange) {
            case 'week':
                startDate.setDate(now.getDate() - 7);
                break;
            case 'month':
                startDate.setMonth(now.getMonth() - 1);
                break;
            case 'year':
                startDate.setFullYear(now.getFullYear() - 1);
                break;
            default:
                startDate.setMonth(now.getMonth() - 1); // varsayılan: son 1 ay
        }

        return transactions.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            return transactionDate >= startDate && transactionDate <= now;
        });
    };

    const filteredTransactions = getFilteredTransactions();

    const hasTransactions = filteredTransactions.length > 0;
    const hasExpenses = filteredTransactions.some(t => t.type === 'expense');
    const hasIncome = filteredTransactions.some(t => t.type === 'income');

    if (!hasTransactions) {
        return (
            <DashboardLayout>
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                        Finansal Analiz
                    </h1>
                    <Card className="p-6 text-center">
                        <p className="text-gray-600 dark:text-gray-400">
                            Henüz hiç işlem bulunmuyor. Analiz için işlem eklemeye başlayın.
                        </p>
                    </Card>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="p-6 space-y-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                        Finansal Analiz
                    </h1>
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    >
                        <option value="week">Bu Hafta</option>
                        <option value="month">Bu Ay</option>
                        <option value="year">Bu Yıl</option>
                    </select>
                </div>
                
                <SummaryCards 
                    totalIncome={totalIncome}
                    totalExpense={totalExpense}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {hasTransactions && (
                        <Card className="p-6 bg-white dark:bg-gray-800">
                            <h2 className="font-semibold mb-4 text-gray-800 dark:text-white">
                                Gelir/Gider Trendi
                            </h2>
                            <LineChart transactions={filteredTransactions} />
                        </Card>
                    )}

                    {hasExpenses && (
                        <Card className="p-6 bg-white dark:bg-gray-800">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="font-semibold text-gray-800 dark:text-white">
                                    Gider Kategorileri
                                </h2>
                                <select
                                    className="px-3 py-1 text-sm rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                                    value={pieChartType}
                                    onChange={(e) => setPieChartType(e.target.value as 'expense' | 'income')}
                                >
                                    <option value="expense">Gider</option>
                                    <option value="income">Gelir</option>
                                </select>
                            </div>
                            <PieChart type={pieChartType} transactions={filteredTransactions} />
                        </Card>
                    )}

                    {hasExpenses && (
                        <Card className="p-6 bg-white dark:bg-gray-800">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="font-semibold text-gray-800 dark:text-white">
                                    En Çok Harcama Yapılan Kategoriler
                                </h2>
                                <select
                                    className="px-3 py-1 text-sm rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                                    value={barChartType}
                                    onChange={(e) => setBarChartType(e.target.value as 'expense' | 'income')}
                                >
                                    <option value="expense">Gider</option>
                                    <option value="income">Gelir</option>
                                </select>
                            </div>
                            <BarChart type={barChartType} transactions={filteredTransactions} />
                        </Card>
                    )}

                    {hasExpenses && (
                        <Card className="p-6 bg-white dark:bg-gray-800">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="font-semibold text-gray-800 dark:text-white">
                                    Kategori Analizi
                                </h2>
                                <select
                                    className="px-3 py-1 text-sm rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                                    value={categoryAnalysisType}
                                    onChange={(e) => setCategoryAnalysisType(e.target.value as 'expense' | 'income')}
                                >
                                    <option value="expense">Gider</option>
                                    <option value="income">Gelir</option>
                                </select>
                            </div>
                            <CategoryAnalysis type={categoryAnalysisType} transactions={filteredTransactions} />
                        </Card>
                    )}
                </div>

                {!hasExpenses && !hasIncome && (
                    <Card className="p-6 text-center">
                        <p className="text-gray-600 dark:text-gray-400">
                            Seçilen dönem için işlem bulunmuyor.
                        </p>
                    </Card>
                )}
            </div>
        </DashboardLayout>
    );
}