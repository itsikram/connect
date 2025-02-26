const Router = require('express').Router()
const {profileGet,profilePost,updateBioPost,updateCoverPost,updateProfilePic} = require('../controllers/profileController')
const coverPicUpload = require('../middlewares/UploadCover')
const photosUpload = require('../middlewares/photosUpload')
const isAuth = require('../middlewares/isAuth')
const Profile = require('../models/Profile')

Router.get('/', profileGet)
Router.post('/',profilePost)
Router.post('/update/coverPic',coverPicUpload.single('coverPic'),isAuth,updateCoverPost)
Router.post('/update/profilePic',photosUpload.single('profilePic'),isAuth,updateProfilePic)
Router.post('/update/bio',isAuth,updateBioPost)

module.exports = Router;