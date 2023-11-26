const express = require('express');

const router = express.Router();

const scoreController = require('../controllers/score-controller');

// POST /scores - Create a new record of a score
router.post('/', scoreController.createScore);

// GET /scores - Get scores, which includes filtering by game mode, user name, and count
router.get('/', scoreController.getScores);

// export
module.exports = router;
