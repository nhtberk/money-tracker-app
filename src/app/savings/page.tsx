'use client';

import DashboardLayout from '@/components/Layout/DashboardLayout';
import { SavingsTips } from '@/components/Savings/SavingsTips';

export default function SavingsPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Tasarruf Önerileri
        </h1>
        <SavingsTips />
      </div>
    </DashboardLayout>
  );
} 