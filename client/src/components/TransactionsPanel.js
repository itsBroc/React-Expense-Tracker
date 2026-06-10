import React, { useContext, useMemo, useState } from 'react';
import { Transaction } from './Transaction';
import { GlobalContext } from '../context/GlobalState';
import { getTransactionAmount, getTransactionDate } from '../utils/finance';

export const TransactionsPanel = ({ transactions, loading }) => {
  const { accounts } = useContext(GlobalContext);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [accountFilter, setAccountFilter] = useState('all');
  const accountMap = useMemo(() => new Map(accounts.map(account => [account._id, account])), [accounts]);

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(transaction => {
        const account = accountMap.get(transaction.accountId);
        const searchText = `${transaction.text} ${transaction.category || ''} ${account?.name || ''}`.toLowerCase();
        const matchesSearch = searchText.includes(search.toLowerCase());
        const amount = getTransactionAmount(transaction);
        const matchesType = typeFilter === 'all'
          || (typeFilter === 'income' && amount > 0)
          || (typeFilter === 'expense' && amount < 0);
        const matchesAccount = accountFilter === 'all'
          || (accountFilter === 'unlinked' && !transaction.accountId)
          || transaction.accountId === accountFilter;

        return matchesSearch && matchesType && matchesAccount;
      })
      .sort((a, b) => getTransactionDate(b) - getTransactionDate(a));
  }, [transactions, search, typeFilter, accountFilter, accountMap]);

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
          {accounts.length > 0 && (
            <select value={accountFilter} onChange={event => setAccountFilter(event.target.value)} aria-label="Filter by account">
              <option value="all">All accounts</option>
              <option value="unlinked">No account</option>
              {accounts.map(account => <option key={account._id} value={account._id}>{account.name}</option>)}
            </select>
          )}
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
