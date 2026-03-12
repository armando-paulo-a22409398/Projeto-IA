import React from 'react';
import styles from './BottomNav.module.css';

const TABS = [
  { id: 'inventory', icon: '🏠', label: 'Despensa' },
  { id: 'scanner',   icon: '📷', label: 'Scanner'  },
  { id: 'recipes',   icon: '🍳', label: 'Receitas'  },
  { id: 'shopping',  icon: '🛒', label: 'Compras'   },
];

export default function BottomNav({ active, onChange, urgentCount }) {
  return (
    <nav className={styles.nav}>
      {TABS.map(t => (
        <button
          key={t.id}
          className={`${styles.item} ${active === t.id ? styles.active : ''}`}
          onClick={() => onChange(t.id)}
          aria-label={t.label}
        >
          <span className={styles.icon}>
            {t.icon}
            {t.id === 'inventory' && urgentCount > 0 && (
              <span className={styles.badge}>{urgentCount}</span>
            )}
          </span>
          <span className={styles.label}>{t.label}</span>
        </button>
      ))}
    </nav>
  );
}
