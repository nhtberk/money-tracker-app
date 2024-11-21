import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Transaction } from '@/types';
import { formatCurrencyForPDF, formatDate } from '@/utils/format';
import { getCategoryById } from '@/utils/categories';

// PDF için Türkçe karakter desteği
const addTurkishSupport = (doc: jsPDF) => {
  doc.setLanguage("tr");
  // Times-Roman yerine Helvetica kullanalım (daha iyi Türkçe karakter desteği için)
  doc.setFont("helvetica");
};

export const generateTransactionsPDF = (
  transactions: Transaction[],
  dateRange: string,
  totalIncome: number,
  totalExpense: number
) => {
  const doc = new jsPDF('p', 'mm', 'a4');
  addTurkishSupport(doc);
  
  // Başlık
  doc.setFontSize(20);
  doc.text('Finansal Rapor', 20, 20);
  
  // Tarih aralığı
  doc.setFontSize(12);
  doc.text(`Rapor Tarihi: ${formatDate(new Date().toISOString())}`, 20, 30);
  doc.text(`Donem: ${dateRange}`, 20, 38);
  
  // Özet bilgiler
  doc.setFontSize(14);
  doc.text('Ozet', 20, 50);
  doc.setFontSize(12);
  doc.text(`Toplam Gelir: ${formatCurrencyForPDF(totalIncome)}`, 20, 60);
  doc.text(`Toplam Gider: ${formatCurrencyForPDF(totalExpense)}`, 20, 68);
  doc.text(`Net Durum: ${formatCurrencyForPDF(totalIncome - totalExpense)}`, 20, 76);
  
  // İşlem tablosu
  const tableData = transactions.map(transaction => [
    formatDate(transaction.date),
    getCategoryById(transaction.categoryId)?.name || '',
    transaction.description || '-',
    transaction.type === 'income' ? formatCurrencyForPDF(transaction.amount) : '',
    transaction.type === 'expense' ? formatCurrencyForPDF(transaction.amount) : '',
  ]);

  autoTable(doc, {
    head: [['Tarih', 'Kategori', 'Aciklama', 'Gelir', 'Gider']],
    body: tableData,
    startY: 90,
    theme: 'grid',
    styles: { 
      font: 'helvetica',
      fontSize: 10,
      cellPadding: 5
    },
    headStyles: { 
      fillColor: [66, 139, 202],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    },
    // Türkçe karakter dönüşümü
    didParseCell: function(data) {
      if (data.cell.text) {
        data.cell.text = data.cell.text.map((text: string) => 
          text.replace(/ğ/g, 'g')
             .replace(/Ğ/g, 'G')
             .replace(/ü/g, 'u')
             .replace(/Ü/g, 'U')
             .replace(/ş/g, 's')
             .replace(/Ş/g, 'S')
             .replace(/ı/g, 'i')
             .replace(/İ/g, 'I')
             .replace(/ö/g, 'o')
             .replace(/Ö/g, 'O')
             .replace(/ç/g, 'c')
             .replace(/Ç/g, 'C')
        );
      }
    }
  });

  doc.save(`finansal-rapor-${formatDate(new Date().toISOString())}.pdf`);
};

export const generateCategoryReportPDF = (
  transactions: Transaction[],
  dateRange: string
) => {
  const doc = new jsPDF('p', 'mm', 'a4');
  addTurkishSupport(doc);
  
  doc.setFontSize(20);
  doc.text('Kategori Bazli Rapor', 20, 20);
  
  doc.setFontSize(12);
  doc.text(`Rapor Tarihi: ${formatDate(new Date().toISOString())}`, 20, 30);
  doc.text(`Donem: ${dateRange}`, 20, 38);

  const categoryTotals = transactions.reduce((acc, transaction) => {
    const category = getCategoryById(transaction.categoryId);
    if (!category) return acc;

    if (!acc[category.id]) {
      acc[category.id] = {
        name: category.name,
        income: 0,
        expense: 0,
        transactions: 0
      };
    }

    if (transaction.type === 'income') {
      acc[category.id].income += transaction.amount;
    } else {
      acc[category.id].expense += transaction.amount;
    }
    acc[category.id].transactions += 1;

    return acc;
  }, {} as Record<string, { 
    name: string; 
    income: number; 
    expense: number; 
    transactions: number 
  }>);

  const tableData = Object.values(categoryTotals)
    .sort((a, b) => (b.income + b.expense) - (a.income + a.expense))
    .map(cat => [
      cat.name,
      formatCurrencyForPDF(cat.income),
      formatCurrencyForPDF(cat.expense),
      formatCurrencyForPDF(cat.income - cat.expense),
      cat.transactions.toString(),
      `${((cat.income - cat.expense) >= 0 ? '+' : '')}${((cat.income - cat.expense) / (cat.income + cat.expense) * 100).toFixed(1)}%`
    ]);

  const totals = Object.values(categoryTotals).reduce(
    (acc, cat) => ({
      income: acc.income + cat.income,
      expense: acc.expense + cat.expense,
      transactions: acc.transactions + cat.transactions
    }),
    { income: 0, expense: 0, transactions: 0 }
  );

  tableData.push([
    'TOPLAM',
    formatCurrencyForPDF(totals.income),
    formatCurrencyForPDF(totals.expense),
    formatCurrencyForPDF(totals.income - totals.expense),
    totals.transactions.toString(),
    `${((totals.income - totals.expense) >= 0 ? '+' : '')}${((totals.income - totals.expense) / (totals.income + totals.expense) * 100).toFixed(1)}%`
  ]);

  autoTable(doc, {
    head: [['Kategori', 'Gelir', 'Gider', 'Net', 'Islem Sayisi', 'Oran']],
    body: tableData,
    startY: 50,
    theme: 'grid',
    styles: { 
      font: 'helvetica',
      fontSize: 10,
      cellPadding: 5
    },
    headStyles: { 
      fillColor: [66, 139, 202],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    footStyles: {
      fontStyle: 'bold',
      fillColor: [240, 240, 240]
    },
    alternateRowStyles: {
      fillColor: [249, 249, 249]
    },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { halign: 'right' },
      2: { halign: 'right' },
      3: { halign: 'right' },
      4: { halign: 'center' },
      5: { halign: 'right' }
    },
    // Türkçe karakter dönüşümü
    didParseCell: function(data) {
      if (data.cell.text) {
        data.cell.text = data.cell.text.map((text: string) => 
          text.replace(/ğ/g, 'g')
             .replace(/Ğ/g, 'G')
             .replace(/ü/g, 'u')
             .replace(/Ü/g, 'U')
             .replace(/ş/g, 's')
             .replace(/Ş/g, 'S')
             .replace(/ı/g, 'i')
             .replace(/İ/g, 'I')
             .replace(/ö/g, 'o')
             .replace(/Ö/g, 'O')
             .replace(/ç/g, 'c')
             .replace(/Ç/g, 'C')
        );
      }
    }
  });

  doc.setFontSize(10);
  doc.text('* Oranlar, kategorinin toplam islem hacmine gore net durumunu gosterir.', 20, doc.internal.pageSize.height - 20);

  doc.save(`kategori-raporu-${formatDate(new Date().toISOString())}.pdf`);
}; 