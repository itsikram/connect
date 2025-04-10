const Router = require('express').Router()
const {getNotifications,postNotification,notificationView} = require('../controllers/notificationController')
const isAuth = require('../middlewares/isAuth')


Router.post('/',isAuth, postNotification)
Router.post('/view',isAuth, notificationView)
Router.get('/',getNotifications)

module.exports = Router;