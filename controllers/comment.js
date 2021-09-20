
const fs = require('fs') // Module : gestion des fichiers

const Comment = require('../models/comment') // Modèle : commentaire

exports.createComment = (async (req, res, next) => {
    try {
        
        if (req.body.content == '') { // Vérification : Donnée entrante null
            res.status(400).json({ 
                message: 'Un commentaire ne peut pas être vide.'
            }) 
        }

        await Comment.create({  // Création : commentaire
            comment_content: req.body.content,
            comment_media: req.body.content && req.file
                ? `images/${req.file.filename}`
                : null,
            user_id: req.body.user_id,
            post_id: req.body.post_id
        })
        res.status(201).json({
            message: 'Commentaire publié.'
        })
    } 
    catch (error) { 
        res.status(400).json({ 
            message: 'Impossible de publier le commentaire.'
        }) 
    };
});

exports.getAllCommentsFromPost = (async (req, res, next) => {
    try {
        const comments = await Comment.findAll({  // Récupération : tous les commentaires d'une publication
            where: { post_id: req.query.id }, 
            order: [
                ['id', 'DESC']
            ]
        })
        res.status(200).json(comments)
    } 
    catch (error) { res.status(400).json({ 
        message: 'Impossible de récupérer les commentaires.'
    }) };
});

exports.getAllCommentsFromUser = (async (req, res, next) => { 
    try {
        const comments = await Comment.findAll({ // Récupération : Tous les commentaires d'un utilisateur
            where: { user_id: req.query.id },
            order: [
                ['id', 'DESC']
            ]
        })
        res.status(200).json(comments)
    } 
    catch (error) { res.status(400).json({ message: 'Impossible de récupérer les commentaires de l\'utilisateur.', }) };
});

exports.deleteAllCommentsFromUser = (async (req, res, next) => {
    try {
        const comments = await Comment.findAll({ // Récupération : Tous les commentaires d'un utilisateur
            where: { user_id: req.query.id },
        })

        comments.forEach(async (comment) => {
            comment.comment_media 
            ? fs.unlink(comment.comment_media, () => { // Suppression : image si présente, puis commentaire
                comment.destroy()
            })
            : comment.destroy()
        })

        res.status(201).json({
            message: 'Commentaires supprimés.'
        })
    } 
    catch (error) { 
        res.status(400).json({ 
            message: 'Impossible de supprimer les commentaires.'
        }) 
    };
});

exports.deleteAllCommentsFromPost = (async (req, res, next) => { 
    try {
        const comments = await Comment.findAll({ // Récupération : tous les commentaires d'une publication
            where: { post_id: req.query.id }
        })

        comments.forEach( async (comment) => {
            comment.comment_media 
            ? fs.unlink(comment.comment_media, () => { // Suppression : image si présente, puis commentaire
                comment.destroy()
            })
            : comment.destroy()
        })

        res.status(200).json({
            message: 'Commentaires supprimés.'
        })
    } 
    catch (error) { res.status(400).json({ message: 'Impossible de supprimer les commentaires.' }) }
});

exports.deleteComment = (async (req, res, next) => {
    try {

        const comment = await Comment.findOne({ // Récupération : commentaire selon identifiant
            where: { id: req.query.id }
        })

        comment.comment_media 
            ? fs.unlink(comment.comment_media, () => { // Suppression : image si présente, puis commentaire
                comment.destroy()
            })
            : comment.destroy()

        res.status(200).json({
            message: 'Commentaire supprimé.'
        })
    } 
    catch (error) { res.status(400).json({ message: 'Impossible de supprimer le commentaire.' }) }
});