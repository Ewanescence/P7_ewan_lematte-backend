const User = require('../models/user');

exports.register = (async (req, res, next) => {
    try {
        await User.sync();
        const newUser = await User.create({ user_login: "ewanescence", user_email: "ewan@ewanescence.com", user_password: "slime91310" })
        res.status(201).json({
            message: 'Nouvel utilisateur enregistré !',
            user_id: newUser.id,
            user_login: newUser.user_login,
            user_mail: newUser.user_email,
            user_password: newUser.user_password,
            createdAt: newUser.createdAt,
            updatedAt: newUser.updatedAt
        })
    } 
    catch (error) { res.status(400).json({ error: error }) };
});