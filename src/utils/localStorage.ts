import { Transaction, BudgetLimit } from '@/types';

// LocalStorage'da kullanılacak anahtar
const STORAGE_KEY = 'budget_tracker_data';

// LocalStorage'da saklanacak veri yapısı
interface StorageData {
  transactions: Transaction[];
  budgetLimits: BudgetLimit[];
  lastUpdated: string;
}

// Varsayılan veri yapısı
const defaultData: StorageData = {
  transactions: [],
  budgetLimits: [],
  lastUpdated: new Date().toISOString()
};

// LocalStorage'a veri kaydetme
export const saveToLocalStorage = (data: Omit<StorageData, 'lastUpdated'>): void => {
  try {
    const storageData: StorageData = {
      ...data,
      lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storageData));
  } catch (error) {
    console.error('Veri kaydedilirken hata oluştu:', error);
    throw new Error('Veriler kaydedilemedi');
  }
};

// LocalStorage'dan veri okuma
export const loadFromLocalStorage = (): StorageData => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return defaultData;

    return JSON.parse(data);
  } catch (error) {
    console.error('Veri okunurken hata oluştu:', error);
    return defaultData;
  }
};

// Belirli bir kategori için işlemleri getirme
export const getTransactionsByCategory = (category: string): Transaction[] => {
  const { transactions } = loadFromLocalStorage();
  return transactions.filter(t => t.categoryId === category);
};

// Belirli bir tarih aralığındaki işlemleri getirme
export const getTransactionsByDateRange = (startDate: Date, endDate: Date): Transaction[] => {
  const { transactions } = loadFromLocalStorage();
  return transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate >= startDate && transactionDate <= endDate;
  });
};

// LocalStorage'ı temizleme
export const clearStorageData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Veriler silinirken hata oluştu:', error);
  }
};

// Veri yedekleme
export const exportData = (): string => {
  const data = loadFromLocalStorage();
  return JSON.stringify(data);
};

// Yedekten geri yükleme
export const importData = (jsonData: string): void => {
  try {
    const parsedData = JSON.parse(jsonData) as StorageData;
    // Veri yapısını doğrula
    if (!isValidStorageData(parsedData)) {
      throw new Error('Geçersiz veri formatı');
    }
    saveToLocalStorage(parsedData);
  } catch (error) {
    console.error('Veri içe aktarılırken hata oluştu:', error);
    throw new Error('Veriler içe aktarılamadı');
  }
};

// Veri yapısı doğrulama
const isValidStorageData = (data: any): data is StorageData => {
  return (
    data &&
    Array.isArray(data.transactions) &&
    Array.isArray(data.budgetLimits) &&
    typeof data.lastUpdated === 'string'
  );
};

// Otomatik yedekleme için yardımcı fonksiyon
export const autoBackup = (): void => {
  const data = loadFromLocalStorage();
  const backup = {
    ...data,
    backupDate: new Date().toISOString()
  };
  
  try {
    localStorage.setItem(`${STORAGE_KEY}_backup`, JSON.stringify(backup));
  } catch (error) {
    console.error('Otomatik yedekleme yapılırken hata oluştu:', error);
  }
};

// Veri sürümü kontrolü için yardımcı fonksiyon
export const checkDataVersion = (): boolean => {
  const currentVersion = '1.0'; // Uygulama veri yapısı versiyonu
  const data = localStorage.getItem(`${STORAGE_KEY}_version`);
  
  if (data !== currentVersion) {
    localStorage.setItem(`${STORAGE_KEY}_version`, currentVersion);
    return false;
  }
  
  return true;
};