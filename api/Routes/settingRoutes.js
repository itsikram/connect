const Router = require("express").Router();
const {addSetting,getSetting} = require('../controllers/settingsController')
const isAuth = require('../middlewares/isAuth')

Router.get('/',getSetting)
Router.post('/',isAuth, addSetting)

module.exports = Router;