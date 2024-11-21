export interface SavingTip {
  id: string;
  message: string;
  type: 'warning' | 'suggestion' | 'achievement';
  category?: string;
  impact: 'high' | 'medium' | 'low';
  saved?: number;
}

export interface CategoryAnalysis {
  categoryId: string;
  name: string;
  currentSpending: number;
  previousSpending: number;
  trend: number;
  frequency: number;
  averageTransaction: number;
}

export interface SavingsAnalysis {
  tips: SavingTip[];
  potentialSavings: number;
  categoryAnalysis: CategoryAnalysis[];
  monthlyComparison: {
    current: number;
    previous: number;
    difference: number;
    percentageChange: number;
  };
} 