const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Budget = require('../models/Budget');
const Goal = require('../models/Goal');
const Transaction = require('../models/Transaction');
const { buildBackfillUpdates } = require('../utils/moneyBackfill');
const { normalizeBudgetInput, normalizeGoalInput, normalizeTransactionInput } = require('../utils/money');

dotenv.config({ path: './config/config.env' });

const shouldApply = process.argv.includes('--apply');

async function backfillCollection({ name, model, filter, normalize, fields }) {
    const records = await model.find(filter);
    let changed = 0;
    let skipped = 0;

    for (const record of records) {
        try {
            const updates = buildBackfillUpdates(record.toObject(), normalize, fields);

            if (Object.keys(updates).length === 0) {
                skipped += 1;
                continue;
            }

            changed += 1;

            if (shouldApply) {
                await model.updateOne({ _id: record._id }, { $set: updates }, { runValidators: true });
            }
        } catch (error) {
            skipped += 1;
            console.warn(`${name}: skipped ${record._id} (${error.message})`);
        }
    }

    console.log(`${name}: ${records.length} candidates, ${changed} ${shouldApply ? 'updated' : 'would update'}, ${skipped} skipped`);
}

async function run() {
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI is required in config/config.env');
    }

    await mongoose.connect(process.env.MONGO_URI);

    await backfillCollection({
        name: 'transactions',
        model: Transaction,
        filter: {
            amount: { $exists: true },
            amountMinor: { $exists: false }
        },
        normalize: normalizeTransactionInput,
        fields: ['amount', 'amountMinor', 'currency']
    });

    await backfillCollection({
        name: 'budgets',
        model: Budget,
        filter: {
            limit: { $exists: true },
            limitMinor: { $exists: false }
        },
        normalize: normalizeBudgetInput,
        fields: ['limit', 'limitMinor', 'currency']
    });

    await backfillCollection({
        name: 'goals',
        model: Goal,
        filter: {
            $or: [
                { target: { $exists: true }, targetAmountMinor: { $exists: false } },
                { current: { $exists: true }, currentAmountMinor: { $exists: false } }
            ]
        },
        normalize: normalizeGoalInput,
        fields: ['target', 'targetAmountMinor', 'current', 'currentAmountMinor', 'currency']
    });

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
