const jwt = require('jsonwebtoken');

const User = require('../models/user');

module.exports = (async (req, res, next) => {
    try {

        const cookie = req.cookies['jwt']

        const claims = jwt.verify(cookie, "secret")

        if (!claims) {
            return res.status(401).send({
                message: 'Vous devez être connecté pour cela.'
            })
        }

        await User.findOne({ where: { id: claims.id }})

        next()

    } catch (e) {
        return res.status(401).send({
            message: 'Vous devez être connecté pour cela.'
        })
    }
})
