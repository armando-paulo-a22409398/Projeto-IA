import React, { useState, useMemo } from 'react';
import { MOCK_RECIPES } from '../data/mockData';
import { getRecipeMatch } from '../utils/helpers';
import styles from './RecipesPage.module.css';

export default function RecipesPage({ inventory }) {
  const [selected, setSelected] = useState(null);
  const [filterMode, setFilterMode] = useState('all'); // all | canMake

  const recipes = useMemo(() =>
    MOCK_RECIPES.map(r => ({ ...r, ...getRecipeMatch(r, inventory) }))
      .sort((a, b) => b.matchPct - a.matchPct),
    [inventory]
  );

  const filtered = filterMode === 'canMake'
    ? recipes.filter(r => r.matchPct === 100)
    : recipes;

  if (selected) {
    return <RecipeDetail recipe={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.logo}>despensa<span>.</span>em<span>dia</span></div>
      </div>

      <div className={styles.content}>
        <div className={styles.pageTitle}>Sugestões de refeições</div>
        <div className={styles.pageSub}>Com base nos teus ingredientes disponíveis</div>

        <div className={styles.filterRow}>
          <button
            className={`${styles.filterBtn} ${filterMode === 'all' ? styles.filterActive : ''}`}
            onClick={() => setFilterMode('all')}
          >Todas ({recipes.length})</button>
          <button
            className={`${styles.filterBtn} ${filterMode === 'canMake' ? styles.filterActive : ''}`}
            onClick={() => setFilterMode('canMake')}
          >Posso fazer ({recipes.filter(r => r.matchPct === 100).length})</button>
        </div>

        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🍽️</div>
            <div className={styles.emptyText}>Sem receitas com estes ingredientes</div>
          </div>
        ) : (
          filtered.map((r, idx) => (
            <RecipeCard key={r.id} recipe={r} index={idx} onSelect={() => setSelected(r)} />
          ))
        )}
      </div>
    </div>
  );
}

function RecipeCard({ recipe, index, onSelect }) {
  const { matchPct, available, missing } = recipe;

  return (
    <div
      className={`${styles.card} ${matchPct === 100 ? styles.cardFull : ''}`}
      style={{ animationDelay: `${index * 60}ms` }}
      onClick={onSelect}
    >
      <div className={styles.cardEmoji}>{recipe.emoji}</div>

      <div className={styles.cardInfo}>
        <div className={styles.cardName}>{recipe.name}</div>
        <div className={styles.cardMeta}>
          <span>⏱ {recipe.time} min</span>
          <span>·</span>
          <span>👤 {recipe.servings} {recipe.servings > 1 ? 'doses' : 'dose'}</span>
          <span>·</span>
          <span>{recipe.difficulty}</span>
        </div>

        <div className={styles.tags}>
          {available.map(i => (
            <span key={i} className={styles.tagHave}>✓ {i}</span>
          ))}
          {missing.map(i => (
            <span key={i} className={styles.tagMiss}>✗ {i}</span>
          ))}
        </div>
      </div>

      <div className={styles.matchBlock}>
        <div className={`${styles.matchPct} ${matchPct === 100 ? styles.matchFull : styles.matchPart}`}>
          {matchPct}%
        </div>
        <div className={styles.matchLabel}>match</div>
        <div className={styles.arrowIcon}>›</div>
      </div>
    </div>
  );
}

function RecipeDetail({ recipe, onBack }) {
  const { available, missing } = recipe;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={onBack}>← Receitas</button>
      </div>

      <div className={styles.content}>
        <div className={styles.detailHero}>
          <div className={styles.detailEmoji}>{recipe.emoji}</div>
          <div className={styles.detailName}>{recipe.name}</div>
          <div className={styles.detailMeta}>
            <span className={styles.metaTag}>⏱ {recipe.time} min</span>
            <span className={styles.metaTag}>👤 {recipe.servings} doses</span>
            <span className={styles.metaTag}>📊 {recipe.difficulty}</span>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Ingredientes</div>
          {available.map(i => (
            <div key={i} className={`${styles.ingredientRow} ${styles.ingHave}`}>
              <span className={styles.ingCheck}>✓</span>
              <span>{i}</span>
              <span className={styles.ingStatus}>Na despensa</span>
            </div>
          ))}
          {missing.map(i => (
            <div key={i} className={`${styles.ingredientRow} ${styles.ingMiss}`}>
              <span className={styles.ingCheck}>✗</span>
              <span>{i}</span>
              <span className={styles.ingStatus}>Em falta</span>
            </div>
          ))}
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Preparação</div>
          {recipe.steps.map((step, i) => (
            <div key={i} className={styles.step}>
              <div className={styles.stepNum}>{i + 1}</div>
              <div className={styles.stepText}>{step}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
