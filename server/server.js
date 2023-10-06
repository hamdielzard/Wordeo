const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

// set express app
const app = express();

const port = process.env.PORT;

// connect to the database
// only listen to incoming requests when database connection is successful
// return errors if unsuccessful
mongoose.connect(process.env.DB_CONNECTION_STRING)
    .then((result) => app.listen(port, () => {
        console.log(`server running on port ${port}`);
    }))
    .catch((err) => console.log(err));

app.get("/", (req, res) => {
    res.json({"version": "V1"});
});

