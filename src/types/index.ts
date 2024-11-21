export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  description: string;
  date: string;
}

export interface BudgetLimit {
  categoryId: string;
  amount: number;
  period: 'monthly' | 'yearly';
}

export interface BudgetAlert {
  categoryId: string;
  currentAmount: number;
  limitAmount: number;
  percentage: number;
}

export interface BudgetContextType {
  transactions: Transaction[];
  budgetLimits: BudgetLimit[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  setBudgetLimit: (limit: BudgetLimit) => void;
  updateBudgetLimit: (limit: BudgetLimit) => void;
  deleteBudgetLimit: (categoryId: string) => void;
  deleteTransaction: (transactionId: string) => void;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon?: string;
} 