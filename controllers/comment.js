
const Comment = require('../models/comment');
const User = require('../models/user');

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

exports.getAllComments = (async (req, res, next) => {
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