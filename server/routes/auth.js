const express = require('express')
const router  = express.Router()

const AuthController = require('.../controller/AuthController')

router.post('/register', AuthController.register)

module.exports = router