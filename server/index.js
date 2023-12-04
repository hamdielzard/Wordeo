// These handle the socket.io server, which is what we use for multiplayer
const { Server } = require('socket.io');
// -----

// Express server
require('dotenv').config();
const mongoose = require('mongoose');
const logger = require('./logger');
const app = require('./server');
const wordData = require('./data/words.json');
const Word = require('./models/words');
const { getWords } = require('./controllers/word-controller');
const { initializeStoreItems } = require('./models/store');

const HOST = '0.0.0.0';
const PORT = process.env.PORT || 8080;
const SOCKET_PORT = process.env.SOCKET_PORT || 6060;

// Connect to the database
mongoose.connect(process.env.MONGODB_URL)
  .then(() => app.listen(PORT, HOST, () => {
    console.log('\n>> WORDEO SERVER');
    console.log('>> LOGS SAVING TO logs.txt FILE\n');
    logger.info(`Server listening on port ${HOST}:${PORT}`);
  }))
  .then(async () => {
    console.log('Connected to the database');

    // Initialize store items in the database
    await initializeStoreItems();

    // Clear & insert the word data to the database
    await Word.deleteMany({});
    await Word.insertMany(wordData.words);
  })
  .catch((err) => logger.error(err));

// -----

// Socket.io server

// Start socket.io server on port 6060
const io = new Server(SOCKET_PORT, {
  cors: {
    origin: '*',
  },
});

const lobbies = {}; // dictionary to store room information

// Socket.io event handlers
io.on('connection', (socket) => {
  // When a client connects, log it - Commented out because it's annoying
  // logger.socket(`A user connected: ${socket.id}`);

  // When a client disconnects, log it - Commented out because it's annoying
  // socket.on("disconnect", () => {
  //     logger.socket(`A user disconnected: ${socket.id}`);
  // });

  // When a client sends a message, log it
  socket.on('message', (message) => {
    logger.socket(`${socket.id} sent a message: ${message}`);
  });

  // Multiplayer Lobby Events

  // Client joins lobby
  socket.on('join-lobby', (data) => {
    logger.socket(`${data.playerName} joined lobby: ${data.gameCode} - ${socket.id}`);
    socket.join(data.gameCode);
    socket.to(data.gameCode).emit('playerJoined', data);

    if (!lobbies[data.gameCode]) {
      // Lobby doesn't exist, create it
      lobbies[data.gameCode] = {
        players: {},
        submittedScores: {},
      };
    }

    // add player to lobby
    lobbies[data.gameCode].players[socket.id] = {
      playerName: data.playerName, score: data.score,
    };
  });

  // Client leaves lobby
  socket.on('leave-lobby', (data) => {
    logger.socket(`${data.playerName} left lobby: ${data.gameCode} - ${socket.id}`);

    // Remove the player from the lobby
    delete lobbies[data.gameCode].players[socket.id];

    socket.leave(data.gameCode);
    socket.to(data.gameCode).emit('playerLeft', data);
  });

  // Client sends message to lobby
  socket.on('message-lobby', (data) => {
    logger.socket(`${data.playerName} sent message to lobby: ${data.gameCode} - ${socket.id}`);
    io.to(data.gameCode).emit('message-lobby', data);
  });

  // Client starts game
  socket.on('start-game', async (data) => {
    logger.socket(`${data.playerName} started game: ${data.gameCode} - ${socket.id}`);

    // retrieve game words and broadcast it to room
    const words = await getWords(data.count);

    io.to(data.gameCode).emit('gameStarted', words);
  });

  // Client tells other clients that they are in the game too
  socket.on('iAmHereToo', (data) => {
    logger.socket(`${data.playerName} telling clients that they are in too: ${data.gameCode} - ${socket.id}`);
    socket.to(data.gameCode).emit('youAreHereToo', data);
  });

  // Client tells other clients that they have switched to started
  socket.on('iHaveStarted', async (data) => {
    logger.socket(`${data.playerName} telling clients that they have switched to started: ${data.gameCode} - ${socket.id}`);
    socket.to(data.gameCode).emit('gameRoundStarted', data);
  });

  socket.on('submitScore', (data) => {
    logger.socket(`${data.playerName} has submitted their score for lobby ${data.gameCode} - ${data.score}`);

    lobbies[data.gameCode].submittedScores[data.playerName] = data.score;

    // Check if all players have submitted their scores
    const allPlayers = Object.keys(lobbies[data.gameCode].players);
    const submittedPlayers = Object.keys(lobbies[data.gameCode].submittedScores);

    if (submittedPlayers.length === allPlayers.length) {
      // All players have submitted their scores
      // Emit the result back to all clients in the room
      logger.socket(`All scores submitted for lobby ${data.gameCode}`);
      io.to(data.gameCode).emit('gameResult', lobbies[data.gameCode].submittedScores);
    }
  });
});
// -----
