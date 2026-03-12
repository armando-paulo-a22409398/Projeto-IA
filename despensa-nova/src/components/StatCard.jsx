import React from 'react';
import styles from './StatCard.module.css';

export default function StatCard({ num, label, variant = 'neutral' }) {
  return (
    <div className={`${styles.card} ${styles[variant]}`}>
      <div className={styles.num}>{num}</div>
      <div className={styles.label}>{label}</div>
    </div>
  );
}
