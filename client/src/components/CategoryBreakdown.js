import React from 'react';
import { formatCurrency } from '../utils/finance';

export const CategoryBreakdown = ({ categories }) => {
  const maxValue = categories[0]?.value || 1;

  return (
    <section className="panel">
      <h2>Spending categories</h2>
      <div className="category-list">
        {categories.length === 0 && <p className="empty-state">Expenses will be grouped automatically.</p>}
        {categories.map(item => (
          <div className="category-row" key={item.category}>
            <div>
              <strong>{item.category}</strong>
              <span>{formatCurrency(item.value)}</span>
            </div>
            <progress value={item.value} max={maxValue}></progress>
          </div>
        ))}
      </div>
    </section>
  );
};
