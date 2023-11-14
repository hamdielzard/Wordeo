require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const cors = require("cors");
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });


// load router modules: https://expressjs.com/en/guide/routing.html
const WordRoute = require('./routes/words');
const ScoreRoute = require('./routes/scores');
const AuthRoute = require('./routes/auth');
const UserRoute = require('./routes/user');
const GameRoute = require('./routes/game');
const StoreRoutes = require('./routes/store');


// Load socket io client to emit events to the server
const io = require('socket.io-client');

process.stdin.on('data', (data) => {
    if (data.toString().trim() === 'help' || data.toString().trim() === 'h') {
        console.log("===HELP MENU:===\n");
        console.log("help | h \t\t\t- display this menu");
        console.log("games | g \t\t\t- display all games");
        console.log("games clean | g clean \t\t- clean up expired games");
        console.log("games clean all | g clean all \t- remove all games (could break things!)");
        console.log("socket test | st \t\t- emit a socket io event");
        console.log("exit | quit \t\t\t- exit the program");

        console.log("\n");
    } else if (data.toString().trim() === 'exit' || data.toString().trim() === 'quit') {
        console.log("EXITING...\n\n");
        process.exit();
    } else if (data.toString().trim() === 'socket test' || data.toString().trim() === 'st') {
        const socket = io('http://localhost:6060');
        socket.emit('message', 'Hello World!');
    }
});
//const InventoryRoutes = require('./routes/inventory');

// set express app
const app = express();

app.use(cors());
app.use(jsonParser);
app.use(urlencodedParser);
app.use('/words', WordRoute);
app.use('/scores', ScoreRoute);
app.use('/api', AuthRoute);
app.use('/user', UserRoute);
app.use('/game', GameRoute);
app.use('/store', StoreRoutes);

// test endpoint
app.get("/", (req, res) => {
    res.json({ "version": "V2" });
});



// export
module.exports = app;
