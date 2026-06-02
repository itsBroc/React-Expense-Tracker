import React, { useContext, useState } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { formatCurrency } from '../utils/finance';

const initialBudget = {
  category: '',
  limit: '',
  period: 'monthly',
  notes: ''
};

export const BudgetsPage = ({ stats, budgets }) => {
  const [form, setForm] = useState(initialBudget);
  const { addBudget, deleteBudget } = useContext(GlobalContext);

  const handleChange = event => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = event => {
    event.preventDefault();

    if (!form.category.trim() || Number(form.limit) <= 0) {
      return;
    }

    addBudget({
      ...form,
      category: form.category.trim(),
      limit: Number(form.limit)
    });
    setForm(initialBudget);
  };

  return (
    <section>
      <header className="page-header">
        <div>
          <p className="eyebrow">Budgets</p>
          <h1>Monthly budget watchlist</h1>
        </div>
        <div className="status-block status-warm">
          <span>Tracked spending</span>
          <strong>{formatCurrency(stats.expenses)}</strong>
        </div>
      </header>

      <div className="management-layout">
        <form className="panel management-form" onSubmit={handleSubmit}>
          <div>
            <h2>Add budget</h2>
            <p>Create spending limits for categories such as Food, Housing, Transport, or Bills.</p>
          </div>
          <div className="form-control">
            <label htmlFor="budget-category">Category</label>
            <input id="budget-category" name="category" type="text" value={form.category} onChange={handleChange} placeholder="Food"/>
          </div>
          <div className="form-row">
            <div className="form-control">
              <label htmlFor="budget-limit">Limit</label>
              <input id="budget-limit" name="limit" type="number" min="1" step="0.01" value={form.limit} onChange={handleChange} placeholder="650"/>
            </div>
            <div className="form-control">
              <label htmlFor="budget-period">Period</label>
              <select id="budget-period" name="period" value={form.period} onChange={handleChange}>
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
          </div>
          <div className="form-control">
            <label htmlFor="budget-notes">Notes</label>
            <input id="budget-notes" name="notes" type="text" value={form.notes} onChange={handleChange} placeholder="Keep grocery spend under control"/>
          </div>
          <button className="btn">Create budget</button>
        </form>

        <div className="budget-grid">
          {budgets.length === 0 && <div className="panel empty-state">No budgets yet. Add one to compare spending against a limit.</div>}
          {budgets.map(budget => {
            const category = stats.topCategories.find(item => item.category.toLowerCase() === budget.category.toLowerCase());
            const spent = category?.value || 0;
            const percent = Math.min((spent / budget.limit) * 100, 100);
            const isOver = spent > budget.limit;

            return (
              <article className={isOver ? 'panel budget-card budget-over' : 'panel budget-card'} key={budget._id}>
                <div className="budget-card-header">
                  <h2>{budget.category}</h2>
                  <span>{budget.period}</span>
                </div>
                <strong>{formatCurrency(spent)} of {formatCurrency(budget.limit)}</strong>
                <progress value={percent} max="100"></progress>
                <p>
                  {isOver
                    ? `${formatCurrency(spent - budget.limit)} over budget.`
                    : `${formatCurrency(Math.max(budget.limit - spent, 0))} remaining.`}
                </p>
                {budget.notes && <p>{budget.notes}</p>}
                <div className="card-actions">
                  <button className="delete-btn inline-delete" onClick={() => deleteBudget(budget._id)}>Delete</button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
