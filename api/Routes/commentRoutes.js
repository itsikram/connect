const Router = require('express').Router()
const isAuth = require('../middlewares/isAuth')
const {postAddComment,postDelete, postDeleteComment} = require('../controllers/commentController')
const uploadAttachment = require('../middlewares/photosUpload')

Router.post('/addComment',isAuth,uploadAttachment.single('attachment'),postAddComment)
Router.post('/deleteComment',isAuth,postDeleteComment);

module.exports = Router;