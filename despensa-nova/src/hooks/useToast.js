import { useState, useCallback, useRef } from 'react';

export function useToast() {
  const [toast, setToast] = useState(null);
  const timer = useRef(null);

  const showToast = useCallback((message, type = 'info', duration = 2800) => {
    setToast({ message, type });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), duration);
  }, []);

  return { toast, showToast };
}
