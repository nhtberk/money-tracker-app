'use client';

import { BsSearch, BsFilter } from 'react-icons/bs';
import { FilterOptions } from '@/app/transactions/page';

interface TransactionFiltersProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

export default function TransactionFilters({ filters, onFilterChange }: TransactionFiltersProps) {
  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 space-y-4 sticky top-20">
      <h2 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
        <BsFilter className="w-5 h-5" />
        Filtreler
      </h2>

      {/* Arama */}
      <div className="relative">
        <input
          type="text"
          value={filters.searchTerm}
          onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
          placeholder="İşlem ara..."
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 
            text-gray-800 dark:text-gray-200 placeholder-gray-500"
        />
        <BsSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
      </div>

      {/* Tarih Aralığı */}
      <div className="space-y-2">
        <label className="text-sm text-gray-600 dark:text-gray-400">
          Tarih Aralığı
        </label>
        <select
          value={filters.dateRange}
          onChange={(e) => handleFilterChange('dateRange', e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 
            text-gray-800 dark:text-gray-200"
        >
          <option value="all">Tümü</option>
          <option value="today">Bugün</option>
          <option value="week">Bu Hafta</option>
          <option value="month">Bu Ay</option>
          <option value="year">Bu Yıl</option>
        </select>
      </div>

      {/* İşlem Tipi */}
      <div className="space-y-2">
        <label className="text-sm text-gray-600 dark:text-gray-400">
          İşlem Tipi
        </label>
        <select
          value={filters.type}
          onChange={(e) => handleFilterChange('type', e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 
            text-gray-800 dark:text-gray-200"
        >
          <option value="all">Tümü</option>
          <option value="income">Gelir</option>
          <option value="expense">Gider</option>
        </select>
      </div>
    </div>
  );
} 