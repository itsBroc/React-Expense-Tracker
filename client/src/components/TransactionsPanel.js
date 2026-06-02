import React, { useMemo, useState } from 'react';
import { Transaction } from './Transaction';
import { getTransactionDate } from '../utils/finance';

export const TransactionsPanel = ({ transactions, loading }) => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(transaction => {
        const matchesSearch = transaction.text.toLowerCase().includes(search.toLowerCase());
        const matchesType = typeFilter === 'all'
          || (typeFilter === 'income' && transaction.amount > 0)
          || (typeFilter === 'expense' && transaction.amount < 0);

        return matchesSearch && matchesType;
      })
      .sort((a, b) => getTransactionDate(b) - getTransactionDate(a));
  }, [transactions, search, typeFilter]);

  return (
    <section className="panel transactions-panel">
      <div className="panel-header">
        <div>
          <h2>Transactions</h2>
          <p>{loading ? 'Loading records.' : `${filteredTransactions.length} of ${transactions.length} records shown.`}</p>
        </div>
        <div className="transaction-tools">
          <input
            type="search"
            value={search}
            onChange={event => setSearch(event.target.value)}
            placeholder="Search transactions"
          />
          <div className="segmented-control" aria-label="Filter transactions">
            <button className={typeFilter === 'all' ? 'active' : ''} onClick={() => setTypeFilter('all')}>All</button>
            <button className={typeFilter === 'income' ? 'active' : ''} onClick={() => setTypeFilter('income')}>Income</button>
            <button className={typeFilter === 'expense' ? 'active' : ''} onClick={() => setTypeFilter('expense')}>Expenses</button>
          </div>
        </div>
      </div>
      <ul className="transaction-list">
        {filteredTransactions.length === 0 && <li className="empty-state transaction-empty">No matching transactions.</li>}
        {filteredTransactions.map(transaction => (
          <Transaction key={transaction._id || transaction.id} transaction={transaction}/>
        ))}
      </ul>
    </section>
  );
};
