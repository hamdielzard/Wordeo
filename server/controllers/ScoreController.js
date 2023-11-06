const { Score, Modes } = require('../models/scores');
const User = require('../models/user');
const logger = require('../logger');

const createScore = async (req, res) => {
  const score = req.body.score;
  const userName = req.body.userName;
  const mode = req.body.gameMode;

  // Validate backend score - TESTED
  if (score == null || score == undefined || score == "") {
    res.status(400).json({ message: `No score was provided` });
    logger.error(`[400] POST /scores - Add score error occurred: no score was provided`);
    return;
  }
  else if (isNaN(score)) {
    res.status(400).json({ message: `The provided score: ${score} is not a number!` });
    logger.error(`[400] POST /scores - Add score error occurred: ${score} is not a valid score`);
    return;
  }
  else if (score <= 0) {
    res.status(400).json({ message: `The provided score: ${score} is negative and/or zero!` });
    logger.error(`[400] POST /scores - Add score error occurred: ${score} is not a valid score`);
    return;
  }

  // Validate backend userName - TESTED
  if (userName == null || userName == undefined || userName == "") {
    res.status(400).json({ message: `No userName was provided` });
    logger.error(`[400] POST /scores - Add score error occurred: no userName was provided`);
    return;
  }
  else if (!await User.exists({ userName: userName })) {
    res.status(404).json({ message: `No user with given userName: ${userName} was found` });
    logger.error(`[404] POST /scores - Add score error occurred: ${userName} was not found`);
    return;
  }

  // Validate backend mode - TESTED
  if (mode == null || mode == undefined || mode == "") {
    res.status(400).json({ message: `No gameMode was provided` });
    logger.error(`[400] POST /scores - Add score error occurred: no gameMode was provided`);
    return;
  }
  else if (!Object.values(Modes).includes(mode)) {
    res.status(404).json({ message: `The provided game mode: ${mode} was invalid` });
    logger.error(`[404] POST /scores - Add score error occurred: ${mode} is not a valid game mode`);
    return;
  }

  // All fields validated. Attempt to add the score - TESTED
  const newScore = new Score({ score: score, userName: userName, gameMode: mode });
  newScore.save()
    .then(score => {
      res.status(200).json({
        message: 'Score was added successfully!',
        score: score.score,
        userName: score.userName,
        gameMode: score.gameMode
      })
      logger.info(`[200] POST /scores - Add score successful`)
    })
    .catch(error => {
      // WARN: Can't test this?
      res.status(500).json({
        message: 'An error occured!'
      })
      logger.error(`[500] POST /scores - Add score error occurred`)
      logger.cont(`Details: ${error}`)
    })
};

const getScores = async (req, res) => {
  let filter = {};
  let count = req.query.count;
  let userName = req.query.userName;
  let gameMode = req.query.gameMode;

  // If all 3 fields are empty, return all scores
  if (gameMode == null && gameMode == undefined && gameMode == "" &&
    userName == null && userName == undefined && userName == "" &&
    count == null && count == undefined && count == "") {
    count = 10; // Default count to 10, to prevent returning large amounts of data

    Score.find(filter)
      .limit(count)
      .sort({ score: -1 })
      .then(response => {
        res.status(200).json({
          response
        })
        logger.info(`[200] GET /scores - Get ALL scores successful`)
      })
      .catch(error => {
        res.status(500).json({
          message: 'Failed to get all scores!'
        })
        logger.error(`[500] GET /scores - Get ALL scores error occurred`)
        logger.cont(`Details: ${error}`)
      })
  }
  // Otherwise, filter by the given fields
  else {
    if (gameMode != null && gameMode != undefined && gameMode != "") {
      filter.gameMode = gameMode;
      // Check if the game mode is part of the enum
      if (!Object.values(Modes).includes(gameMode)) {
        // 400
        res.status(400).json({ message: `The provided game mode: ${gameMode} was invalid` });
        logger.error(`[400] GET /scores - SCORES: Get filtered scores error occurred: ${gameMode} is not a valid game mode`);
        return;
      }
    }
    if (userName != null && userName != undefined && userName != "") {
      filter.userName = userName;
      // Check if the user exists
      const user = await User.exists({ userName: userName });
      if (!user) {
        // 404
        res.status(404).json({ message: `No user with given userName: ${userName} was found` });
        logger.error(`[404] GET /scores - SCORES: Get filtered scores error occurred: ${userName} was not found`);
        return;
      }
    }
    if (count != null && count != undefined && count != "") {
      count = parseInt(count);
    }
    else {
      count = 10; // Default count to 10, to prevent returning large amounts of data
    }
    Score.find(filter)
      .limit(count)
      .sort({ score: -1 })
      .then(response => {
        // 200 
        res.status(200).json({
          response
        })
        logger.info(`[200] GET /scores - SCORES: Get filtered scores successful`)
      })
      .catch(error => {
        res.status(500).json({
          message: 'Failed to get scores!'
        })
        logger.error(`[500] GET /scores - SCORES: Get filtered scores has failed`)
        logger.cont(`Details: ${error}`)
      })

  }
};

module.exports = {
  createScore,
  getScores
}