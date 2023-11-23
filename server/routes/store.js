const express = require('express');

const router = express.Router();
const storeController = require('../controllers/store-controller');

// GET request to retrieve all store items
router.get('/', storeController.getAllStoreItems);

router.post('/', storeController.buyItem);

module.exports = router;
