const Router = require("express").Router();
const {signUp,login,changePass,deleteAccount} = require('../controllers/authControllers')
const isAuth = require('../middlewares/isAuth')

Router.post('/signup',signUp)
Router.post('/login',login)
Router.post('/delete',deleteAccount)
Router.post('/changePass',isAuth,changePass)

module.exports = Router;