'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { BudgetContextType, Transaction, BudgetLimit } from '../types';
import { loadFromLocalStorage, saveToLocalStorage, autoBackup } from '../utils/localStorage';

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export function BudgetProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgetLimits, setBudgetLimits] = useState<BudgetLimit[]>([]);

  // İlk yükleme
  useEffect(() => {
    const data = loadFromLocalStorage();
    setTransactions(data.transactions);
    setBudgetLimits(data.budgetLimits);
  }, []);

  // İşlem ekleme
  const addTransaction = (newTransaction: Omit<Transaction, 'id'>) => {
    const transaction = {
        id: Date.now().toString(),
        ...newTransaction
    };

    setTransactions(prev => {
      const updatedTransactions = [transaction, ...prev];
      saveToLocalStorage({ 
        transactions: updatedTransactions, 
        budgetLimits 
      });
      return updatedTransactions;
    });
  };

  // Bütçe limiti belirleme
  const setBudgetLimit = (limit: BudgetLimit) => {
    setBudgetLimits(prev => {
      const updatedLimits = [...prev.filter(l => l.categoryId !== limit.categoryId), limit];
      saveToLocalStorage({ 
        transactions, 
        budgetLimits: updatedLimits 
      });
      return updatedLimits;
    });
  };

  // Limit silme
  const deleteBudgetLimit = (categoryId: string) => {
    setBudgetLimits(prev => {
      const updatedLimits = prev.filter(l => l.categoryId !== categoryId);
      saveToLocalStorage({ 
        transactions, 
        budgetLimits: updatedLimits 
      });
      return updatedLimits;
    });
  };

  // Limit güncelleme
  const updateBudgetLimit = (limit: BudgetLimit) => {
    setBudgetLimits(prev => {
      const updatedLimits = prev.map(l => l.categoryId === limit.categoryId ? limit : l);
      saveToLocalStorage({ 
        transactions, 
        budgetLimits: updatedLimits 
      });
      return updatedLimits;
    });
  };

  // İşlem silme
  const deleteTransaction = (transactionId: string) => {
    setTransactions(prev => {
      const updatedTransactions = prev.filter(t => t.id !== transactionId);
      saveToLocalStorage({ 
        transactions: updatedTransactions, 
        budgetLimits 
      });
      return updatedTransactions;
    });
  };

  return (
    <BudgetContext.Provider value={{
      transactions,
      budgetLimits,
      addTransaction,
      setBudgetLimit,
      deleteBudgetLimit,
      updateBudgetLimit,
      deleteTransaction,
    }}>
      {children}
    </BudgetContext.Provider>
  );
}

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (!context) throw new Error('useBudget must be used within BudgetProvider');
  return context;
}; 