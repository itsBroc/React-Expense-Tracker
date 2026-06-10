import React, { useContext, useState } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { formatCurrency, getGoalCurrent, getGoalTarget } from '../utils/finance';

const initialGoal = {
  name: '',
  target: '',
  current: '',
  dueDate: '',
  priority: 'medium',
  notes: ''
};

function getProgress(goal) {
  return Math.min((getGoalCurrent(goal) / getGoalTarget(goal)) * 100, 100);
}

export const GoalsPage = ({ stats, goals }) => {
  const [form, setForm] = useState(initialGoal);
  const { addGoal, updateGoal, deleteGoal } = useContext(GlobalContext);

  const handleChange = event => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = event => {
    event.preventDefault();

    if (!form.name.trim() || Number(form.target) <= 0) {
      return;
    }

    addGoal({
      ...form,
      name: form.name.trim(),
      target: Number(form.target),
      current: Number(form.current || 0)
    });
    setForm(initialGoal);
  };

  const addProgress = goal => {
    const contribution = Number(window.prompt('Amount to add toward this goal', '50'));
    const current = getGoalCurrent(goal);
    const target = getGoalTarget(goal);

    if (!Number.isFinite(contribution) || contribution <= 0) {
      return;
    }

    updateGoal(goal._id, {
      current: Math.min(current + contribution, target)
    });
  };

  return (
    <section>
      <header className="page-header">
        <div>
          <p className="eyebrow">Goals</p>
          <h1>Savings and planning</h1>
        </div>
        <div className="status-block status-accent">
          <span>Available cash flow</span>
          <strong>{formatCurrency(stats.income - stats.expenses)}</strong>
        </div>
      </header>

      <div className="management-layout">
        <form className="panel management-form" onSubmit={handleSubmit}>
          <div>
            <h2>Add savings goal</h2>
            <p>Track progress toward a future purchase, fund, or debt milestone.</p>
          </div>
          <div className="form-control">
            <label htmlFor="goal-name">Goal name</label>
            <input id="goal-name" name="name" type="text" value={form.name} onChange={handleChange} placeholder="Emergency fund"/>
          </div>
          <div className="form-row">
            <div className="form-control">
              <label htmlFor="goal-target">Target</label>
              <input id="goal-target" name="target" type="number" min="1" step="0.01" value={form.target} onChange={handleChange} placeholder="5000"/>
            </div>
            <div className="form-control">
              <label htmlFor="goal-current">Current</label>
              <input id="goal-current" name="current" type="number" min="0" step="0.01" value={form.current} onChange={handleChange} placeholder="750"/>
            </div>
          </div>
          <div className="form-row">
            <div className="form-control">
              <label htmlFor="goal-due">Due date</label>
              <input id="goal-due" name="dueDate" type="date" value={form.dueDate} onChange={handleChange}/>
            </div>
            <div className="form-control">
              <label htmlFor="goal-priority">Priority</label>
              <select id="goal-priority" name="priority" value={form.priority} onChange={handleChange}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div className="form-control">
            <label htmlFor="goal-notes">Notes</label>
            <input id="goal-notes" name="notes" type="text" value={form.notes} onChange={handleChange} placeholder="Why this goal matters"/>
          </div>
          <button className="btn">Create goal</button>
        </form>

        <div className="goal-grid">
          {goals.length === 0 && <div className="panel empty-state">No goals yet. Add one to start tracking progress.</div>}
          {goals.map(goal => (
            <article className={`panel goal-card priority-${goal.priority}`} key={goal._id}>
              <div className="card-kicker">{goal.priority} priority</div>
              <h2>{goal.name}</h2>
              <strong>{formatCurrency(getGoalCurrent(goal))} saved</strong>
              <progress value={getGoalCurrent(goal)} max={getGoalTarget(goal)}></progress>
              <p>{formatCurrency(Math.max(getGoalTarget(goal) - getGoalCurrent(goal), 0))} to reach {formatCurrency(getGoalTarget(goal))}.</p>
              {goal.dueDate && <p>Target date: {new Date(goal.dueDate).toLocaleDateString()}</p>}
              {goal.notes && <p>{goal.notes}</p>}
              <div className="card-actions">
                <button className="secondary-btn" onClick={() => addProgress(goal)}>Add progress</button>
                <button className="delete-btn inline-delete" onClick={() => deleteGoal(goal._id)}>Delete</button>
              </div>
              <span className="progress-label">{getProgress(goal).toFixed(0)}% complete</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
