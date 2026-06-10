function getTransactionAmountMinor(transaction) {
  if (Number.isFinite(transaction?.amountMinor)) {
    return transaction.amountMinor;
  }

  return Math.round(Number(transaction?.amount || 0) * 100);
}

function adjustAccountBalance(accounts, transaction, direction = 1) {
  if (!transaction?.accountId) {
    return accounts;
  }

  const amountMinor = getTransactionAmountMinor(transaction) * direction;

  return accounts.map(account => {
    if (account._id !== transaction.accountId) {
      return account;
    }

    return {
      ...account,
      currentBalanceMinor: Number(account.currentBalanceMinor || 0) + amountMinor
    };
  });
}

const AppReducer = (state, action) => {
  switch(action.type) {
    case 'GET_ACCOUNTS':
      return {
        ...state,
        accounts: action.payload
      }
    case 'GET_CATEGORIES':
      return {
        ...state,
        categories: action.payload
      }
    case 'GET_TRANSACTIONS':
      return {
        ...state,
        loading: false,
        transactions: action.payload
      }
    case 'GET_GOALS':
      return {
        ...state,
        goals: action.payload
      }
    case 'GET_BUDGETS':
      return {
        ...state,
        budgets: action.payload
      }
    case 'GET_USER_PROFILE':
    case 'UPDATE_USER_PROFILE':
      return {
        ...state,
        error: null,
        userProfile: action.payload
      }
    case 'DELETE_TRANSACTION': {
      const deletedTransaction = state.transactions.find(transaction => transaction._id === action.payload);

      return {
        ...state,
        error: null,
        accounts: adjustAccountBalance(state.accounts, deletedTransaction, -1),
        transactions: state.transactions.filter(transaction => transaction._id !== action.payload)
      }
    }
    case 'ADD_ACCOUNT':
      return {
        ...state,
        error: null,
        accounts: [action.payload, ...state.accounts]
      }
    case 'UPDATE_ACCOUNT':
      return {
        ...state,
        error: null,
        accounts: state.accounts.map(account => account._id === action.payload._id ? action.payload : account)
      }
    case 'DELETE_ACCOUNT':
      return {
        ...state,
        error: null,
        accounts: state.accounts.filter(account => account._id !== action.payload)
      }
    case 'ADD_CATEGORY':
      return {
        ...state,
        error: null,
        categories: [action.payload, ...state.categories]
      }
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        error: null,
        categories: state.categories.map(category => category._id === action.payload._id ? action.payload : category)
      }
    case 'DELETE_CATEGORY':
      return {
        ...state,
        error: null,
        categories: state.categories.filter(category => category._id !== action.payload)
      }
    case 'ADD_TRANSACTION':
      return {
        ...state,
        error: null,
        accounts: adjustAccountBalance(state.accounts, action.payload, 1),
        transactions: [...state.transactions, action.payload]
      }
    case 'ADD_GOAL':
      return {
        ...state,
        error: null,
        goals: [action.payload, ...state.goals]
      }
    case 'UPDATE_GOAL':
      return {
        ...state,
        error: null,
        goals: state.goals.map(goal => goal._id === action.payload._id ? action.payload : goal)
      }
    case 'DELETE_GOAL':
      return {
        ...state,
        error: null,
        goals: state.goals.filter(goal => goal._id !== action.payload)
      }
    case 'ADD_BUDGET':
      return {
        ...state,
        error: null,
        budgets: [action.payload, ...state.budgets]
      }
    case 'UPDATE_BUDGET':
      return {
        ...state,
        error: null,
        budgets: state.budgets.map(budget => budget._id === action.payload._id ? action.payload : budget)
      }
    case 'DELETE_BUDGET':
      return {
        ...state,
        error: null,
        budgets: state.budgets.filter(budget => budget._id !== action.payload)
      }
    case 'TRANSACTION_ERROR':
    case 'ACCOUNT_ERROR':
    case 'CATEGORY_ERROR':
    case 'GOAL_ERROR':
    case 'BUDGET_ERROR':
    case 'PROFILE_ERROR':
      return {
        ...state,
        error: action.payload
      }
    default:
      return state;
  }
}

export default AppReducer;
