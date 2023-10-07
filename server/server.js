const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");

require('dotenv').config();

// load router modules: https://expressjs.com/en/guide/routing.html
const accounts = require('./routes/accounts');
const words = require('./routes/words');
const scores = require('./routes/scores');

// set express app
const app = express();
const port = process.env.PORT;

app.use(cors());
app.use('/accounts', accounts);
app.use('/words', words);
app.use('scores', scores);

// connect to the database
// only listen to incoming requests when database connection is successful
// return errors if unsuccessful
mongoose.connect(process.env.DB_CONNECTION_STRING)
    .then((result) => app.listen(port, () => {
        console.log(`server running on port ${port}`);
    }))
    .catch((err) => console.log(err));

// test endpoint
app.get("/", (req, res) => {
    res.json({"version": "V1"});
});

// export
module.exports = app;