import React from 'react';

const pages = [
  { id: 'home', label: 'Home' },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'budgets', label: 'Budgets' },
  { id: 'goals', label: 'Goals' },
  { id: 'account', label: 'Account' },
  { id: 'cloud', label: 'Cloud plan' }
];

export const PageNav = ({ activePage, onChange }) => {
  return (
    <header className="site-header">
      <button className="brand-mark" onClick={() => onChange('home')}>
        Expense Tracker
      </button>
      <nav className="page-tabs" aria-label="Application pages">
        {pages.map(page => (
          <button
            key={page.id}
            className={activePage === page.id ? 'active' : ''}
            onClick={() => onChange(page.id)}
          >
            {page.label}
          </button>
        ))}
      </nav>
    </header>
  );
};
