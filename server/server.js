require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const cors = require("cors");
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended : false });

// load router modules: https://expressjs.com/en/guide/routing.html
const WordRoute = require('./routes/words');
const ScoreRoute = require('./routes/scores');
const AuthRoute = require('./routes/auth');
const UserRoute = require('./routes/user');

// set express app
const app = express();

app.use(cors());
app.use(jsonParser);
app.use(urlencodedParser);
app.use('/words', WordRoute);
app.use('/scores', ScoreRoute);
app.use('/api', AuthRoute);
app.use('/user', UserRoute);

// test endpoint
app.get("/", (req, res) => {
    res.json({"version": "V1"});
});

// export
module.exports = app;
