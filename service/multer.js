const multer = require('multer')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/user_img')
    },
    filename: function (req, file, cb) {
        let format = file.originalname.split('.');
        let name = format[0];
        format = format[format.length - 1];
        cb(null, name + '-' + Date.now() + "." + format)
    }
})

const upload = multer({
    storage: storage
})

module.exports = upload.single('avatar');