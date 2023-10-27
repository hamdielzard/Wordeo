const express = require('express');
const router = express.Router();

// load models
const { Score, Modes } = require('../models/scores');
const User = require("../models/user"); // TODO: match the updated acount (or user) model
const logger = require('../logger');

// endpoints

// create a new record of a score
router.post("/", async (req, res) => {
    const score = req.body.score;
    const userID = req.body.userID;
    const mode = req.body.gameMode;

    try {
        if (!Object.values(Modes).includes(req.body.gameMode)) {
            // client provided non existing game mode
            res.status(400).json({ message: `the provided game mode: ${mode} was invalid` });
            logger.error(`[400] POST /scores - Add score error occurred: ${mode} is not a valid game mode`);
        } else if (parseInt(score) < 0) {
            // client provided a negative score
            res.status(400).json({ message: `negative scores are not allowed` });
            logger.error(`[400] POST /scores - Add score error occurred: ${score} is a negative score`);
        } else {
            const user = await User.exists({ _id: userID });
            const newScore = new Score({
                score: score,
                user: userID,
                gameMode: mode
            });

            if (user) {
                const result = await newScore.save();
                res.status(200).json(result);
                logger.info(`[200] POST /scores - Add score successful: ${score} for user: ${userID}`);
            } else {
                res.status(404).json({ message: `no user with given id: ${userID} was found` });
                logger.error(`[404] POST /scores - Add score error occurred: ${userID} was not found`);
            }
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
        logger.error(`[500] POST /scores - Add score error occurred: ${err}`);
    }
});

// get all scores
router.get("/", async (req, res) => {
    var filter = {};

    // filter by user
    if (req.query.userID) {
        filter.user = req.query.userID;
    }

    if (req.query.gameMode) {
        filter.gameMode = req.query.gameMode;
    }

    try {
        var result;

        // return a list of scores in a descending order
        if (req.query.count) {
            result = await Score.find(filter).sort({ score: 'desc' }).limit(parseInt(req.query.count));
        } else {
            result = await Score.find(filter).sort({ score: 'desc' });
        }
        res.status(200).json(result);
        logger.info(`[200] GET /scores - Get all scores successful`);
    } catch (err) {
        res.status(500).json({ message: err.message })
        logger.error(`[500] GET /scores - Get all scores error occurred: ${err}`);
    }
});

// get highscores for leaderboard
router.get("/leaderboard", async (req, res) => {
    var gameMode = req.query.gameMode || Modes.Solo; // if nothing matched, get solo mode leaderboard

    try {
      const leaderboard = await Score.aggregate([
        {
          $match: {
            gameMode: gameMode 
          }
        },
        {
          $group: {
            _id: "$user",
            highestScore: { $max: "$score" }
          }
        },
        {
          $lookup: {
            from: "users", 
            localField: "_id",
            foreignField: "_id",
            as: "userAccount"
          }
        },
        {
          $unwind: "$userAccount"
        },
        {
          $project: {
            _id: 1,
            highestScore: 1,
            displayName: "$userAccount.displayName",
            userName: "$userAccount.userName"
          }
        },
        {
          $sort: { highestScore: -1 }
        }
      ]);
      res.status(200).json(leaderboard);
      logger.info(`[200] GET /scores/leaderboard - Get leaderboard successful for gameMode: ${gameMode}`);
    } catch (err) {
      res.status(500).json({ message: err.message })
      logger.error(`[500] GET /scores/leaderboard - Get leaderboard error occured: ${err}`);
    }   
})
// export
module.exports = router;