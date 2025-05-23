const Router = require('express').Router()
const isAuth = require('../middlewares/isAuth')
const {addMessageReact,removeMessageReact,getMedia} = require('../controllers/messageController')
const uploadAttachment = require('../middlewares/photosUpload')


Router.post('/addReact',isAuth,addMessageReact);
Router.get('/media',isAuth,getMedia);
Router.post('/removeReact',isAuth,removeMessageReact);


module.exports = Router;