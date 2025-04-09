const Router = require('express').Router()
const {getNotifications,postNotification} = require('../controllers/notificationController')
const isAuth = require('../middlewares/isAuth')


Router.post('/', isAuth, postNotification)
Router.get('/',isAuth,getNotifications)

module.exports = Router;