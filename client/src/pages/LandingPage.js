import React from 'react';
import { AddTransaction } from '../components/AddTransaction';
import { formatCurrency } from '../utils/finance';

export const LandingPage = ({ stats, onNavigate }) => {
  return (
    <section className="home-page">
      <div className="landing-page">
        <div className="landing-copy">
          <p className="eyebrow">Personal tracker</p>
          <h1>Record the transaction, then let the dashboard explain the pattern.</h1>
          <p className="landing-lede">
            Add income and expenses with categories, dates, and notes. Dashboard pages stay focused on visualising the financial picture.
          </p>
          <div className="landing-actions">
            <button className="btn compact" onClick={() => onNavigate('dashboard')}>Open dashboard</button>
            <button className="secondary-btn" onClick={() => onNavigate('budgets')}>Review budgets</button>
          </div>
        </div>
        <aside className="landing-panel">
          <span>Current balance</span>
          <strong>{formatCurrency(stats.balance)}</strong>
          <div className="landing-stats">
            <div>
              <span>Records</span>
              <strong>{stats.transactionCount}</strong>
            </div>
            <div>
              <span>Savings rate</span>
              <strong>{stats.savingsRate.toFixed(1)}%</strong>
            </div>
          </div>
        </aside>
      </div>
      <AddTransaction compact/>
    </section>
  );
};
