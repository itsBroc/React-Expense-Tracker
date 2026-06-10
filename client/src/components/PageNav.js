import React from 'react';
import { NavLink } from 'react-router-dom';

const pages = [
  { path: '/', label: 'Home' },
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/budgets', label: 'Budgets' },
  { path: '/goals', label: 'Goals' },
  { path: '/account', label: 'Account' }
];

export const PageNav = () => {
  return (
    <header className="site-header">
      <NavLink className="brand-mark" to="/">
        Expense Tracker
      </NavLink>
      <nav className="page-tabs" aria-label="Application pages">
        {pages.map(page => (
          <NavLink
            key={page.path}
            to={page.path}
            end={page.path === '/'}
          >
            {page.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
};
