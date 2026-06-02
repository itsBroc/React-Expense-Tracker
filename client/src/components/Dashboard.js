import React, { useContext, useMemo } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { DashboardPage } from '../pages/DashboardPage';
import { buildFinanceStats } from '../utils/finance';

export const Dashboard = () => {
  const { transactions, loading } = useContext(GlobalContext);
  const stats = useMemo(() => buildFinanceStats(transactions), [transactions]);

  return <DashboardPage stats={stats} transactions={transactions} loading={loading}/>;
};
