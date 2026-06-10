const Category = require('../models/Category');
const { defaultCategories } = require('./categoryDefaults');
const { getUserFilter } = require('./userScope');

function normalizeCategoryInput(body = {}) {
    const category = {};

    if (Object.prototype.hasOwnProperty.call(body, 'name')) {
        category.name = String(body.name).trim();
    }

    if (Object.prototype.hasOwnProperty.call(body, 'type')) {
        category.type = body.type;
    }

    if (Object.prototype.hasOwnProperty.call(body, 'parentCategoryId')) {
        category.parentCategoryId = body.parentCategoryId || undefined;
    }

    if (Object.prototype.hasOwnProperty.call(body, 'icon')) {
        category.icon = String(body.icon).trim() || 'tag';
    }

    if (Object.prototype.hasOwnProperty.call(body, 'color')) {
        category.color = String(body.color).trim();
    }

    if (Object.prototype.hasOwnProperty.call(body, 'isArchived')) {
        category.isArchived = Boolean(body.isArchived);
    }

    return category;
}

async function ensureDefaultCategories(req) {
    const count = await Category.countDocuments(getUserFilter(req));

    if (count > 0) {
        return;
    }

    await Category.insertMany(defaultCategories.map(category => ({
        ...category,
        userId: req.user.id,
        isDefault: true
    })));
}

module.exports = {
    ensureDefaultCategories,
    normalizeCategoryInput
};
