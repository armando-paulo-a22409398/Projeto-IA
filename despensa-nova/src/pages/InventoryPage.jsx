import React, { useState, useMemo } from 'react';
import ProductCard from '../components/ProductCard';
import StatCard from '../components/StatCard';
import { getInventoryStats, sortByUrgency, getExpiryStatus } from '../utils/helpers';
import styles from './InventoryPage.module.css';

const ALL = 'Todos';

export default function InventoryPage({ inventory, onQuantityChange }) {
  const [filter, setFilter] = useState(ALL);
  const [search, setSearch]  = useState('');
  const [sortMode, setSortMode] = useState('urgency'); // urgency | name | category

  const stats = getInventoryStats(inventory);
  const categories = useMemo(() => [ALL, ...new Set(inventory.map(i => i.category))], [inventory]);

  const filtered = useMemo(() => {
    let list = [...inventory];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(i => i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q));
    }

    // Category filter
    if (filter !== ALL) list = list.filter(i => i.category === filter);

    // Sort
    if (sortMode === 'urgency') list = sortByUrgency(list);
    else if (sortMode === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortMode === 'category') list.sort((a, b) => a.category.localeCompare(b.category));

    return list;
  }, [inventory, filter, search, sortMode]);

  const urgentItems = inventory.filter(i =>
    ['critical', 'expired'].includes(getExpiryStatus(i.expiration_date))
  );

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <div className={styles.logo}>despensa<span>.</span>em<span>dia</span></div>
          <div className={styles.subtitle}>Inventário actualizado</div>
        </div>
        <button className={styles.notifBtn} aria-label="Notificações">
          🔔
          {urgentItems.length > 0 && <span className={styles.notifDot} />}
        </button>
      </div>

      <div className={styles.content}>
        {/* Stats */}
        <div className={styles.statsRow}>
          <StatCard num={stats.total}    label="Produtos"  variant="neutral" />
          <StatCard num={stats.warning}  label="A Expirar" variant="warn" />
          <StatCard num={stats.critical} label="Urgente"   variant="danger" />
        </div>

        {/* Alert banner */}
        {urgentItems.length > 0 && (
          <div className={styles.alertBanner}>
            <span className={styles.alertIcon}>⚠️</span>
            <div className={styles.alertText}>
              <strong>{urgentItems.length} produto{urgentItems.length > 1 ? 's' : ''}</strong> a expirar em menos de 48h.
              Consome-os primeiro!
            </div>
          </div>
        )}

        {/* Search */}
        <div className={styles.searchBar}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            className={styles.searchInput}
            placeholder="Pesquisar produto..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className={styles.clearBtn} onClick={() => setSearch('')}>✕</button>
          )}
        </div>

        {/* Filters */}
        <div className={styles.filterRow}>
          {categories.map(c => (
            <button
              key={c}
              className={`${styles.chip} ${filter === c ? styles.chipActive : ''}`}
              onClick={() => setFilter(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className={styles.sortRow}>
          <span className={styles.sortLabel}>Ordenar:</span>
          {['urgency', 'name', 'category'].map(s => (
            <button
              key={s}
              className={`${styles.sortBtn} ${sortMode === s ? styles.sortActive : ''}`}
              onClick={() => setSortMode(s)}
            >
              {{ urgency: 'Urgência', name: 'Nome', category: 'Categoria' }[s]}
            </button>
          ))}
        </div>

        {/* Cards */}
        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>📦</div>
            <div className={styles.emptyText}>Nenhum produto encontrado</div>
          </div>
        ) : (
          <div className={styles.cards}>
            {filtered.map((item, idx) => (
              <ProductCard
                key={item.id}
                item={item}
                index={idx}
                onQuantityChange={onQuantityChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
