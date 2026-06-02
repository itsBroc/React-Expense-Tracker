import React from 'react';
import { CategoryBreakdown } from '../components/CategoryBreakdown';
import { InsightPanel } from '../components/InsightPanel';
import { MetricGrid } from '../components/MetricGrid';
import { MonthlyChart } from '../components/MonthlyChart';
import { RecentActivity } from '../components/RecentActivity';
import { TransactionsPanel } from '../components/TransactionsPanel';
import { formatCurrency } from '../utils/finance';

export const DashboardPage = ({ stats, transactions, loading }) => {
  return (
    <section>
      <header className="page-header">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1>Financial command centre</h1>
        </div>
        <div className="status-block">
          <span>Current balance</span>
          <strong>{formatCurrency(stats.balance)}</strong>
        </div>
      </header>
      <MetricGrid stats={stats}/>
      <div className="dashboard-grid">
        <MonthlyChart monthly={stats.monthly}/>
        <CategoryBreakdown categories={stats.topCategories}/>
        <InsightPanel stats={stats}/>
        <RecentActivity transactions={stats.recentTransactions}/>
      </div>
      <TransactionsPanel transactions={transactions} loading={loading}/>
    </section>
  );
};
