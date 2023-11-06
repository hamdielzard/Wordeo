const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for store items
const StoreItemSchema = new Schema({
    name: String,
    description: String,
    category: String,
    price: Number,
    enabled: {
        type: Boolean,
        default: false // By default, items are not enabled
    }
});

// Create the StoreItem model
const StoreItem = mongoose.model('StoreItem', StoreItemSchema);

// Initialize an array of store items
const initialStoreItems = [
    { name: 'Item A', description: 'Add 5 seconds to the timer', category: 'powerup', price: 500, enabled: false },
    { name: 'Item B', description: 'Reveal one random letter in the word', category: 'powerup', price: 2500, enabled: false },
    { name: 'Item C', description: '', category: 'icon', price: 500, enabled: false },
    { name: 'Item D', description: 'Add 15 seconds to the timer', category: 'powerup', price: 5300, enabled: false },
    { name: 'Item E', description: '', category: 'icon', price: 500, enabled: false },
    { name: 'Item F', description: 'Add 2 seconds to the timer', category: 'powerup', price: 500, enabled: false },
    { name: 'Item G', description: 'Add 3 seconds to the timer', category: 'powerup', price: 100, enabled: false },
    { name: 'Item H', description: '', category: 'icon', price: 500, enabled: false },
    { name: 'Item I', description: 'Add 9 seconds to the timer', category: 'powerup', price: 500, enabled: false },
    { name: 'Item J', description: '', category: 'icon', price: 2500, enabled: false }
];

// Function to initialize the store items in the database
const initializeStoreItems = async () => {
    try {
        //await StoreItem.deleteMany({});

        // Check if store items already exist in the database
        const existingItems = await StoreItem.find();

        // If no items exist, insert the initial items
        if (existingItems.length === 0) {
            await StoreItem.insertMany(initialStoreItems);
            console.log('Store items initialized successfully.');
        }
    } catch (error) {
        console.error('Error initializing store items:', error);
    }
};

// Export the StoreItem model and the initialization function
module.exports = { StoreItem, initializeStoreItems };