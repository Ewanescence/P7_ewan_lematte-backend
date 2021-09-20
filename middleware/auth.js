const jwt = require('jsonwebtoken'); // Module : Token Web

const User = require('../models/user'); // Modèle : utilisateur

module.exports = (async (req, res, next) => {
    try {

        const cookie = req.cookies['jwt']

        const claims = jwt.verify(cookie, "secret") // Vérification : Cookie

        if (!claims) {
            return res.status(401).send({
                message: 'Vous devez être connecté pour cela.'
            })
        }

        await User.findOne({ where: { id: claims.id }}) // Récupération : Utilisateur selon cookie

        next()

    } catch (e) {
        return res.status(401).send({
            message: 'Vous devez être connecté pour cela.'
        })
    }
})
