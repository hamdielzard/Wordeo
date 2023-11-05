const express = require('express')
const router = express.Router()

const createInventory = require('../controllers/InventoryController.js'); 

// POST request to update user's inventory
router.post('/user/inventory', createInventory);

module.exports = router