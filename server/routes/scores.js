const express = require('express');

const router = express.Router();

const ScoreController = require('../controllers/ScoreController');

// POST /scores - Create a new record of a score
router.post('/', ScoreController.createScore);

// GET /scores - Get scores, which includes filtering by game mode, user name, and count
router.get('/', ScoreController.getScores);

// export
module.exports = router;
