import './App.css';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { PageNav } from './components/PageNav';
import { AccountPage } from './pages/AccountPage';
import { BudgetsPage } from './pages/BudgetsPage';
import { CloudPlanPage } from './pages/CloudPlanPage';
import { DashboardPage } from './pages/DashboardPage';
import { GoalsPage } from './pages/GoalsPage';
import { LandingPage } from './pages/LandingPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GlobalContext, GlobalProvider } from './context/GlobalState';
import { buildFinanceStats } from './utils/finance';

const pageTitles = {
  account: 'Account',
  budgets: 'Budgets',
  cloud: 'Cloud Plan',
  dashboard: 'Dashboard',
  goals: 'Goals',
  home: 'Home'
};

function TrackerWorkspace() {
  const {
    transactions,
    goals,
    budgets,
    getTransactions,
    getGoals,
    getBudgets,
    loading,
    error
  } = useContext(GlobalContext);
  const { authReady, configured, isAuthenticated } = useAuth();
  const [activePage, setActivePage] = useState('home');
  const stats = useMemo(() => buildFinanceStats(transactions), [transactions]);

  useEffect(() => {
    if (!authReady || (configured && !isAuthenticated)) {
      return;
    }

    getTransactions();
    getGoals();
    getBudgets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authReady, configured, isAuthenticated]);

  return (
    <main className="app-frame">
      <PageNav activePage={activePage} onChange={setActivePage}/>
      {error && <div className="notice app-notice">{error}</div>}
      <div className="page-title-mobile">{pageTitles[activePage]}</div>

      {activePage === 'home' && <LandingPage stats={stats} onNavigate={setActivePage}/>}
      {activePage === 'dashboard' && <DashboardPage stats={stats} transactions={transactions} loading={loading}/>}
      {activePage === 'budgets' && <BudgetsPage stats={stats} budgets={budgets}/>}
      {activePage === 'goals' && <GoalsPage stats={stats} goals={goals}/>}
      {activePage === 'account' && <AccountPage/>}
      {activePage === 'cloud' && <CloudPlanPage/>}
    </main>
  );
}

function App() {
  return (
    <AuthProvider>
      <GlobalProvider>
        <TrackerWorkspace/>
      </GlobalProvider>
    </AuthProvider>
  );
}

export default App;
