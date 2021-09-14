const bcrypt = require('bcrypt') // bcrypt : hash mots de passe
const jwt = require('jsonwebtoken') //jwt : token d'authentification
const fs = require('fs');

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
        return res.status(200).json({  message: 'Utilisateur inscrit.' })
    } 
    catch (error) { return res.status(400).json({  message: 'Imposssible d\'inscrire l\'utilisateur.' })}
})

exports.login = (async (req, res) => {
        
    const user = await User.findOne({ where: { email: req.body.email }})
        
    if (!user) {
        return res.status(404).send({
            message: 'Identifiants inexistants, vérifiez la saisie.'
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

exports.getUserData = (async (req, res) => {
    try {

        const cookie = req.cookies['jwt']

        const claims = jwt.verify(cookie, "secret")

        const user = await User.findOne({ where: { id: claims.id }})

        const {password, ...data} = await user.toJSON()

        res.send(data)

    } catch (e) {
        return res.status(401).send({
            message: 'Impossible de récupérer les donénes de l\'utilisateur.',
        })
    }
})

exports.verifyOwner = (async (req, res) => {
    try {

        const cookie = req.cookies['jwt']

        const claims = jwt.verify(cookie, "secret")

        const user = await User.findOne({ where: { id: claims.id }})

        if (user.id != req.query.id && user.role != 'moderator') {
            return res.status(401).send()
        } 
        
        return res.status(200).send()

    } catch (e) {
        return res.status(401).send()
    }
})

exports.logout = ((req, res) => {
    res.cookie('jwt', '', {maxAge: 0})

    res.send({ message: 'Déconnexion réussie, redirection...' })
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
            message: 'Impossible de récupérer le profil de l\'utilisateur.'
        }) 
    };
})

exports.changeProfilePicture = (async (req, res, next) => {
    try {
        
        const user = await User.findOne({ 
            where: { name: req.query.username }
        })

        user.imageUrl 
            ? fs.unlink(user.imageUrl, () => {})
            : null
        
        user.imageUrl = req.file
            ? `images/${req.file.filename}`
            : null
            
        await user.save()
        
        res.status(201).json({
            message: 'Photo de profil modifiée.',
        })
    } 
    catch (error) { 
        res.status(400).json({ 
            message: 'Impossible de modifier la photo de profil.'
        }) 
    };
});

exports.changeProfileBanner = (async (req, res, next) => {
    try {
        
        const user = await User.findOne({ 
            where: { name: req.query.username }
        })

        user.bannerUrl 
            ? fs.unlink(user.bannerUrl, () => {})
            : null
        
        user.bannerUrl = req.file
            ? `images/${req.file.filename}`
            : null
            
        await user.save()
        
        res.status(201).json({
            message: 'Bannière modifiée.',
        })
    } 
    catch (error) { 
        res.status(400).json({ 
            message: 'Impossible de modifier la photo de profil.'
        }) 
    };
});

exports.updateProfile = (async (req, res, next) => {
    try {
        
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

exports.deleteProfile = (async (req, res, next) => {
    try { 

        const cookie = req.cookies['jwt']

        const claims = jwt.verify(cookie, "secret")

        const userRequesting = await User.findOne({ where: { id: claims.id } })
        
        const userToDelete = await User.findOne({ where: { id: req.query.id } })

        if(userToDelete.imageUrl) {
            fs.unlink(userToDelete.imageUrl, () => {})
        }

        if(userToDelete.bannerUrl) {
            fs.unlink(userToDelete.bannerUrl, () => {})
        }
        
        switch (userRequesting.role) {
            case 'moderator':
                userToDelete.destroy()
                    .then(() => res.status(201).json({ 
                        message: 'Utilisateur supprimé.',
                        role: 'moderator'
                    }))
                    .catch(error => res.status(400).json({ error }));
                break
            case 'user':
                userToDelete.destroy()
                    .then(() => {
                        res.cookie('jwt', '', {maxAge: 0})
                        res.status(201).json({ 
                            message: 'Utilisateur supprimé.',
                            role: 'user'
                        })
                    })
                    .catch(error => res.status(400).json({ error }));
                break
        }      
    } 
    catch (error) { 
        res.status(400).json({ 
            error: error,
            message: 'Impossible de supprimer le profil.'
        }) 
    };
});