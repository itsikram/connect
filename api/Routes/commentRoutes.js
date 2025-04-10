const Router = require('express').Router()
const isAuth = require('../middlewares/isAuth')
const {postAddComment,postDelete, postDeleteComment,addCommentReact,removeCommentReact,postCommentReply,removeCommentReply,addReplyReact,removeReplyReact} = require('../controllers/commentController')
const uploadAttachment = require('../middlewares/photosUpload')

Router.post('/addComment',isAuth,uploadAttachment.single('attachment'),postAddComment)
Router.post('/deleteComment',isAuth,postDeleteComment);
Router.post('/addReact',isAuth,addCommentReact);
Router.post('/addReply',isAuth,postCommentReply);
Router.post('/deleteReply',isAuth,removeCommentReply);
Router.post('/removeReact',isAuth,removeCommentReact);
Router.post('/reply/addReact',isAuth,addReplyReact);
Router.post('/reply/removeReact',isAuth,removeReplyReact);



module.exports = Router;