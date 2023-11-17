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
    { name: 'Add Time', description: 'Add 5 seconds to the timer', category: 'powerup', price: 500, enabled: false },
    { name: 'Reveal Letter', description: 'Reveal one random letter in the word', category: 'powerup', price: 2500, enabled: false },
];

// Function to initialize the store items in the database
const initializeStoreItems = async () => {
    try {
        // Check if store items already exist in the database
        // reset store items
        await StoreItem.deleteMany({})
        await StoreItem.insertMany(initialStoreItems);
        console.log('Store items initialized successfully.');
    } catch (error) {
        console.error('Error initializing store items:', error);
    }
};

// Export the StoreItem model and the initialization function
module.exports = { StoreItem, initialStoreItems, initializeStoreItems };