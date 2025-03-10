const Router = require('express').Router()
const {uploadPost,getPost} = require('../controllers/uploadControllers')
const isAuth = require('../middlewares/isAuth')
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() }); // Create an endpoint for image upload 

Router.post('/', isAuth,upload.single('image'), uploadPost);

module.exports = Router;