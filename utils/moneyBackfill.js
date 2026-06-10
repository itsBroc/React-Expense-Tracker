function buildBackfillUpdates(record, normalize, fields) {
    const normalized = normalize(record);

    return fields.reduce((updates, field) => {
        if (normalized[field] !== undefined && record[field] !== normalized[field]) {
            updates[field] = normalized[field];
        }

        return updates;
    }, {});
}

module.exports = {
    buildBackfillUpdates
};
