require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const cors = require("cors");
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended : false });

// load router modules: https://expressjs.com/en/guide/routing.html
const words = require('./routes/words');
const scores = require('./routes/scores');
const AuthRoute = require('./routes/auth');
const UserRoute = require('./routes/user');
const InventoryRoutes = require('./routes/inventory');
const StoreRoutes = require('./routes/store');

// set express app
const app = express();

app.use(cors());
app.use(jsonParser);
app.use(urlencodedParser);
app.use('/words', words);
app.use('/scores', scores);
app.use('/api', AuthRoute);
app.use('/user', UserRoute);
app.use('/store', StoreRoutes);

// test endpoint
app.get("/", (req, res) => {
    res.json({"version": "V2"});
});

// export
module.exports = app;
