const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});

const monthFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  year: 'numeric'
});

export const shortDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric'
});

const expenseRules = [
  { category: 'Housing', terms: ['rent', 'mortgage', 'home', 'apartment'] },
  { category: 'Transport', terms: ['fuel', 'gas', 'uber', 'train', 'bus', 'parking', 'rego'] },
  { category: 'Food', terms: ['grocery', 'groceries', 'restaurant', 'coffee', 'lunch', 'dinner', 'food'] },
  { category: 'Bills', terms: ['electric', 'water', 'internet', 'phone', 'utility', 'bill'] },
  { category: 'Health', terms: ['doctor', 'pharmacy', 'medical', 'dentist', 'health'] },
  { category: 'Shopping', terms: ['clothes', 'amazon', 'store', 'shopping'] }
];

export const expenseCategories = [
  'Housing',
  'Food',
  'Transport',
  'Bills',
  'Health',
  'Shopping',
  'Entertainment',
  'Education',
  'Travel',
  'Other spending'
];

export const incomeCategories = [
  'Salary',
  'Freelance',
  'Investments',
  'Gift',
  'Refund',
  'Other income'
];

export function formatCurrency(value) {
  return currencyFormatter.format(value || 0);
}

export function getTransactionDate(transaction) {
  return transaction.createdAt ? new Date(transaction.createdAt) : new Date();
}

export function inferCategory(transaction) {
  if (transaction.category) {
    return transaction.category;
  }

  const text = transaction.text.toLowerCase();
  const match = expenseRules.find(rule => rule.terms.some(term => text.includes(term)));
  return match ? match.category : transaction.amount < 0 ? 'Other spending' : 'Income';
}

function getMonthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function buildFinanceStats(transactions) {
  const expenseTransactions = transactions.filter(transaction => transaction.amount < 0);
  const amounts = transactions.map(transaction => transaction.amount);
  const balance = amounts.reduce((total, amount) => total + amount, 0);
  const income = amounts.filter(amount => amount > 0).reduce((total, amount) => total + amount, 0);
  const expenses = Math.abs(amounts.filter(amount => amount < 0).reduce((total, amount) => total + amount, 0));
  const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;
  const averageExpense = expenseTransactions.length ? expenses / expenseTransactions.length : 0;
  const monthMap = new Map();
  const categoryMap = new Map();

  transactions.forEach(transaction => {
    const date = getTransactionDate(transaction);
    const monthKey = getMonthKey(date);
    const currentMonth = monthMap.get(monthKey) || {
      key: monthKey,
      label: monthFormatter.format(date),
      income: 0,
      expenses: 0
    };

    if (transaction.amount > 0) {
      currentMonth.income += transaction.amount;
    } else {
      currentMonth.expenses += Math.abs(transaction.amount);
      const category = inferCategory(transaction);
      categoryMap.set(category, (categoryMap.get(category) || 0) + Math.abs(transaction.amount));
    }

    monthMap.set(monthKey, currentMonth);
  });

  const monthly = Array.from(monthMap.values()).sort((a, b) => a.key.localeCompare(b.key)).slice(-6);
  const topCategories = Array.from(categoryMap.entries())
    .map(([category, value]) => ({ category, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
  const recentTransactions = [...transactions].sort((a, b) => getTransactionDate(b) - getTransactionDate(a)).slice(0, 5);
  const largestExpense = [...expenseTransactions].sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))[0];

  return {
    averageExpense,
    balance,
    expenses,
    income,
    largestExpense,
    monthly,
    recentTransactions,
    savingsRate,
    topCategories,
    transactionCount: transactions.length
  };
}
