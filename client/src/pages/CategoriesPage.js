import React, { useContext, useMemo, useState } from 'react';
import { GlobalContext } from '../context/GlobalState';

const initialCategory = {
  name: '',
  type: 'expense',
  icon: 'tag',
  color: '#314d5f'
};

const categoryTypes = [
  { value: 'expense', label: 'Expense' },
  { value: 'income', label: 'Income' }
];

const colorOptions = ['#314d5f', '#2f7d4d', '#2d766f', '#b7832f', '#a33d32', '#6b5b95', '#697067'];

export const CategoriesPage = () => {
  const { addCategory, categories, deleteCategory } = useContext(GlobalContext);
  const [form, setForm] = useState(initialCategory);
  const groupedCategories = useMemo(() => ({
    expense: categories.filter(category => category.type === 'expense' && !category.isArchived),
    income: categories.filter(category => category.type === 'income' && !category.isArchived)
  }), [categories]);

  const handleChange = event => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = event => {
    event.preventDefault();

    if (!form.name.trim()) {
      return;
    }

    addCategory({
      ...form,
      name: form.name.trim()
    });
    setForm(initialCategory);
  };

  return (
    <section>
      <header className="page-header">
        <div>
          <p className="eyebrow">Categories</p>
          <h1>Organise income and spending</h1>
        </div>
      </header>

      <div className="management-layout">
        <form className="panel management-form" onSubmit={handleSubmit}>
          <div>
            <h2>Add category</h2>
            <p>Create categories for transaction entry, reports, and budgets.</p>
          </div>
          <div className="form-control">
            <label htmlFor="category-name">Name</label>
            <input id="category-name" name="name" type="text" value={form.name} onChange={handleChange} placeholder="Groceries"/>
          </div>
          <div className="form-row">
            <div className="form-control">
              <label htmlFor="category-type">Type</label>
              <select id="category-type" name="type" value={form.type} onChange={handleChange}>
                {categoryTypes.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
              </select>
            </div>
            <div className="form-control">
              <label htmlFor="category-icon">Icon</label>
              <input id="category-icon" name="icon" type="text" value={form.icon} onChange={handleChange} placeholder="tag"/>
            </div>
          </div>
          <div className="color-picker" aria-label="Category color">
            {colorOptions.map(color => (
              <button
                aria-label={color}
                className={form.color === color ? 'color-swatch active' : 'color-swatch'}
                key={color}
                onClick={() => setForm({ ...form, color })}
                style={{ backgroundColor: color }}
                type="button"
              />
            ))}
          </div>
          <button className="btn">Create category</button>
        </form>

        <div className="category-management-grid">
          {categoryTypes.map(type => (
            <section className="panel category-management-panel" key={type.value}>
              <div className="panel-header">
                <div>
                  <h2>{type.label} categories</h2>
                  <p>{groupedCategories[type.value].length} active categories</p>
                </div>
              </div>
              <div className="managed-category-list">
                {groupedCategories[type.value].length === 0 && <div className="empty-state">No categories yet.</div>}
                {groupedCategories[type.value].map(category => (
                  <article className="managed-category-row" key={category._id}>
                    <span className="category-color" style={{ backgroundColor: category.color }} />
                    <div>
                      <strong>{category.name}</strong>
                      <span>{category.icon || 'tag'}{category.isDefault ? ' · default' : ''}</span>
                    </div>
                    <button className="delete-btn inline-delete" onClick={() => deleteCategory(category._id)}>Delete</button>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
};
