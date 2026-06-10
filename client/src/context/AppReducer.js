const AppReducer = (state, action) => {
  switch(action.type) {
    case 'GET_ACCOUNTS':
      return {
        ...state,
        accounts: action.payload
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
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        error: null,
        transactions: state.transactions.filter(transaction => transaction._id !== action.payload)
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
    case 'ADD_TRANSACTION':
      return {
        ...state,
        error: null,
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
