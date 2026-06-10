import React, { createContext, useReducer} from 'react';
import AppReducer from './AppReducer';
import axios from 'axios';

// Initial State
const initialState = {
    accounts: [],
    categories: [],
    transactions: [],
    goals: [],
    budgets: [],
    userProfile: null,
    error: null,
    loading: true
}

// Create Context
export const GlobalContext = createContext(initialState);

// Provider Componenet
export const GlobalProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AppReducer, initialState);

    //actions
    async function getTransactions() {
        try {
            const res = await axios.get('/api/v1/transactions');

            dispatch({
                type: 'GET_TRANSACTIONS',
                payload: res.data.data
            });
        } catch (err) {
            dispatch({
                type: 'TRANSACTION_ERROR',
                payload: err.response?.data?.error || 'Unable to load transactions. Check that the API server is running.'
            });            
            
        }
    }

    async function deleteTransaction(id){
        try {
            await axios.delete(`/api/v1/transactions/${id}`);
            dispatch({
                type: 'DELETE_TRANSACTION',
                payload: id
        })

        } catch (err) {
            dispatch({
                type: 'TRANSACTION_ERROR',
                payload: err.response?.data?.error || 'Unable to delete the transaction.'
            });              
        }


    }

    async function addTransaction(transaction){
        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        }

        try {
            const res = await axios.post('/api/v1/transactions/', transaction, config);

            dispatch({
                type: 'ADD_TRANSACTION',
                payload: res.data.data
        })
        } catch (err) {
            dispatch({
                type: 'TRANSACTION_ERROR',
                payload: err.response?.data?.error || 'Unable to add the transaction.'
            });             
        }

    }

    async function getGoals() {
        try {
            const res = await axios.get('/api/v1/goals');

            dispatch({
                type: 'GET_GOALS',
                payload: res.data.data
            });
        } catch (err) {
            dispatch({
                type: 'GOAL_ERROR',
                payload: err.response?.data?.error || 'Unable to load goals.'
            });
        }
    }

    async function addGoal(goal) {
        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        }

        try {
            const res = await axios.post('/api/v1/goals', goal, config);

            dispatch({
                type: 'ADD_GOAL',
                payload: res.data.data
            });
        } catch (err) {
            dispatch({
                type: 'GOAL_ERROR',
                payload: err.response?.data?.error || 'Unable to add the goal.'
            });
        }
    }

    async function updateGoal(id, goal) {
        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        }

        try {
            const res = await axios.put(`/api/v1/goals/${id}`, goal, config);

            dispatch({
                type: 'UPDATE_GOAL',
                payload: res.data.data
            });
        } catch (err) {
            dispatch({
                type: 'GOAL_ERROR',
                payload: err.response?.data?.error || 'Unable to update the goal.'
            });
        }
    }

    async function deleteGoal(id) {
        try {
            await axios.delete(`/api/v1/goals/${id}`);

            dispatch({
                type: 'DELETE_GOAL',
                payload: id
            });
        } catch (err) {
            dispatch({
                type: 'GOAL_ERROR',
                payload: err.response?.data?.error || 'Unable to delete the goal.'
            });
        }
    }

    async function getBudgets() {
        try {
            const res = await axios.get('/api/v1/budgets');

            dispatch({
                type: 'GET_BUDGETS',
                payload: res.data.data
            });
        } catch (err) {
            dispatch({
                type: 'BUDGET_ERROR',
                payload: err.response?.data?.error || 'Unable to load budgets.'
            });
        }
    }

    async function getAccounts() {
        try {
            const res = await axios.get('/api/v1/accounts');

            dispatch({
                type: 'GET_ACCOUNTS',
                payload: res.data.data
            });
        } catch (err) {
            dispatch({
                type: 'ACCOUNT_ERROR',
                payload: err.response?.data?.error || 'Unable to load accounts.'
            });
        }
    }

    async function getCategories() {
        try {
            const res = await axios.get('/api/v1/categories');

            dispatch({
                type: 'GET_CATEGORIES',
                payload: res.data.data
            });
        } catch (err) {
            dispatch({
                type: 'CATEGORY_ERROR',
                payload: err.response?.data?.error || 'Unable to load categories.'
            });
        }
    }

    async function addCategory(category) {
        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        }

        try {
            const res = await axios.post('/api/v1/categories', category, config);

            dispatch({
                type: 'ADD_CATEGORY',
                payload: res.data.data
            });
        } catch (err) {
            dispatch({
                type: 'CATEGORY_ERROR',
                payload: err.response?.data?.error || 'Unable to add the category.'
            });
        }
    }

    async function updateCategory(id, category) {
        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        }

        try {
            const res = await axios.put(`/api/v1/categories/${id}`, category, config);

            dispatch({
                type: 'UPDATE_CATEGORY',
                payload: res.data.data
            });
        } catch (err) {
            dispatch({
                type: 'CATEGORY_ERROR',
                payload: err.response?.data?.error || 'Unable to update the category.'
            });
        }
    }

    async function deleteCategory(id) {
        try {
            await axios.delete(`/api/v1/categories/${id}`);

            dispatch({
                type: 'DELETE_CATEGORY',
                payload: id
            });
        } catch (err) {
            dispatch({
                type: 'CATEGORY_ERROR',
                payload: err.response?.data?.error || 'Unable to delete the category.'
            });
        }
    }

    async function addAccount(account) {
        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        }

        try {
            const res = await axios.post('/api/v1/accounts', account, config);

            dispatch({
                type: 'ADD_ACCOUNT',
                payload: res.data.data
            });
        } catch (err) {
            dispatch({
                type: 'ACCOUNT_ERROR',
                payload: err.response?.data?.error || 'Unable to add the account.'
            });
        }
    }

    async function updateAccount(id, account) {
        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        }

        try {
            const res = await axios.put(`/api/v1/accounts/${id}`, account, config);

            dispatch({
                type: 'UPDATE_ACCOUNT',
                payload: res.data.data
            });
        } catch (err) {
            dispatch({
                type: 'ACCOUNT_ERROR',
                payload: err.response?.data?.error || 'Unable to update the account.'
            });
        }
    }

    async function deleteAccount(id) {
        try {
            await axios.delete(`/api/v1/accounts/${id}`);

            dispatch({
                type: 'DELETE_ACCOUNT',
                payload: id
            });
        } catch (err) {
            dispatch({
                type: 'ACCOUNT_ERROR',
                payload: err.response?.data?.error || 'Unable to delete the account.'
            });
        }
    }

    async function getUserProfile() {
        try {
            const res = await axios.get('/api/v1/me');

            dispatch({
                type: 'GET_USER_PROFILE',
                payload: res.data.data
            });
        } catch (err) {
            dispatch({
                type: 'PROFILE_ERROR',
                payload: err.response?.data?.error || 'Unable to load user settings.'
            });
        }
    }

    async function updateUserProfile(settings) {
        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        }

        try {
            const res = await axios.put('/api/v1/me', settings, config);

            dispatch({
                type: 'UPDATE_USER_PROFILE',
                payload: res.data.data
            });
        } catch (err) {
            dispatch({
                type: 'PROFILE_ERROR',
                payload: err.response?.data?.error || 'Unable to update user settings.'
            });
        }
    }

    async function addBudget(budget) {
        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        }

        try {
            const res = await axios.post('/api/v1/budgets', budget, config);

            dispatch({
                type: 'ADD_BUDGET',
                payload: res.data.data
            });
        } catch (err) {
            dispatch({
                type: 'BUDGET_ERROR',
                payload: err.response?.data?.error || 'Unable to add the budget.'
            });
        }
    }

    async function updateBudget(id, budget) {
        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        }

        try {
            const res = await axios.put(`/api/v1/budgets/${id}`, budget, config);

            dispatch({
                type: 'UPDATE_BUDGET',
                payload: res.data.data
            });
        } catch (err) {
            dispatch({
                type: 'BUDGET_ERROR',
                payload: err.response?.data?.error || 'Unable to update the budget.'
            });
        }
    }

    async function deleteBudget(id) {
        try {
            await axios.delete(`/api/v1/budgets/${id}`);

            dispatch({
                type: 'DELETE_BUDGET',
                payload: id
            });
        } catch (err) {
            dispatch({
                type: 'BUDGET_ERROR',
                payload: err.response?.data?.error || 'Unable to delete the budget.'
            });
        }
    }

    return (<GlobalContext.Provider value={{
        accounts: state.accounts,
        categories: state.categories,
        transactions: state.transactions,
        goals: state.goals,
        budgets: state.budgets,
        userProfile: state.userProfile,
        error: state.error,
        loading: state.loading,
        getTransactions,
        deleteTransaction,
        addTransaction,
        getGoals,
        addGoal,
        updateGoal,
        deleteGoal,
        getBudgets,
        addBudget,
        updateBudget,
        deleteBudget,
        getAccounts,
        addAccount,
        updateAccount,
        deleteAccount,
        getCategories,
        addCategory,
        updateCategory,
        deleteCategory,
        getUserProfile,
        updateUserProfile
    }}>
        {children}
    </GlobalContext.Provider>)
}
