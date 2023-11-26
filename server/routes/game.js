const router = require('express').Router();

const gameController = require('../controllers/game-controller');

// Figure out if game mode requested is single player or multiplayer
// If single player, create a new game and send user to game with a private game code
// If multiplayer, create a new game and send user to lobby with a public game code

// Create a new game
router.post('/', gameController.create);

// Get a game
router.get('/', gameController.get);

module.exports = router;
