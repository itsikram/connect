const Router = require('express').Router()
const {createPost,deletePost,getMyPosts,getNewsFeed, getSinglePost} = require('../controllers/postController')
const photosUpload = require('../middlewares/photosUpload')
const isAuth = require('../middlewares/isAuth')


Router.post('/create',isAuth,photosUpload.single('photos'),createPost)
Router.post('/delete', isAuth, deletePost)
Router.get('/myPosts',isAuth,getMyPosts)
Router.get('/newsFeed',getNewsFeed)
Router.get('/single',getSinglePost)

module.exports = Router;