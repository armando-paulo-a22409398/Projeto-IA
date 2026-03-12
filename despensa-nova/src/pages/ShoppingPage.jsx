import React, { useState } from 'react';
import styles from './ShoppingPage.module.css';

export default function ShoppingPage({ items, onToggle, onRemove, onAdd, onClearPurchased, onUpdateQuantity }) {
  const [newItem, setNewItem] = useState('');
  const [newQty, setNewQty]   = useState(1);
  const [showInput, setShowInput] = useState(false);

  const pending   = items.filter(i => !i.purchased);
  const purchased = items.filter(i => i.purchased);

  const handleAdd = () => {
    if (!newItem.trim()) return;
    onAdd(newItem.trim(), Number(newQty) || 1);
    setNewItem('');
    setNewQty(1);
    setShowInput(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <div className={styles.logo}>despensa<span>.</span>em<span>dia</span></div>
          <div className={styles.subtitle}>{pending.length} item{pending.length !== 1 ? 's' : ''} por comprar</div>
        </div>
        <button className={styles.addFab} onClick={() => setShowInput(v => !v)} aria-label="Adicionar item">
          {showInput ? '✕' : '+'}
        </button>
      </div>

      <div className={styles.content}>
        {/* Add item panel */}
        {showInput && (
          <div className={styles.addPanel}>
            <div className={styles.addRow}>
              <input
                className={styles.addInput}
                placeholder="Nome do produto..."
                value={newItem}
                autoFocus
                onChange={e => setNewItem(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
              />
              <input
                className={`${styles.addInput} ${styles.qtyInput}`}
                type="number"
                min="1"
                value={newQty}
                onChange={e => setNewQty(e.target.value)}
              />
              <button className={styles.addConfirmBtn} onClick={handleAdd}>Adicionar</button>
            </div>
          </div>
        )}

        {/* Auto-generated banner */}
        {items.some(i => i.auto) && (
          <div className={styles.autoBanner}>
            <span>🤖</span>
            <span>Alguns itens foram adicionados automaticamente com base no inventário</span>
          </div>
        )}

        {/* Pending items */}
        {pending.length === 0 && !showInput && (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🛒</div>
            <div className={styles.emptyText}>Lista de compras vazia!</div>
            <div className={styles.emptySub}>Adiciona itens com o botão +</div>
          </div>
        )}

        {pending.map((item, idx) => (
          <ShoppingItem
            key={item.id}
            item={item}
            index={idx}
            onToggle={() => onToggle(item.id)}
            onRemove={() => onRemove(item.id)}
            onQtyChange={(q) => onUpdateQuantity(item.id, q)}
          />
        ))}

        {/* Purchased section */}
        {purchased.length > 0 && (
          <>
            <div className={styles.sectionDivider}>
              <span>Já comprado ({purchased.length})</span>
              <button className={styles.clearBtn} onClick={onClearPurchased}>Limpar</button>
            </div>
            {purchased.map((item, idx) => (
              <ShoppingItem
                key={item.id}
                item={item}
                index={idx}
                onToggle={() => onToggle(item.id)}
                onRemove={() => onRemove(item.id)}
                onQtyChange={(q) => onUpdateQuantity(item.id, q)}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

function ShoppingItem({ item, index, onToggle, onRemove, onQtyChange }) {
  return (
    <div
      className={`${styles.item} ${item.purchased ? styles.itemDone : ''}`}
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <button
        className={`${styles.checkbox} ${item.purchased ? styles.checked : ''}`}
        onClick={onToggle}
        aria-label={item.purchased ? 'Desmarcar' : 'Marcar como comprado'}
      >
        {item.purchased && '✓'}
      </button>

      <span className={styles.itemName}>{item.product_name}</span>

      {item.auto && !item.purchased && (
        <span className={styles.autoBadge}>auto</span>
      )}

      <div className={styles.itemRight}>
        <div className={styles.qtyControl}>
          <button className={styles.qtyBtn} onClick={() => onQtyChange(item.quantity - 1)}>−</button>
          <span className={styles.qtyNum}>×{item.quantity}</span>
          <button className={styles.qtyBtn} onClick={() => onQtyChange(item.quantity + 1)}>+</button>
        </div>
        <button className={styles.removeBtn} onClick={onRemove} aria-label="Remover">×</button>
      </div>
    </div>
  );
}
