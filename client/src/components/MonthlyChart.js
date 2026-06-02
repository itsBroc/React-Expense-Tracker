import React from 'react';
import { formatCurrency } from '../utils/finance';

export const MonthlyChart = ({ monthly }) => {
  const maxMonthlyValue = Math.max(1, ...monthly.flatMap(month => [month.income, month.expenses]));

  return (
    <section className="panel panel-large">
      <div className="panel-header">
        <div>
          <h2>Monthly movement</h2>
          <p>Income and spending over the latest recorded months.</p>
        </div>
      </div>
      <div className="bar-chart" aria-label="Monthly income and expenses">
        {monthly.length === 0 && <p className="empty-state">Add transactions to build a monthly view.</p>}
        {monthly.map(month => (
          <div className="bar-group" key={month.key}>
            <div className="bars">
              <span className="bar income-bar" style={{ height: `${(month.income / maxMonthlyValue) * 100}%` }} title={`Income ${formatCurrency(month.income)}`}></span>
              <span className="bar expense-bar" style={{ height: `${(month.expenses / maxMonthlyValue) * 100}%` }} title={`Expenses ${formatCurrency(month.expenses)}`}></span>
            </div>
            <span className="bar-label">{month.label}</span>
          </div>
        ))}
      </div>
      <div className="legend">
        <span><i className="legend-income"></i>Income</span>
        <span><i className="legend-expense"></i>Expenses</span>
      </div>
    </section>
  );
};
