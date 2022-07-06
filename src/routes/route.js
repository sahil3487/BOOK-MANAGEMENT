const express = require("express");
const router = express.Router();
const userController = require('../controllers/userController')
const bookController = require('../controllers/bookController')
const middleware = require('../middlewares/auth')


//---------------[User APIs]
router.post("/register", userController.createUser)
router.post("/login", userController.loginUser)

//---------------[Book APIs]
router.post("/books",middleware.authenticate, bookController.createBook)



module.exports = router