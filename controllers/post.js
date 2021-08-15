const Post = require('../models/post');

exports.createPost = (async (req, res, next) => {
    try {
        await Post.sync();
        const newPost = await Post.create({ post_title: "Une publication", post_content: "Et son contenu", user_id: "1" })
        res.status(201).json({
            message: 'Nouveau post enregistré !',
            post_id: newPost.id,
            post_title: newPost.post_title,
            post_content: newPost.post_content,
            user_id: newPost.user_id
        })
    } 
    catch (error) { res.status(400).json({ error: error }) };
});

exports.getAllPosts = (async (req, res, next) => {
    try {
        const posts = await Post.findAll({ })
        res.status(201).json(posts)
    } 
    catch (error) { res.status(400).json({ error: error }) };
});