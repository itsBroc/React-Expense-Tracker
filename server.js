const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');
const connectDB = require('./config/db');

dotenv.config({ path: './config/config.env'});

connectDB();

const transactions = require('./routes/transactions');
const goals = require('./routes/goals');
const budgets = require('./routes/budgets');
const accounts = require('./routes/accounts');
const categories = require('./routes/categories');
const userProfile = require('./routes/userProfile');
const { protect } = require('./middleware/auth');

const app = express();

app.use(express.json());

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

app.use('/api/v1/transactions', protect, transactions);
app.use('/api/v1/goals', protect, goals);
app.use('/api/v1/budgets', protect, budgets);
app.use('/api/v1/accounts', protect, accounts);
app.use('/api/v1/categories', protect, categories);
app.use('/api/v1/me', protect, userProfile);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));
