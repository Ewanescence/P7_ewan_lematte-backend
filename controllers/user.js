const bcrypt = require('bcrypt') // bcrypt : hash mots de passe
const jwt = require('jsonwebtoken') //jwt : token d'authentification

const User = require('../models/user');

exports.register = (async (req, res) => {
    try {
        await User.sync({  })
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
            message: 'Compte inexistant.'
        })
    }

    if (!await bcrypt.compare(req.body.password, user.password)) {
        return res.status(400).send({
                message: 'Mot de passe invalide.'
        })
    }

    const token = jwt.sign({id: user.id}, "secret")

    res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    })

    res.send({
        message: 'Connexion réussie, redirection...'
    })
})

exports.authenticate = (async (req, res) => {
    try {

        const cookie = req.cookies['jwt']

        const claims = jwt.verify(cookie, "secret")

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

exports.getAuthorInfo = (async (req, res) => {
    try {
        const user = await User.findOne({ 
            where: { id: req.body.user_id }, 
            attributes: { exclude: ['id', 'password', 'email', 'description', 'role', 'createdAt', 'updatedAt']}
        })
        res.status(200).json(user)
    } catch (e) {
        return res.status(401).send({
            error: e
        })
    }
})

exports.getProfile = (async (req, res, next) => {
    try {
        const user = await User.findOne({ 
            where: { name: req.query.username }
        })
        
        res.send(user)
    } 
    catch (error) { 
        res.status(400).json({ 
            error: error
        }) 
    };
})

exports.changeProfilePicture = (async (req, res, next) => {
    try {
        const user = await User.findOne({ 
            where: { name: req.query.username }
        })
        
        user.imageUrl = req.file
            ? `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
            : null
            
        await user.save()
        
        res.status(201).json({
            message: 'Nouveau photo de profil !',
        })
    } 
    catch (error) { 
        res.status(400).json({ 
            error: error
        }) 
    };
});

exports.changeProfileBanner = (async (req, res, next) => {
    try {
        
        const user = await User.findOne({ 
            where: { name: req.query.username }
        })
        
        user.bannerUrl = req.file
            ? `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
            : null
            
        await user.save()
        
        res.status(201).json({
            message: 'Nouvelle bannière',
        })
    } 
    catch (error) { 
        res.status(400).json({ 
            error: error
        }) 
    };
});

exports.updateProfile = (async (req, res, next) => {
    try {
        
        console.log(req.body)

        const user = await User.findOne({ 
            where: { id: req.body.user_id }
        })

        user.description = req.body.description
            
        await user.save()
        
        res.status(201).json({
            message: 'Description mise à jour.'
        })
    } 
    catch (error) { 
        res.status(400).json({ 
            error: error,
            message: 'Impossible de mettre à jour la description.'
        }) 
    };
});