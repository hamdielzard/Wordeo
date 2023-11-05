const logger = require('../logger');
const User = require('../models/user');

// POST /user/inventory
const createInventory = (req, res, next) => {
    const { userName, itemName, quantity } = req.body;

    // Ensure required fields are provided in the request body
    if (!userName || !itemName || !quantity) {
        return res.status(400).json({ message: 'Please provide userName, itemName, and quantity in the request body.' });
    }

    User.findOne({ userName })
        .then(user => {
            if (!user) {
                // User not found (404)
                return res.status(404).json({ message: `User ${userName} not found!` });
            }

            // Check if the item already exists in the inventory
            const existingItem = user.inventory.find(item => item.name === itemName);

            if (existingItem) {
                // Item already exists, update its quantity
                existingItem.quantity += quantity;
            } else {
                // Item doesn't exist, add it to the inventory
                user.inventory.push({ name: itemName, quantity });
            }

            // Save the updated user document
            return user.save();
        })
        .then(updatedUser => {
            res.status(200).json({ message: 'Inventory updated successfully', user: updatedUser });
            logger.info(`[200] POST /user/inventory - UserController: Inventory update successful for ${userName}`);
        })
        .catch(error => {
            res.status(500).json({ message: 'Failed to update inventory!' });
            logger.error(`[500] POST /user/inventory - UserController: Inventory update error occurred for ${userName}`);
            logger.cont(`Details: ${error}`);
        });
};

module.exports = createInventory;