const express = require('express')
const router = express.Router()

const UserController = require('../controllers/UserController.js'); 

router.get('/', UserController.index)
router.patch('/', UserController.update)
router.delete('/', UserController.destroy)

module.exports = router