const bcrypt = require('bcrypt') // bcrypt : hash mots de passe
const jwt = require('jsonwebtoken') //jwt : token d'authentification

const User = require('../models/user');

exports.register = (async (req, res, next) => {
    try {
        await User.sync()
        const hashed = await bcrypt.hash(req.body.password, 10)
        const newUser = await User.create({ 
            user_login: req.body.name, 
            user_email: req.body.email, 
            user_password: hashed
        })
        return res.status(200).json()
    } 
    catch (error) { return res.status(400).json({ error: error }) };
});

exports.login = (async (req, res, next) => {
    try {
        await User.sync()
        const userFound = await User.findOne({ 
            where: { user_email: req.body.email }
        })
        await bcrypt.compare(req.body.password, userFound.user_password)
        .then(valid => {
            if (valid) {
                return res.status(200).json({
                    user_id: userFound.id,
                    token: jwt.sign(
                        { user_id: userFound.id },
                        'RANDOM_TOKEN_SECRET',
                        { expiresIn: '24h' }
                    )
                })
            } else { return res.status(401).json({ error: 'Mot de passe incorrect' }); }
            
        })
    } 
    catch (error) { return res.status(400).json({ error: error }) };
});

exports.debug = (async (req, res, next) => {
    console.log(req.body)
    res.status(201).json({
        message: 'success'
    })
});