const express = require('express');

const router = express.Router();

const UserController = require('../controllers/UserController');

router.get('/', UserController.index);
router.patch('/', UserController.update);
router.patch('/inventory', UserController.createInventory);
router.patch('/coin', UserController.updateCoins);
router.get('/coin', UserController.getCoinBalance);
router.delete('/', UserController.destroy);

module.exports = router;
