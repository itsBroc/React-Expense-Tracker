import React, {useContext} from 'react'
import { GlobalContext } from '../context/GlobalState'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric'
});

export const Transaction = ({ transaction }) => {
  const { deleteTransaction } = useContext(GlobalContext);
  const date = transaction.createdAt ? new Date(transaction.createdAt) : new Date();

  return (
    <li className={transaction.amount < 0 ? 'transaction-row expense' : 'transaction-row income'}>
      <div className="transaction-copy">
        <strong>{transaction.text}</strong>
        <span>
          {dateFormatter.format(date)}
          {transaction.category && <i className="category-chip">{transaction.category}</i>}
        </span>
        {transaction.notes && <small>{transaction.notes}</small>}
      </div>
      <span className={transaction.amount < 0 ? 'amount negative' : 'amount positive'}>
        {currencyFormatter.format(transaction.amount)}
      </span>
      <button onClick={() => deleteTransaction(transaction._id)} className="delete-btn" aria-label={`Delete ${transaction.text}`}>
        Delete
      </button>
    </li>
  )
}
