// These handle the socket.io server, which is what we use for multiplayer
const { Server } = require("socket.io");
const Word = require('./models/words');
// -----


// Express server
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
    .then((result) => app.listen(PORT, HOST, () => {
        console.log(`\n>> WORDEO SERVER`)
        console.log(`>> LOGS SAVING TO logs.txt FILE\n`)
        logger.info(`Server listening on port ${HOST}:${PORT}`);
    }))
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
    .catch((err) => logger.error(err));

// -----


// Socket.io server

// Start socket.io server on port 6060
const io = new Server(6060, {
    cors: {
        origin: "*",
    }
});

// Socket.io event handlers
io.on("connection", (socket) => {
    // When a client connects, log it
    logger.socket(`A user connected: ${socket.id}`);

    // When a client disconnects, log it
    socket.on("disconnect", () => {
        logger.socket(`A user disconnected: ${socket.id}`);
    });

    // When a client sends a message, log it
    socket.on("message", (message) => {
        logger.socket(`${socket.id} sent a message: ${message}`);
    });

    // Multiplayer Lobby Events

    // Client joins lobby
    socket.on("join-lobby", (data) => {
        logger.socket(`${data.playerName} joined lobby: ${data.gameCode} - ${socket.id}`);
        socket.join(data.gameCode);
        socket.to(data.gameCode).emit("playerJoined", data);
    });

    // Client leaves lobby
    socket.on("leave-lobby", (data) => {
        logger.socket(`${data.playerName} left lobby: ${data.gameCode} - ${socket.id}`);
        socket.leave(data.gameCode);
    });

    // Client sends message to lobby
    socket.on("message-lobby", (data) => {
        logger.socket(`${data.playerName} sent message to lobby: ${data.gameCode} - ${socket.id}`);
        socket.to(data.gameCode).emit("message-lobby", data);
    });
    
    // Client starts game
    socket.on("start-game", (data) => {
        logger.socket(`${data.playerName} started game: ${data.gameCode} - ${socket.id}`);
        socket.to(data.gameCode).emit("start-game", data);
    });
});

// -----
