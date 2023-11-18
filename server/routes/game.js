const router = require('express').Router();

const GameController = require('../controllers/GameController.js');

// Figure out if game mode requested is single player or multiplayer
// If single player, create a new game and send user to game with a private game code
// If multiplayer, create a new game and send user to lobby with a public game code

// Create a new game
router.post('/', GameController.create);

// Get a game
router.get('/', GameController.get);

module.exports = router;
