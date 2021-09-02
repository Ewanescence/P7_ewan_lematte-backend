
const Post = require('../models/post');

exports.createPost = (async (req, res, next) => {
    try {
        await Post.sync()
        await Post.create({ 
            post_content: req.body.content,
            post_media: req.body.content && req.file
                ? `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
                : null,
            user_id: req.body.user_id
        })
        res.status(201).json({
            message: 'Nouveau post enregistré !',
        })
    } 
    catch (error) { 
        res.status(400).json({ 
            error: error
        }) 
    };
});

exports.getAllPosts = (async (req, res, next) => {
    try {
        const posts = await Post.findAll({ 
            order: [
                ['id', 'DESC']
            ]
        })
        res.status(200).json(posts)
    } 
    catch (error) { res.status(400).json({ error: error }) };
});