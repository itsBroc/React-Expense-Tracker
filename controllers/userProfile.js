const UserProfile = require('../models/UserProfile');

const editableFields = [
    'baseCurrency',
    'locale',
    'timezone',
    'monthStartDay',
    'theme',
    'onboardingComplete'
];

function buildProfileDefaults(req) {
    return {
        userId: req.user.id,
        authMode: req.user.mode,
        email: req.user.email,
        name: req.user.name,
        baseCurrency: 'AUD',
        locale: 'en-AU',
        timezone: 'Australia/Sydney',
        monthStartDay: 1,
        theme: 'system',
        onboardingComplete: false
    };
}

function pickEditableSettings(body) {
    return editableFields.reduce((settings, field) => {
        if (Object.prototype.hasOwnProperty.call(body, field)) {
            settings[field] = body[field];
        }

        return settings;
    }, {});
}

function sendValidationError(error, res) {
    const messages = Object.values(error.errors).map(val => val.message);

    return res.status(400).json({
        success: false,
        error: messages
    });
}

exports.getUserProfile = async (req, res) => {
    try {
        let profile = await UserProfile.findOne({ userId: req.user.id });

        if (!profile) {
            profile = await UserProfile.create(buildProfileDefaults(req));
        } else {
            profile.authMode = req.user.mode;
            profile.email = req.user.email;
            profile.name = req.user.name;
            await profile.save();
        }

        return res.status(200).json({
            success: true,
            data: profile
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return sendValidationError(error, res);
        }

        return res.status(500).json({
            success: false,
            error: 'server error'
        });
    }
};

exports.updateUserProfile = async (req, res) => {
    try {
        const updates = pickEditableSettings(req.body);
        let profile = await UserProfile.findOne({ userId: req.user.id });

        if (!profile) {
            profile = new UserProfile(buildProfileDefaults(req));
        }

        Object.assign(profile, updates, {
            authMode: req.user.mode,
            email: req.user.email,
            name: req.user.name
        });

        await profile.save();

        return res.status(200).json({
            success: true,
            data: profile
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return sendValidationError(error, res);
        }

        return res.status(500).json({
            success: false,
            error: 'server error'
        });
    }
};
