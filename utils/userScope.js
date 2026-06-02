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

exports.withUser = (req, body) => ({
    ...body,
    userId: req.user.id
});
