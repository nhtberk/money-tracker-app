'use client';

import { useState, useEffect } from 'react';
import { BsExclamationTriangle, BsCheckCircle, BsExclamationCircle, BsX } from 'react-icons/bs';

interface NotificationProps {
  message: string;
  type: 'warning' | 'success' | 'error';
  onClose: () => void;
}

export function Notification({ message, type, onClose }: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    warning: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-400 dark:border-yellow-700',
      text: 'text-yellow-800 dark:text-yellow-200',
      icon: BsExclamationTriangle,
    },
    success: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-400 dark:border-green-700',
      text: 'text-green-800 dark:text-green-200',
      icon: BsCheckCircle,
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-400 dark:border-red-700',
      text: 'text-red-800 dark:text-red-200',
      icon: BsExclamationCircle,
    },
  };

  const currentStyle = styles[type];
  const Icon = currentStyle.icon;

  if (!isVisible) return null;

  return (
    <div 
      className={`
        flex items-center w-96 max-w-[calc(100vw-2rem)]
        ${currentStyle.bg} 
        ${currentStyle.text}
        border ${currentStyle.border}
        rounded-lg shadow-lg 
        transform transition-all duration-300 ease-in-out
        hover:scale-102
        dark:shadow-none
      `}
      role="alert"
    >
      <div className="flex-1 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon className="h-5 w-5" />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium">
              {message}
            </p>
          </div>
          <button
            onClick={() => {
              setIsVisible(false);
              onClose();
            }}
            className={`
              ml-4 flex-shrink-0
              rounded-lg p-1.5
              ${currentStyle.text}
              hover:bg-opacity-20 hover:bg-black
              focus:outline-none focus:ring-2 focus:ring-offset-2
              transition-colors duration-200
            `}
          >
            <BsX className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
} 