const Router = require('express').Router()
const isAuth = require('../middlewares/isAuth')
const {postAddComment} = require('../controllers/commentController')
const uploadAttachment = require('../middlewares/photosUpload')

Router.post('/addComment',isAuth,uploadAttachment.single('attachment'),postAddComment)

module.exports = Router;