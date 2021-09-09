
const Post = require('../models/post')
const User = require('../models/user')
const Comment = require('../models/comment')

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

exports.getAuthorInfo = (async (req, res) => {
    try {
        const user = await User.findOne({ 
            where: { id: req.query.id }, 
            attributes: { exclude: ['id', 'password', 'email', 'description', 'role', 'createdAt', 'updatedAt']}
        })
        res.status(200).json(user)
    } catch (e) {
        return res.status(401).send({
            error: e
        })
    }
})

exports.getAllPostsFrom = (async (req, res, next) => {
    try {
        await Post.sync()
        const posts = await Post.findAll({ 
            where: { user_id: req.query.id },
            order: [
                ['id', 'DESC']
            ]
        })
        res.status(200).json(posts)
    } 
    catch (error) { res.status(400).json({ error: error }) };
});

exports.getOnePost = (async (req, res, next) => {
    try {
        const post = await Post.findOne({ where: { id: req.query.id }})
        const user = await User.findOne({ 
            where: { id: post.user_id }, 
            attributes: { exclude: ['id', 'password', 'email', 'description', 'role', 'createdAt', 'updatedAt']}
        })
        const data = {user, post}
        res.status(200).json(data)
    } 
    catch (error) { res.status(400).json({ error: error }) }
});

exports.deletePost = (async (req, res, next) => {
    try {

        const post = await Post.findOne({
            where: { id: req.query.id }
        })

        await post.destroy()

        res.status(200).json({
            res: req.query.id
        })
    } 
    catch (error) { res.status(400).json({ error: error }) }
});

exports.deleteAllPostsFromUser = (async (req, res, next) => {
    try { 

        const posts = await Post.findAll({ 
            where: { user_id: req.query.id },
        })

        posts.forEach(async (post) => {
            
            await post.destroy()

        })

        res.status(201).json({
            message: 'Publications supprimées.'
        })
    } 
    catch (error) { 
        res.status(400).json({ 
            error: error,
            message: 'Impossible de supprimer les publications.'
        }) 
    };
});