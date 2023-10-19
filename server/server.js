require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const cors = require("cors");
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended : false });

// load router modules: https://expressjs.com/en/guide/routing.html
const accounts = require('./routes/accounts');
const words = require('./routes/words');
const scores = require('./routes/scores');

const AuthRoute = require('./routes/auth')

// set express app
const app = express();

app.use(cors());
app.use(jsonParser);
app.use(urlencodedParser);
app.use('/accounts', accounts);
app.use('/words', words);
app.use('/scores', scores);
app.use('/api', AuthRoute)

// test endpoint
app.get("/", (req, res) => {
    res.json({"version": "V1"});
});

// export
module.exports = app;
