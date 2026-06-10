import React, {useContext} from 'react'
import { GlobalContext } from '../context/GlobalState'
import { formatCurrency, getTransactionAmount } from '../utils/finance';

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric'
});

export const Transaction = ({ transaction }) => {
  const { accounts, deleteTransaction } = useContext(GlobalContext);
  const date = transaction.createdAt ? new Date(transaction.createdAt) : new Date();
  const amount = getTransactionAmount(transaction);
  const account = accounts.find(item => item._id === transaction.accountId);

  return (
    <li className={amount < 0 ? 'transaction-row expense' : 'transaction-row income'}>
      <div className="transaction-copy">
        <strong>{transaction.text}</strong>
        <span>
          {dateFormatter.format(date)}
          {transaction.category && <i className="category-chip">{transaction.category}</i>}
          {account && <i className="category-chip account-chip">{account.name}</i>}
        </span>
        {transaction.notes && <small>{transaction.notes}</small>}
      </div>
      <span className={amount < 0 ? 'amount negative' : 'amount positive'}>
        {formatCurrency(amount)}
      </span>
      <button onClick={() => deleteTransaction(transaction._id)} className="delete-btn" aria-label={`Delete ${transaction.text}`}>
        Delete
      </button>
    </li>
  )
}
