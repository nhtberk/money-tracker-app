'use client';

import DashboardLayout from '@/components/Layout/DashboardLayout';
import { FinancialReports } from '@/components/Reports/FinancialReports';

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Raporlar
        </h1>
        <FinancialReports />
      </div>
    </DashboardLayout>
  );
} 