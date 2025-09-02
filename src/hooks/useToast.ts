import { toast, Id } from 'react-toastify';
import { useRef } from 'react';

interface ToastQueue {
  [key: string]: {
    id: Id;
    timestamp: number;
  };
}

export const useToast = () => {
  const toastQueue = useRef<ToastQueue>({});
  const DUPLICATE_TIMEOUT = 3000; // 3 seconds

  const showToast = (type: 'success' | 'error' | 'info' | 'warning', message: string, options?: any) => {
    const key = `${type}-${message}`;
    const now = Date.now();
    
    // Check if this exact toast was shown recently
    if (toastQueue.current[key]) {
      const { timestamp } = toastQueue.current[key];
      if (now - timestamp < DUPLICATE_TIMEOUT) {
        return; // Skip duplicate toast
      }
    }

    // Show the toast
    const id = toast[type](message, {
      ...options,
      onClose: () => {
        // Clean up after toast is closed
        delete toastQueue.current[key];
      }
    });

    // Store the toast reference
    toastQueue.current[key] = { id, timestamp: now };
  };

  return {
    success: (message: string, options?: any) => showToast('success', message, options),
    error: (message: string, options?: any) => showToast('error', message, options),
    info: (message: string, options?: any) => showToast('info', message, options),
    warning: (message: string, options?: any) => showToast('warning', message, options),
  };
};