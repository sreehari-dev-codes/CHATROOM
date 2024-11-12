const express = require("express")
const route = express.Router()
const controller = require("../controller/controller")
const userController = require("../controller/userController")
const {authenticate} = require("../middleware/auth")


route.get("/register",controller.register)
route.get("/login",controller.login)
route.get("/userChat",controller.userChat)

route.post("/register",userController.signUp)
route.post("/login",userController.signIn)

route.get("/chat",authenticate,userController.getUser)
route.post("/chatUser",userController.createChat)

module.exports = route

