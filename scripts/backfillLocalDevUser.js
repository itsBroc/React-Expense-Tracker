const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Budget = require('../models/Budget');
const Goal = require('../models/Goal');
const Transaction = require('../models/Transaction');

dotenv.config({ path: './config/config.env' });

const legacyUserId = process.env.MIGRATION_USER_ID || 'local-dev-user';
const shouldApply = process.argv.includes('--apply');

const models = [
    { name: 'transactions', model: Transaction },
    { name: 'goals', model: Goal },
    { name: 'budgets', model: Budget }
];

async function run() {
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI is required in config/config.env');
    }

    await mongoose.connect(process.env.MONGO_URI);

    for (const { name, model } of models) {
        const filter = { userId: { $exists: false } };
        const count = await model.countDocuments(filter);

        console.log(`${name}: ${count} legacy records without userId`);

        if (shouldApply && count > 0) {
            const result = await model.updateMany(filter, {
                $set: { userId: legacyUserId }
            });

            console.log(`${name}: backfilled ${result.modifiedCount} records to ${legacyUserId}`);
        }
    }

    if (!shouldApply) {
        console.log('Dry run only. Re-run with --apply to update records.');
    }

    await mongoose.disconnect();
}

run().catch(async error => {
    console.error(`Migration failed: ${error.message}`);
    await mongoose.disconnect();
    process.exit(1);
});
