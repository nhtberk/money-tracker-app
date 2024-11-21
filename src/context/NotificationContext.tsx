'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { BsCheckCircleFill, BsXCircleFill, BsExclamationTriangleFill, BsInfoCircleFill } from 'react-icons/bs';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface Notification {
    id: string;
    message: string;
    type: NotificationType;
}

interface NotificationContextType {
    showNotification: (message: string, type: NotificationType) => void;
    notifications: Notification[];
    removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const showNotification = useCallback((message: string, type: NotificationType) => {
        const id = Date.now().toString();
        setNotifications(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setNotifications(prev => prev.filter(notification => notification.id !== id));
        }, 3000);
    }, []);

    const removeNotification = useCallback((id: string) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
    }, []);

    return (
        <NotificationContext.Provider value={{ notifications, showNotification, removeNotification }}>
            {children}
            <div className='fixed bottom-10 right-10 z-50 flex flex-col gap-2'>
                {notifications.map(notification => (

                    <div
                        key={notification.id}
                        className={`p-4 rounded-lg shadow-lg text-white ${notification.type === 'success' ? 'bg-green-500' : notification.type === 'error' ? 'bg-red-500' : notification.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                            } transition-all duration-300 ease-in-out`}
                    >
                        <div className="flex items-center gap-3">
                        {notification.type === 'success' && (
                            <BsCheckCircleFill className="w-5 h-5" />
                        )}
                        {notification.type === 'error' && (
                            <BsXCircleFill className="w-5 h-5" />
                        )}
                        {notification.type === 'warning' && (
                            <BsExclamationTriangleFill className="w-5 h-5" />
                        )}
                        {notification.type === 'info' && (
                            <BsInfoCircleFill className="w-5 h-5" />
                        )}
                        <span>{notification.message}</span>
                        </div>
                    </div>
                ))}
            </div>
        </NotificationContext.Provider>
    );
}

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
}; 