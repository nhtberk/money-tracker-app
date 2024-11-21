'use client';

import { useState } from 'react';
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header 
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen} 
      />
      <div className="flex">
        {/* Mobil menü overlay */}
        {isMobileMenuOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-gray-800/50 z-[5]"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`
          fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-gray-800 shadow-lg z-[8]
          transform transition-transform duration-200 ease-in-out lg:translate-x-0
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <Sidebar isMobileMenuOpen={isMobileMenuOpen} />
        </div>

        <main className="flex-1 ml-0 lg:ml-64 min-h-screen pt-16">
          <div className="mx-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 