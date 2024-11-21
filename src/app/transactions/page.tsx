'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import QuickAddTransaction from '@/components/Dashboard/QuickAddTransaction';
import { BsPlus } from 'react-icons/bs';
import TransactionFilters from '@/components/Transactions/TransactionFilters';
import TransactionList from '@/components/Transactions/TransactionList';
import { useBudget } from '@/context/BudgetContext';
import { Transaction } from '@/types';

export interface FilterOptions {
  searchTerm: string;
  dateRange: 'all' | 'today' | 'week' | 'month' | 'year';
  type: 'all' | 'income' | 'expense';
}

export default function TransactionsPage() {
  const { transactions } = useBudget(); 
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: '',
    dateRange: 'all',
    type: 'all',
  });

  const filterTransactions = (transactions: Transaction[]): Transaction[] => {
    return transactions.filter(transaction => {
      // Arama filtresi
      const matchesSearch = transaction.description
        .toLowerCase()
        .includes(filters.searchTerm.toLowerCase());

      // Tip filtresi
      const matchesType = filters.type === 'all' || transaction.type === filters.type;

      // Tarih filtresi
      const transactionDate = new Date(transaction.date);
      const today = new Date();
      let matchesDate = true;

      switch (filters.dateRange) {
        case 'today':
          matchesDate = transactionDate.toDateString() === today.toDateString();
          break;
        case 'week':
          const weekAgo = new Date();
          weekAgo.setDate(today.getDate() - 7);
          matchesDate = transactionDate >= weekAgo;
          break;
        case 'month':
          matchesDate = 
            transactionDate.getMonth() === today.getMonth() &&
            transactionDate.getFullYear() === today.getFullYear();
          break;
        case 'year':
          matchesDate = transactionDate.getFullYear() === today.getFullYear();
          break;
        default:
          matchesDate = true;
      }

      return matchesSearch && matchesType && matchesDate;
    });
  };

  const filteredTransactions = filterTransactions(transactions);

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            İşlemler
          </h1>
          <button
            onClick={() => setIsAddingTransaction(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <BsPlus className="w-5 h-5" />
            Yeni İşlem
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <TransactionFilters
              filters={filters}
              onFilterChange={(filters: FilterOptions) => setFilters(filters)}
            />
          </div>

          <div className="lg:col-span-3">
            <TransactionList transactions={filteredTransactions} />
          </div>
        </div>

        {/* Modal */}
        {isAddingTransaction && (
          <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setIsAddingTransaction(false);
              }
            }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  Yeni İşlem Ekle
                </h2>
                <button
                  onClick={() => setIsAddingTransaction(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>
              <QuickAddTransaction onSuccess={() => setIsAddingTransaction(false)} />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}