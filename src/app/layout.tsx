import { ThemeProvider } from '@/context/ThemeContext';
import { BudgetProvider } from '@/context/BudgetContext';
import { NotificationProvider } from '@/context/NotificationContext';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BütçeM',
  description: 'Kişisel bütçe takip uygulaması',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
          <ThemeProvider>
        <NotificationProvider>
            <BudgetProvider>
              {children}
            </BudgetProvider>
        </NotificationProvider>
          </ThemeProvider>
      </body>
    </html>
  );
}
