import { useState, useCallback } from 'react';
import { MOCK_INVENTORY } from '../data/mockData';
import { generateId } from '../utils/helpers';

export function useInventory() {
  const [items, setItems] = useState(MOCK_INVENTORY);

  const addItem = useCallback((product) => {
    setItems(prev => [
      ...prev,
      {
        id: generateId(),
        name: product.name,
        barcode: product.barcode || '',
        category: product.category || 'Outros',
        emoji: product.emoji || '📦',
        quantity: Number(product.quantity) || 1,
        expiration_date: product.expiration_date,
        added_at: new Date().toISOString().split('T')[0],
      },
    ]);
  }, []);

  const updateQuantity = useCallback((id, delta) => {
    setItems(prev =>
      prev
        .map(i => i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i)
        .filter(i => i.quantity > 0)
    );
  }, []);

  const removeItem = useCallback((id) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const updateItem = useCallback((id, patch) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, ...patch } : i));
  }, []);

  return { items, addItem, updateQuantity, removeItem, updateItem };
}
