const express = require('express');
const router = express.Router();
const StoreController = require('../controllers/StoreController');

// GET request to retrieve all store items
router.get('/items', StoreController.getAllStoreItems);

router.post('/buy', StoreController.buyItem);

module.exports = router;