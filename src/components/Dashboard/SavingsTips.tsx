import { useBudget } from "@/context/BudgetContext";
import { generateSavingsTips } from "@/utils/savingsTips";
import { Card } from "../ui/Card";
import { BsLightbulb } from "react-icons/bs";

export function SavingsTips() {
  const { transactions } = useBudget();
  const tips = generateSavingsTips(transactions);

  if (tips.length === 0) return null;

  return (
    <Card className="p-6 bg-white dark:bg-gray-800">
      <h2 className="font-semibold mb-4 text-gray-800 dark:text-white">
        Tasarruf Önerileri
      </h2>
      <div className="space-y-3">
        {tips.map((tip, index) => (
          <div 
            key={index}
            className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20"
          >
            <BsLightbulb className="w-5 h-5 text-blue-500 mt-0.5" />
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {tip}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
} 