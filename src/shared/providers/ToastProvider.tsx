import React, { createContext, useContext, useState, ReactNode } from 'react';
import Toast, { ToastProps } from '@/shared/components/Toast';

interface ToastContextType {
  showToast: (message: string, type: ToastProps['type'], duration?: number) => void;
  clearToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastData extends ToastProps {
  id: string;
}

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = (message: string, type: ToastProps['type'], duration = 4000) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastData = {
      id,
      message,
      type,
      duration,
      onClose: () => removeToast(id),
    };

    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const clearToasts = () => {
    setToasts([]);
  };

  return (
    <ToastContext.Provider value={{ showToast, clearToasts }}>
      {children}
      <div style={{ position: 'fixed', top: 0, right: 0, zIndex: 10000 }}>
        {toasts.map((toast, index) => (
          <div 
            key={toast.id} 
            style={{ 
              marginTop: index * 80, // Stack toasts vertically
              position: 'relative'
            }}
          >
            <Toast {...toast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;