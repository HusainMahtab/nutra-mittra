"use client";

import { useState, useEffect, createContext, useContext } from 'react';
import { Toast, ToastTitle, ToastDescription } from './toast';

type ToastProps = {
  title: string;
  description: string;
  variant?: 'default' | 'destructive';
};

type ToastContextType = {
  toast: (props: ToastProps) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<(ToastProps & { id: string })[]>([]);

  const toast = (props: ToastProps) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { ...props, id }]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toastItem) => (
          <Toast
            key={toastItem.id}
            variant={toastItem.variant}
            className="animate-in slide-in-from-right-full"
          >
            <div className="grid gap-1">
              <ToastTitle>{toastItem.title}</ToastTitle>
              <ToastDescription>{toastItem.description}</ToastDescription>
            </div>
            <button
              onClick={() => removeToast(toastItem.id)}
              className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"
            >
              ×
            </button>
          </Toast>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    // Fallback for when ToastProvider is not available
    return {
      toast: (props: ToastProps) => {
        const message = `${props.title}: ${props.description}`;
        alert(message);
      }
    };
  }
  return context;
}