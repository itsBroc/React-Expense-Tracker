import React from 'react';
import { formatCurrency, getTransactionDate, shortDateFormatter } from '../utils/finance';

export const RecentActivity = ({ transactions }) => {
  return (
    <section className="panel">
      <h2>Recent activity</h2>
      <div className="recent-list">
        {transactions.length === 0 && <p className="empty-state">No transactions recorded yet.</p>}
        {transactions.map(transaction => (
          <div className="recent-row" key={transaction._id || transaction.id}>
            <div>
              <strong>{transaction.text}</strong>
              <span>{shortDateFormatter.format(getTransactionDate(transaction))}</span>
            </div>
            <span className={transaction.amount < 0 ? 'amount negative' : 'amount positive'}>
              {formatCurrency(transaction.amount)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
