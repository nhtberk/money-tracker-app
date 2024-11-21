import DashboardLayout from '@/components/Layout/DashboardLayout';
import { BudgetLimits } from '@/components/Budget/BudgetLimits';

export default function BudgetLimitsPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Bütçe Limitleri
        </h1>
        <BudgetLimits />
      </div>
    </DashboardLayout>
  );
} 