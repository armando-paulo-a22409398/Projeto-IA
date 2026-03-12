import { useState, useCallback } from 'react';
import { MOCK_SHOPPING } from '../data/mockData';
import { generateId } from '../utils/helpers';

export function useShoppingList() {
  const [items, setItems] = useState(MOCK_SHOPPING);

  const addItem = useCallback((name, quantity = 1) => {
    setItems(prev => [
      ...prev,
      { id: generateId(), product_name: name, quantity, purchased: false, auto: false },
    ]);
  }, []);

  const toggleItem = useCallback((id) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, purchased: !i.purchased } : i));
  }, []);

  const removeItem = useCallback((id) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const clearPurchased = useCallback(() => {
    setItems(prev => prev.filter(i => !i.purchased));
  }, []);

  const updateQuantity = useCallback((id, qty) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.max(1, qty) } : i));
  }, []);

  return { items, addItem, toggleItem, removeItem, clearPurchased, updateQuantity };
}
