const multer = require('multer'); // Multer : Gestion des fichiers entrants

// Déclaration des extensions de fichiers autorisées

const MIME_TYPES = { 
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif' : 'gif'
};

// Configuration de Multer 

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_').substr(0,3);
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + '-' + Date.now() + '.' + extension);
    }
});

module.exports = multer({storage: storage}).single('image');