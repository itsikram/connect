const Router = require('express').Router()
const {createWatch,deleteWatch,getMyWatchs,getProfileWatch, getSingleWatch} = require('../controllers/watchController')
const photosUpload = require('../middlewares/photosUpload')
const isAuth = require('../middlewares/isAuth')

Router.post('/create',isAuth,createWatch)
Router.post('/delete', isAuth, deleteWatch)
Router.get('/myWatchs',isAuth,getMyWatchs)
Router.get('/profileWatch',getProfileWatch)
Router.get('/single',getSingleWatch)

module.exports = Router;

