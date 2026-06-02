import React, {useState, useContext} from 'react'
import { GlobalContext } from '../context/GlobalState'
import { expenseCategories, incomeCategories } from '../utils/finance'

const initialForm = {
  text: '',
  amount: '',
  category: expenseCategories[0],
  createdAt: '',
  notes: ''
};

export const AddTransaction = ({ compact = false }) => {
  const [form, setForm] = useState(initialForm);
  const [kind, setKind] = useState('expense');
  const { addTransaction } = useContext(GlobalContext);

  const categories = kind === 'expense' ? expenseCategories : incomeCategories;

  const handleKindChange = nextKind => {
    setKind(nextKind);
    setForm({
      ...form,
      category: nextKind === 'expense' ? expenseCategories[0] : incomeCategories[0]
    });
  };

  const handleChange = event => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  };

  const onSubmit = e =>{
    e.preventDefault();
    const numericAmount = Math.abs(Number(form.amount));

    if (!form.text.trim() || numericAmount === 0) {
      return;
    }

    const newTransaction = {
      id: Math.floor(Math.random() * 10000000),
      text: form.text.trim(),
      amount: kind === 'expense' ? -numericAmount : numericAmount,
      category: form.category,
      notes: form.notes.trim()
    }

    if (form.createdAt) {
      newTransaction.createdAt = form.createdAt;
    }

    addTransaction(newTransaction);
    setForm({
      ...initialForm,
      category: kind === 'expense' ? expenseCategories[0] : incomeCategories[0]
    });
  }
  

  return (
    <aside className={compact ? 'add-panel compact-add-panel' : 'add-panel'}>
      <div className="panel-header">
        <div>
          <h2>Add transaction</h2>
          <p>Record spending and income with a category for cleaner reporting.</p>
        </div>
      </div>
      <form onSubmit={onSubmit} className="transaction-form">
        <div className="segmented-control form-segment" aria-label="Transaction type">
          <button type="button" className={kind === 'expense' ? 'active' : ''} onClick={() => handleKindChange('expense')}>Expense</button>
          <button type="button" className={kind === 'income' ? 'active' : ''} onClick={() => handleKindChange('income')}>Income</button>
        </div>
        <div className="form-control">
            <label htmlFor="text">Description</label>
            <input id="text" name="text" type="text" value={form.text} onChange={handleChange} placeholder="Groceries, salary, rent"/>
        </div>
        <div className="form-row">
          <div className="form-control">
              <label htmlFor="amount">Amount</label>
              <input id="amount" name="amount" type="number" min="0" step="0.01" value={form.amount} onChange={handleChange} placeholder="0.00"/>
          </div>
          <div className="form-control">
              <label htmlFor="category">Category</label>
              <select id="category" name="category" value={form.category} onChange={handleChange}>
                {categories.map(category => <option key={category} value={category}>{category}</option>)}
              </select>
          </div>
        </div>
        <div className="form-control">
            <label htmlFor="createdAt">Date</label>
            <input id="createdAt" name="createdAt" type="date" value={form.createdAt} onChange={handleChange}/>
        </div>
        <div className="form-control">
            <label htmlFor="notes">Notes</label>
            <textarea id="notes" name="notes" value={form.notes} onChange={handleChange} placeholder="Optional context for this record"></textarea>
        </div>
        <button className="btn">Add transaction</button>
      </form>
    </aside>
  )
}
