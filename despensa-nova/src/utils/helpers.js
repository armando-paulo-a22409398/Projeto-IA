// ── EXPIRY HELPERS ──────────────────────────────────────────────────────────
export function getDaysUntilExpiry(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(dateStr);
  expiry.setHours(0, 0, 0, 0);
  return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
}

export function getExpiryStatus(dateStr) {
  const days = getDaysUntilExpiry(dateStr);
  if (days < 0)  return 'expired';
  if (days < 2)  return 'critical';
  if (days <= 5) return 'warning';
  return 'good';
}

export function getExpiryLabel(dateStr) {
  const days = getDaysUntilExpiry(dateStr);
  if (days < 0)  return `Expirado há ${Math.abs(days)} dia${Math.abs(days) > 1 ? 's' : ''}`;
  if (days === 0) return 'Expira hoje!';
  if (days === 1) return 'Expira amanhã';
  return `Expira em ${days} dias`;
}

export function getExpiryColor(status) {
  const map = {
    expired:  'var(--danger)',
    critical: 'var(--danger)',
    warning:  'var(--warn)',
    good:     'var(--good)',
  };
  return map[status] || 'var(--muted)';
}

// ── DATE FORMATTERS ─────────────────────────────────────────────────────────
export function formatRelativeDate(dateStr) {
  const days = getDaysUntilExpiry(dateStr);
  const abs  = Math.abs(days);
  if (days < 0)  return `há ${abs} dia${abs > 1 ? 's' : ''}`;
  if (days === 0) return 'hoje';
  if (days === 1) return 'amanhã';
  if (days < 7)  return `em ${days} dias`;
  const weeks = Math.floor(days / 7);
  return `em ${weeks} semana${weeks > 1 ? 's' : ''}`;
}

// ── RECIPE MATCHING ─────────────────────────────────────────────────────────
export function getRecipeMatch(recipe, inventory) {
  const inventoryNames = inventory.map(i => i.name.toLowerCase());

  const required  = recipe.required_ingredients;
  const available = required.filter(ing =>
    inventoryNames.some(n => n.includes(ing.toLowerCase()) || ing.toLowerCase().includes(n))
  );
  const missing   = required.filter(ing =>
    !inventoryNames.some(n => n.includes(ing.toLowerCase()) || ing.toLowerCase().includes(n))
  );

  const matchPct = required.length > 0
    ? Math.round((available.length / required.length) * 100)
    : 0;

  return { available, missing, matchPct };
}

// ── GENERATE ID ─────────────────────────────────────────────────────────────
export function generateId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}

// ── SORT INVENTORY BY URGENCY ───────────────────────────────────────────────
export function sortByUrgency(items) {
  const order = { expired: 0, critical: 1, warning: 2, good: 3 };
  return [...items].sort((a, b) => {
    const sa = order[getExpiryStatus(a.expiration_date)] ?? 4;
    const sb = order[getExpiryStatus(b.expiration_date)] ?? 4;
    return sa - sb;
  });
}

// ── STATISTICS ──────────────────────────────────────────────────────────────
export function getInventoryStats(items) {
  return {
    total:    items.length,
    good:     items.filter(i => getExpiryStatus(i.expiration_date) === 'good').length,
    warning:  items.filter(i => getExpiryStatus(i.expiration_date) === 'warning').length,
    critical: items.filter(i => ['critical','expired'].includes(getExpiryStatus(i.expiration_date))).length,
    expired:  items.filter(i => getExpiryStatus(i.expiration_date) === 'expired').length,
  };
}