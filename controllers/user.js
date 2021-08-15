const bcrypt = require('bcrypt') // bcrypt : hash mots de passe
const jwt = require('jsonwebtoken') //jwt : token d'authentification

const User = require('../models/user');

exports.register = (async (req, res) => {
    try {
        await User.sync()
        const hashed = await bcrypt.hash(req.body.password, 10)
        const newUser = await User.create({ 
            name: req.body.name, 
            email: req.body.email, 
            password: hashed
        })
        return res.status(200).json()
    } 
    catch (error) { return res.status(400).json({ error: error }) };
})

exports.login = (async (req, res) => {
        
    const user = await User.findOne({ where: { email: req.body.email }})
        
    if (!user) {
        return res.status(404).send({
            message: 'Utilisateur introuvable'
        })
    }

    if (!await bcrypt.compare(req.body.password, user.password)) {
        return res.status(400).send({
                message: 'Mot de passe incorrect'
        })
    }

    const token = jwt.sign({id: user.id}, "secret")

    res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    })

    res.send({
        message: 'success'
    })
})

exports.authenticate = (async (req, res) => {
    try {

        const cookie = req.cookies['jwt']
        console.log(cookie)

        const claims = jwt.verify(cookie, "secret")
        console.log(claims)

        if (!claims) {
            return res.status(401).send({
                message: 'unauthenticated'
            })
        }

        const user = await User.findOne({ where: { id: claims.id }})

        const {password, ...data} = await user.toJSON()

        res.send(data)
    } catch (e) {
        return res.status(401).send({
            message: 'unauthenticated',
            error: e
        })
    }
})

exports.logout = ((req, res) => {
    res.cookie('jwt', '', {maxAge: 0})

    res.send({
        message: 'success'
    })
})