import React, { useState } from 'react';
import { getExpiryStatus, getExpiryLabel, getDaysUntilExpiry } from '../utils/helpers';
import styles from './ProductCard.module.css';

export default function ProductCard({ item, onQuantityChange, onConsume, onDelete, index = 0 }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const status = getExpiryStatus(item.expiration_date);
  const label  = getExpiryLabel(item.expiration_date);
  const days   = getDaysUntilExpiry(item.expiration_date);

  const handleConsume = () => {
    onConsume?.(item.id);
    onQuantityChange(item.id, -1);
  };

  return (
    <div
      className={`${styles.card} ${styles[status]}`}
      style={{ animationDelay: `${index * 35}ms` }}
    >
      <div className={styles.statusBar} />

      <div className={styles.emoji}>{item.emoji}</div>

      <div className={styles.info}>
        <div className={styles.name}>{item.name}</div>
        <div className={styles.category}>{item.category}</div>
        <div className={`${styles.expiry} ${styles['expiry_' + status]}`}>
          <span className={styles.expiryDot} />
          {label}
        </div>
      </div>

      <div className={styles.controls}>
        <div className={styles.qtyRow}>
          <button
            className={styles.qtyBtn}
            onClick={() => onQuantityChange(item.id, -1)}
            aria-label="Diminuir quantidade"
          >−</button>
          <span className={styles.qty}>{item.quantity}</span>
          <button
            className={styles.qtyBtn}
            onClick={() => onQuantityChange(item.id, 1)}
            aria-label="Aumentar quantidade"
          >+</button>
        </div>
        <button className={styles.consumeBtn} onClick={handleConsume}>
          ✓ Consumido
        </button>
      </div>

      {/* Expiry progress bar */}
      {days >= 0 && days <= 7 && (
        <div className={styles.progressBar}>
          <div
            className={`${styles.progressFill} ${styles['progress_' + status]}`}
            style={{ width: `${Math.max(5, (days / 7) * 100)}%` }}
          />
        </div>
      )}
    </div>
  );
}
