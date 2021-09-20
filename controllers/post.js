const fs = require('fs'); // Module : Gestion fichiers

const Post = require('../models/post') // Modèle : publication
const User = require('../models/user') // Modèle : utilisateur

exports.createPost = (async (req, res, next) => {
    try {

        if (req.body.content == '') { // Vérification : Donnée nulle
            res.status(400).json({ 
                message: 'Une publication ne peut pas être vide.'
            }) 
        }

        await Post.create({  // Création : Publication
            post_content: req.body.content,
            post_media: req.body.content && req.file
                ? `images/${req.file.filename}`
                : null,
            user_id: req.body.user_id
        })
        res.status(201).json({
            message: 'Publication partagée.',
        })
    } 
    catch (error) { 
        res.status(400).json({ 
            message: 'Impossible de partager la publication.',
        }) 
    };
});


exports.getAllPosts = (async (req, res, next) => {
    try {
        const posts = await Post.findAll({  // Récupération : toutes les publications
            order: [
                ['id', 'DESC']
            ]
        })

        res.status(200).json(posts)
    } 
    catch (error) { res.status(400).json({ message: 'Impossible de récupérer les publications.', }) };
});

exports.getAuthorInfo = (async (req, res) => {
    try {
        const user = await User.findOne({  // Récupération : utilisateur à l'origine de la publication
            where: { id: req.query.id }, 
            attributes: { exclude: ['id', 'password', 'email', 'description', 'role', 'createdAt', 'updatedAt']}
        })
        res.status(200).json(user)
    } catch (error) {
        return res.status(401).send({
            message: 'Impossible de récupérer les informations de l\'auteur.',
        })
    }
})

exports.getAllPostsFrom = (async (req, res, next) => {
    try {
        const posts = await Post.findAll({ // Récupération : toutes les publications de l'utilisateur
            where: { user_id: req.query.id },
            order: [
                ['id', 'DESC']
            ]
        })
        res.status(200).json(posts)
    } 
    catch (error) { res.status(400).json({ message: 'Impossible de récupérer les publications de l\'utilisateur.', }) };
});

exports.getOnePost = (async (req, res, next) => {
    try {
        const post = await Post.findOne({ where: { id: req.query.id }}) // Récupération : publication unique
        const user = await User.findOne({ 
            where: { id: post.user_id }, 
            attributes: { exclude: ['id', 'password', 'email', 'description', 'role', 'createdAt', 'updatedAt']}
        })
        const data = {user, post}
        res.status(200).json(data)
    } 
    catch (error) { res.status(400).json({ message: 'Impossible de récupérer la publication.' }) }
});

exports.deletePost = (async (req, res, next) => { 
    try {

        const post = await Post.findOne({ where: { id: req.query.id } }) // Récupération : publication selon identifiant

        post.post_media 
            ? fs.unlink(post.post_media, () => { // Suppression : image si présente
                
            })
            : post.destroy() // Suppression : publication
                .then(() => res.status(201).json({ message: 'Publication supprimée.' }))
    } 
    catch (error) { res.status(400).json({ message: 'Imposssible de supprimer la publication.' }) }
});

exports.deleteAllPostsFromUser = (async (req, res, next) => {
    try { 

        const posts = await Post.findAll({  // Récupération : toutes les publications d'un utilisateur
            where: { user_id: req.query.id },
        })

        posts.forEach((post) => {

            post.post_media 
            ? fs.unlink(post.post_media, () => { // Suppression : image si présente, puis publication
                post.destroy()
            })
            : post.destroy()

        })

        res.status(201).json({
            message: 'Publications supprimées.'
        })
    } 
    catch (error) { 
        res.status(400).json({ 
            message: 'Impossible de supprimer les publications.'
        }) 
    };
});