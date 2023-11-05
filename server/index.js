require('dotenv').config();
const logger = require('./logger');
const app = require("./server");
const mongoose = require('mongoose');
const data = require('./data/words.json');
const Word = require('./models/words');
const { initializeStoreItems } = require('./models/store');

const HOST = '0.0.0.0';
const PORT = process.env.PORT || 8080;

// Connect to the database
mongoose.connect(process.env.MONGODB_URL)
    .then(async () => {
        console.log('Connected to the database');

        // Initialize store items in the database
        await initializeStoreItems();

        // Clear & insert the word data to the database
        await Word.deleteMany({});
        const res = await Word.insertMany(data.words);

        // Start your Express server after database initialization
        app.listen(PORT, HOST, () => {
            logger.info(`Server listening on port ${HOST}:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Database connection error:', err);
    });