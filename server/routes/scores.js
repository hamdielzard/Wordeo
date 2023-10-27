const express = require('express');
const router = express.Router();

const ScoreController = require('../controllers/ScoreController');

// endpoints

// create a new record of a score
router.post("/", ScoreController.createScore);

// get all scores
router.get("/", ScoreController.getScores);

// get highscores for leaderboard
router.get("/leaderboard", ScoreController.getLeaderboard);

// export
module.exports = router;