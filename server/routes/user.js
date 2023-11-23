const express = require('express');

const router = express.Router();

const userController = require('../controllers/user-controller');

router.get('/', userController.index);
router.patch('/', userController.update);
router.patch('/inventory', userController.createInventory);
router.patch('/coin', userController.updateCoins);
router.get('/coin', userController.getCoinBalance);
router.delete('/', userController.destroy);

module.exports = router;
