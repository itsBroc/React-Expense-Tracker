exports.getUserFilter = req => {
    if (req.user?.mode === 'local') {
        return {
            $or: [
                { userId: req.user.id },
                { userId: { $exists: false } }
            ]
        };
    }

    return { userId: req.user.id };
};

function stripOwnershipFields(body = {}) {
    const { userId, _id, id, ...safeBody } = body;

    return safeBody;
}

exports.withUser = (req, body) => ({
    ...stripOwnershipFields(body),
    userId: req.user.id
});

exports.stripOwnershipFields = stripOwnershipFields;
