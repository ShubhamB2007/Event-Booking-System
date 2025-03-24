const express = require('express')
const router = express.Router()
const signUpController = require('../controllers/signup')

router.post('/signup', signUpController.createUser)

module.exports = router