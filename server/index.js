require('dotenv').config();
const logger = require('./logger');
const app = require("./server");
const mongoose = require('mongoose');
const data = require('../data/words.json');
const Word = require('./models/words');

const port = process.env.PORT || 8080;

// connect to the database
// only listen to incoming requests when database connection is successful
// return errors if unsuccessful
mongoose.connect(process.env.MONGODB_URL)
    .then((result) => app.listen(port, () => {
        logger.info(`Server listening on port ${port}`);
    }))
    .then(async () => {
        // clear & insert the word data to the database
        await Word.deleteMany({});
        const res = await Word.insertMany(data.words);
    })
    .catch((err) => logger.error(err));