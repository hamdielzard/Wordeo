const logger = require('../logger');
const User = require('../models/user');
const { StoreItem } = require('../models/store');

// GET /store/items
const getAllStoreItems = (req, res, next) => {
    // Retrieve all store items from the database
    StoreItem.find()
        .then(storeItems => {
            res.status(200).json({ storeItems });
            logger.info('[200] GET /store/items - StoreController: Retrieved all store items');
        })
        .catch(error => {
            res.status(500).json({ message: 'Failed to retrieve store items!' });
            logger.error('[500] GET /store/items - StoreController: Error occurred while retrieving store items');
            logger.cont(`Details: ${error}`);
        });
};

// POST /store/buy
const buyItem = (req, res, next) => {
    const { userName, itemName, quantity } = req.body;

    // Ensure required fields are provided in the request body
    if (!userName || !itemName || !quantity) {
        return res.status(400).json({ message: 'Please provide userName, itemName, and quantity in the request body.' });
    }

    // Find the user by userName
    User.findOne({ userName })
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: `User ${userName} not found!` });
            }

            // Find the store item by name
            StoreItem.findOne({ name: itemName })
                .then(storeItem => {
                    if (!storeItem) {
                        return res.status(404).json({ message: `Store item ${itemName} not found!` });
                    }

                    if (storeItem.enabled) {
                        return res.status(400).json({ message: `Item ${itemName} is already purchased!` });
                    }

                    // Check if the user has enough balance or meets other conditions to purchase the item
                    // Add logic here to check user's balance, game progress, etc.

                    // Update the store item's "enabled" status to true
                    storeItem.enabled = true;

                    // Add the item to the user's inventory
                    user.inventory.push({ name: itemName, quantity });

                    // Save both the updated store item and user document
                    return Promise.all([storeItem.save(), user.save()]);
                })
                .then(([updatedStoreItem, updatedUser]) => {
                    res.status(200).json({ message: `Item ${itemName} purchased successfully`, user: updatedUser });
                    logger.info(`[200] POST /store/buy - StoreController: Item purchase successful for ${userName}`);
                })
                .catch(error => {
                    res.status(500).json({ message: 'Failed to purchase item!' });
                    logger.error(`[500] POST /store/buy - StoreController: Item purchase error occurred for ${userName}`);
                    logger.cont(`Details: ${error}`);
                });
        })
        .catch(error => {
            res.status(500).json({ message: 'Failed to find user!' });
            logger.error(`[500] POST /store/buy - StoreController: User lookup error occurred for ${userName}`);
            logger.cont(`Details: ${error}`);
        });
};

module.exports = { getAllStoreItems, buyItem };