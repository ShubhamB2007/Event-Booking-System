const express = require('express')
const cors = require('cors')
const router = express.Router()

const {login} = require('../controllers/login')
const { googleLogin } = require('../controllers/googleAuth')

router.use(cors())

router.post('/login', login)
router.post('/login/google', googleLogin)

module.exports = router;