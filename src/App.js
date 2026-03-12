import React, { useState } from 'react';
import BottomNav from './components/BottomNav';
import Toast from './components/Toast';
import InventoryPage from './pages/InventoryPage';
import ScannerPage from './pages/ScannerPage';
import RecipesPage from './pages/RecipesPage';
import ShoppingPage from './pages/ShoppingPage';
import { useInventory } from './hooks/useInventory';
import { useShoppingList } from './hooks/useShoppingList';
import { useToast } from './hooks/useToast';
import { getInventoryStats } from './utils/helpers';
import './styles/app.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('inventory');

  const { items: inventory, addItem, updateQuantity, removeItem } = useInventory();
  const {
    items: shopping,
    addItem: addShoppingItem,
    toggleItem,
    removeItem: removeShoppingItem,
    clearPurchased,
    updateQuantity: updateShoppingQty,
  } = useShoppingList();
  const { toast, showToast } = useToast();

  const stats = getInventoryStats(inventory);
  const urgentCount = stats.critical + stats.expired;

  return (
    <div className="app-shell">
      {/* Page content */}
      <div className="page-area">
        {activeTab === 'inventory' && (
          <InventoryPage
            inventory={inventory}
            onQuantityChange={updateQuantity}
            onRemove={removeItem}
          />
        )}

        {activeTab === 'scanner' && (
          <ScannerPage
            onAdd={addItem}
            showToast={showToast}
          />
        )}

        {activeTab === 'recipes' && (
          <RecipesPage inventory={inventory} />
        )}

        {activeTab === 'shopping' && (
          <ShoppingPage
            items={shopping}
            onToggle={toggleItem}
            onRemove={removeShoppingItem}
            onAdd={addShoppingItem}
            onClearPurchased={clearPurchased}
            onUpdateQuantity={updateShoppingQty}
          />
        )}
      </div>

      {/* Bottom navigation */}
      <BottomNav
        active={activeTab}
        onChange={setActiveTab}
        urgentCount={urgentCount}
      />

      {/* Toast notifications */}
      <Toast toast={toast} />
    </div>
  );
}
