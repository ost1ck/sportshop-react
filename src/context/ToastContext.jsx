// src/context/ToastContext.jsx
import { createContext, useContext, useState } from 'react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({ message: '', type: '', show: false });

  const showToast = (message, type) => {
    setToast({ message, type, show: true });
    setTimeout(() => setToast({ ...toast, show: false }), 3000); // 3 секунди
  };

  const closeToast = () => {
    setToast({ ...toast, show: false });
  };

  return (
    <ToastContext.Provider value={{ toast, showToast, closeToast }}>
      {children}
      {toast.show && (
        <div className={`toast ${toast.type === 'success' ? 'toast-success' : 'toast-error'}`}>
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);