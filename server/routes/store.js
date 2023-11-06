const express = require('express');
const router = express.Router();
const StoreController = require('../controllers/StoreController');

// GET request to retrieve all store items
router.get('/', StoreController.getAllStoreItems);

router.post('/', StoreController.buyItem);

module.exports = router;