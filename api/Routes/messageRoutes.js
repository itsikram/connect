const Router = require('express').Router()
const isAuth = require('../middlewares/isAuth')
const {addMessageReact,removeMessageReact} = require('../controllers/messageController')
const uploadAttachment = require('../middlewares/photosUpload')


Router.post('/addReact',isAuth,addMessageReact);
Router.post('/removeReact',isAuth,removeMessageReact);


module.exports = Router;