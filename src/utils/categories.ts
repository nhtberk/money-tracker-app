export const DEFAULT_CATEGORIES = [
    // Gider Kategorileri
    {
        id: 'groceries',
        name: 'Market',
        type: 'expense',
        color: '#FF6384',
        icon: 'shopping-cart'
    },
    {
        id: 'bills',
        name: 'Faturalar',
        type: 'expense',
        color: '#36A2EB',
        icon: 'receipt'
    },
    {
        id: 'transport',
        name: 'Ulaşım',
        type: 'expense',
        color: '#FFCE56',
        icon: 'car'
    },
    {
        id: 'entertainment',
        name: 'Eğlence',
        type: 'expense',
        color: '#4BC0C0',
        icon: 'movie'
    },
    {
        id: 'other_expense',
        name: 'Diğer Giderler',
        type: 'expense',
        color: '#9966FF',
        icon: 'more'
    },
    // Gelir Kategorileri
    {
        id: 'salary',
        name: 'Maaş',
        type: 'income',
        color: '#4CAF50',
        icon: 'wallet'
    },
    {
        id: 'freelance',
        name: 'Serbest Çalışma',
        type: 'income',
        color: '#8BC34A',
        icon: 'briefcase'
    },
    {
        id: 'investment',
        name: 'Yatırım',
        type: 'income',
        color: '#CDDC39',
        icon: 'trending-up'
    },
    {
        id: 'other_income',
        name: 'Diğer Gelirler',
        type: 'income',
        color: '#FFC107',
        icon: 'more'
    }
];
export function getCategoryById(id: string) {
    return DEFAULT_CATEGORIES.find(cat => cat.id === id);
}
export function getCategoriesByType(type: 'income' | 'expense') {
    return DEFAULT_CATEGORIES.filter(cat => cat.type === type);
}