"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    BsGrid,
    BsGraphUp,
    BsArrowLeftRight,
    BsPiggyBank,
    BsCurrencyDollar,
    BsBarChart
} from 'react-icons/bs';

const menuItems = [
    {
        path: '/',
        icon: BsGrid,
        label: 'Özet'
    },
    {
        path: '/transactions',
        icon: BsArrowLeftRight,
        label: 'İşlemler'
    },
    {
        path: '/analysis',
        icon: BsGraphUp,
        label: 'Analiz'
    },
    {
        path: '/budget-limits',
        icon: BsCurrencyDollar,
        label: 'Bütçe Limitleri'
    },
    {
        label: 'Tasarruf',
        path: '/savings',
        icon: BsPiggyBank,
    },
    {
        label: 'Raporlar', // Yeni eklenen
        path: '/reports',
        icon: BsBarChart
    },

];

export default function Sidebar({ isMobileMenuOpen }: { isMobileMenuOpen: boolean }) {
    const pathname = usePathname();

    return (
        <aside className="fixed lg:flex flex-col w-64 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
            <nav className="mt-16 flex-1 px-4 py-6">
                <ul className="space-y-1">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <li key={item.path}>
                                <Link
                                    href={item.path}
                                    className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive
                                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                        }`}
                                >
                                    <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-blue-600 dark:text-blue-400' : ''
                                        }`} />
                                    {item.label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </aside>
    );
} 