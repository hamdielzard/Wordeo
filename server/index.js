require('dotenv').config();
const logger = require('./logger');
const app = require("./server");
const mongoose = require('mongoose');
const port = process.env.PORT || 8080;

// connect to the database
// only listen to incoming requests when database connection is successful
// return errors if unsuccessful
mongoose.connect(process.env.MONGODB_URL)
    .then((result) => app.listen(port, () => {
        logger.info(`Server listening on port ${port}`);
    }))
    .catch((err) => logger.error(err));