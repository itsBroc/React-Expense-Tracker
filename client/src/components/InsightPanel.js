import React from 'react';
import { formatCurrency } from '../utils/finance';

export const InsightPanel = ({ stats }) => {
  return (
    <section className="panel">
      <h2>Quick insight</h2>
      <div className="insight-list">
        <p>
          Your net cash flow is <strong>{formatCurrency(stats.income - stats.expenses)}</strong>.
        </p>
        <p>
          {stats.largestExpense
            ? `Largest expense: ${stats.largestExpense.text} at ${formatCurrency(Math.abs(stats.largestExpense.amount))}.`
            : 'Largest expense will appear after you add spending.'}
        </p>
        <p>
          Average expense is <strong>{formatCurrency(stats.averageExpense)}</strong> across recorded spending.
        </p>
      </div>
    </section>
  );
};
