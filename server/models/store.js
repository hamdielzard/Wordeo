const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for store items
const StoreItemSchema = new Schema({
    name: String,
    enabled: {
        type: Boolean,
        default: false // By default, items are not enabled
    }
});

// Create the StoreItem model
const StoreItem = mongoose.model('StoreItem', StoreItemSchema);

// Initialize an array of store items
const initialStoreItems = [
    { name: 'Item A', enabled: false },
    { name: 'Item B', enabled: false },
    { name: 'Item C', enabled: false },
    { name: 'Item D', enabled: false },
    { name: 'Item E', enabled: false },
    { name: 'Item F', enabled: false },
    { name: 'Item G', enabled: false },
    { name: 'Item H', enabled: false },
    { name: 'Item I', enabled: false },
    { name: 'Item J', enabled: false }
];

// Function to initialize the store items in the database
const initializeStoreItems = async () => {
    try {
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