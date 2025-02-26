const Router = require("express").Router();
const {signUp,login} = require('../controllers/authControllers')


Router.post('/signup',signUp)
Router.post('/login',login)

module.exports = Router;