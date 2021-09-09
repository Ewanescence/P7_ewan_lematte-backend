
const Comment = require('../models/comment');

exports.createComment = (async (req, res, next) => {
    try {
        await Comment.sync({ })
        await Comment.create({ 
            comment_content: req.body.content,
            comment_media: req.body.content && req.file
                ? `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
                : null,
            user_id: req.body.user_id,
            post_id: req.body.post_id
        })
        res.status(201).json({
            message: 'Nouveau commentaire enregistré !',
        })
    } 
    catch (error) { 
        res.status(400).json({ 
            error: error
        }) 
    };
});

exports.getAllCommentsFrom = (async (req, res, next) => {
    try {
        const comments = await Comment.findAll({ 
            where: { post_id: req.query.id }, 
            order: [
                ['id', 'DESC']
            ]
        })
        res.status(200).json(comments)
    } 
    catch (error) { res.status(400).json({ error: error }) };
});

exports.deleteAllCommentsFromUser = (async (req, res, next) => {
    try {
        const comments = await Comment.findAll({ 
            where: { user_id: req.query.id },
        })

        comments.forEach(async (comment) => {
            
            await comment.destroy()

        })

        res.status(201).json({
            message: 'Commentaires supprimés.'
        })
    } 
    catch (error) { 
        res.status(400).json({ 
            error: error,
            message: 'Impossible de supprimer les commentaires.'
        }) 
    };
});

exports.deleteAllCommentsFromPost = (async (req, res, next) => {
    try {
        const comments = await Comment.findAll({ 
            where: { post_id: req.query.id }
        })

        comments.forEach( async (comment) => {
            await comment.destroy()
        })

        res.status(200).json({
            res: req.query.id
        })
    } 
    catch (error) { res.status(400).json({ error: error }) }
});

exports.deleteComment = (async (req, res, next) => {
    try {

        const comment = await Comment.findOne({
            where: { id: req.query.id }
        })

        await comment.destroy()

        res.status(200).json({
            res: req.query.id
        })
    } 
    catch (error) { res.status(400).json({ error: error }) }
});