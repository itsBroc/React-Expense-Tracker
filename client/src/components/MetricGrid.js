import React from 'react';
import { formatCurrency } from '../utils/finance';

export const MetricGrid = ({ stats }) => {
  return (
    <div className="summary-grid">
      <article className="metric-panel">
        <span>Current balance</span>
        <strong>{formatCurrency(stats.balance)}</strong>
      </article>
      <article className="metric-panel">
        <span>Total income</span>
        <strong>{formatCurrency(stats.income)}</strong>
      </article>
      <article className="metric-panel">
        <span>Total expenses</span>
        <strong>{formatCurrency(stats.expenses)}</strong>
      </article>
      <article className="metric-panel">
        <span>Savings rate</span>
        <strong>{stats.savingsRate.toFixed(1)}%</strong>
      </article>
    </div>
  );
};
