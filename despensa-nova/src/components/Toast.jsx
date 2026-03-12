import React from 'react';
import styles from './Toast.module.css';

const ICONS = { success: '✅', error: '❌', info: 'ℹ️', warn: '⚠️' };

export default function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className={`${styles.toast} ${styles[toast.type || 'info']}`}>
      <span className={styles.icon}>{ICONS[toast.type] || ICONS.info}</span>
      <span className={styles.msg}>{toast.message}</span>
    </div>
  );
}
