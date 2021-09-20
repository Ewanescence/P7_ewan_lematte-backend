const bcrypt = require('bcrypt') // bcrypt : hash mots de passe
const jwt = require('jsonwebtoken') //jwt : token d'authentification
const fs = require('fs'); //fs : gestion fichiers

const User = require('../models/user'); // model : utilisateur

// Règles email & mot de passe
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!.@#$%^&*])(?=.{8,})/;

exports.register = (async (req, res) => {
    try {
        
        if (req.body.name == null || req.body.email == null || req.body.password == null) {
            return res.status(400).json({  message: 'Les champs sont obligatoires.' })
        } // Vérification : données nulles

        if (!EMAIL_REGEX.test(req.body.email)) {
            return res.status(400).json({ message: "Format d'e-mail invalide." });
        } // Vérification : règle mail

        if (!PASSWORD_REGEX.test(req.body.password)) {
            return res.status(401).json({
              message:
                "Format: 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial(!.@#$%^&*)",
            });
        } // Vérification : règle mot de passe

        const hashed = await bcrypt.hash(req.body.password, 10) // Hashage du mot de passe entrant
        const newUser = await User.create({ // Création d'un utilisateur
            name: req.body.name, 
            email: req.body.email, 
            password: hashed // Récupération mot de passe hashé
        })
        return res.status(200).json({  message: 'Utilisateur inscrit.' })
    } 
    catch (error) { return res.status(400).json({  message: 'Imposssible d\'inscrire l\'utilisateur.' })}
})

exports.login = (async (req, res) => {

    if (req.body.email == null || req.body.password == null) {
        return res.status(400).json({  message: 'Les champs sont obligatoires.' })
    } // Vérification : données nulles
        
    const user = await User.findOne({ where: { email: req.body.email }}) // Récupération : utilisateur selon e-mail
        
    if (!user) {
        return res.status(404).send({
            message: 'Identifiants inexistants, vérifiez la saisie.'
        })
    } // Vérification : utilisateur inexistant

    if (!await bcrypt.compare(req.body.password, user.password)) {
        return res.status(400).send({
                message: 'Mot de passe invalide.'
        })
    } // Comparaison : mot de passe hashé en base de données et du mot de passe entrant

    const token = jwt.sign({id: user.id}, "secret")

    res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    }) // Définition : cookie

    res.send({
        message: 'Connexion réussie, redirection...'
    })
})

exports.getUserData = (async (req, res) => {
    try {

        const cookie = req.cookies['jwt']

        const claims = jwt.verify(cookie, "secret") // Vérification : cookie

        const user = await User.findOne({ 
            where: { id: claims.id },
            attributes: { exclude: ['id', 'password', 'email', 'description', 'role', 'createdAt', 'updatedAt']}
        }) // Récupération : données utilisateur via cookie

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

        const claims = jwt.verify(cookie, "secret") // Vérification : cookie

        const user = await User.findOne({ where: { id: claims.id }}) // Récupération : utilisateur selon cookie

        if (user.id != req.query.id && user.role != 'moderator') {
            return res.status(401).send()
        } // Autorisation : si propriétaire de la publication/commentaire/profil ou modérateur
        
        return res.status(200).send()

    } catch (e) {
        return res.status(401).send()
    }
})

exports.logout = ((req, res) => {
    res.cookie('jwt', '', {maxAge: 0}) // Désinscription : cookie

    res.send({ message: 'Déconnexion réussie, redirection...' })
})

exports.getProfile = (async (req, res, next) => {
    try {
        const user = await User.findOne({ 
            where: { name: req.query.username }
        }) // Récupération : profil utilisateur selon nom utilisateur
        
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
        }) // Récupération : Profil selon nom d'utilisateur

        user.imageUrl // Vérification : présence image (si présente, suppression)
            ? fs.unlink(user.imageUrl, () => {}) 
            : null
        
        user.imageUrl = req.file // Vérification : présence image en requête
            ? `images/${req.file.filename}`
            : null
            
        await user.save() // Sauvegarde : utilisateur
        
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
        }) // Récupération : utilisateur selon nom utilisateur

        user.bannerUrl // Vérification : présence bannière base de données (si présente, suppression)
            ? fs.unlink(user.bannerUrl, () => {})
            : null
        
        user.bannerUrl = req.file   // Vérification : présence bannière requête
            ? `images/${req.file.filename}`
            : null
            
        await user.save() // Sauvegarde : utilisateur
        
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
        }) // Récupération : utilisateur selon identifiant

        user.description = req.body.description // Modification : description utilisateur
            
        await user.save() // Sauvegarde : profil utilisateur
        
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

        const claims = jwt.verify(cookie, "secret") // Vérification: Cookie

        const userRequesting = await User.findOne({ where: { id: claims.id } }) // Récupération : utilisateur selon cookie
        
        const userToDelete = await User.findOne({ where: { id: req.query.id } }) // Récupération : utilisateur selon requête

        if(userToDelete.imageUrl) {
            fs.unlink(userToDelete.imageUrl, () => {})
        } // Suppression : image de profil

        if(userToDelete.bannerUrl) {
            fs.unlink(userToDelete.bannerUrl, () => {})
        } // Suppression : bannière
        
        switch (userRequesting.role) { // Vérification : rôle auteur de la requête
            case 'moderator': 
                userToDelete.destroy() // Suppression : utilisateur
                    .then(() => res.status(201).json({ 
                        message: 'Utilisateur supprimé.',
                        role: 'moderator'
                    }))
                    .catch(error => res.status(400).json({ error }));
                break
            case 'user':
                userToDelete.destroy() // Suppression : utilisateur
                    .then(() => {
                        res.cookie('jwt', '', {maxAge: 0}) // Suppression : cookie
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