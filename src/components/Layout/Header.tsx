"use client";

import { useTheme } from '@/context/ThemeContext';
import { BsSun, BsMoon, BsX, BsList } from 'react-icons/bs';

interface HeaderProps {
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: (value: boolean) => void;
  }

export default function Header({ isMobileMenuOpen, setIsMobileMenuOpen }: HeaderProps) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 fixed w-full z-10">
      <div className="mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-2">
          <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {isMobileMenuOpen ? (
                <BsX className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              ) : (
                <BsList className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              )}
            </button>
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
              <span className="text-white font-bold">₺</span>
            </div>
            <span className="font-semibold text-gray-800 dark:text-white">
              BütçeM
            </span>
          </div>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            aria-label="Tema değiştir"
          >
            {isDark ? (
              <BsSun className="w-5 h-5" />
            ) : (
              <BsMoon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
} 