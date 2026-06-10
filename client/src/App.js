import './App.css';
import React, { useContext, useEffect, useMemo } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { PageNav } from './components/PageNav';
import { AccountPage } from './pages/AccountPage';
import { BudgetsPage } from './pages/BudgetsPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { DashboardPage } from './pages/DashboardPage';
import { GoalsPage } from './pages/GoalsPage';
import { LandingPage } from './pages/LandingPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GlobalContext, GlobalProvider } from './context/GlobalState';
import { buildFinanceStats } from './utils/finance';

const pageTitles = {
  '/': 'Home',
  '/account': 'Account',
  '/budgets': 'Budgets',
  '/categories': 'Categories',
  '/dashboard': 'Dashboard',
  '/goals': 'Goals'
};

const pagePaths = {
  account: '/account',
  budgets: '/budgets',
  categories: '/categories',
  dashboard: '/dashboard',
  goals: '/goals',
  home: '/'
};

function TrackerWorkspace() {
  const {
    transactions,
    goals,
    budgets,
    getAccounts,
    getCategories,
    getTransactions,
    getGoals,
    getBudgets,
    getUserProfile,
    loading,
    error
  } = useContext(GlobalContext);
  const { authReady, configured, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const stats = useMemo(() => buildFinanceStats(transactions), [transactions]);
  const mobileTitle = pageTitles[location.pathname] || 'Home';

  useEffect(() => {
    if (!authReady || (configured && !isAuthenticated)) {
      return;
    }

    getTransactions();
    getGoals();
    getBudgets();
    getAccounts();
    getCategories();
    getUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authReady, configured, isAuthenticated]);

  const navigateToPage = page => {
    navigate(pagePaths[page] || '/');
  };

  return (
    <main className="app-frame">
      <PageNav/>
      {error && <div className="notice app-notice">{error}</div>}
      <div className="page-title-mobile">{mobileTitle}</div>

      <Routes>
        <Route path="/" element={<LandingPage stats={stats} onNavigate={navigateToPage}/>}/>
        <Route path="/dashboard" element={<DashboardPage stats={stats} transactions={transactions} loading={loading}/>}/>
        <Route path="/budgets" element={<BudgetsPage stats={stats} budgets={budgets}/>}/>
        <Route path="/categories" element={<CategoriesPage/>}/>
        <Route path="/goals" element={<GoalsPage stats={stats} goals={goals}/>}/>
        <Route path="/account" element={<AccountPage/>}/>
        <Route path="*" element={<Navigate to="/" replace/>}/>
      </Routes>
    </main>
  );
}

function App() {
  return (
    <AuthProvider>
      <GlobalProvider>
        <BrowserRouter>
          <TrackerWorkspace/>
        </BrowserRouter>
      </GlobalProvider>
    </AuthProvider>
  );
}

export default App;
