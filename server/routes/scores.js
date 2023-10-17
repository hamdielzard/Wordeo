const express = require('express');
const router = express.Router();

// load models
const { Score, Modes } = require('../models/scores');
const { Account } = require("../models/accounts"); // TODO: match the updated acount (or user) model

// endpoints

// create a new record of a score
router.post("/", async (req, res) => {
    const score = req.body.score;
    const userID = req.body.userID;
    const mode = req.body.gameMode;

    try {
        if (Object.values(Modes).includes(req.body.gameMode)) {
            const user = await Account.exists({ _id: userID });
            const newScore = new Score({
                score: score,
                user: userID,
                gameMode: mode
            });

            if (user) {
                const result = await newScore.save();
                res.status(200).json(result);
            } else {
                res.status(404).json({ message: `no user with given id: ${userID} was found` });
            }
        } else {
            res.status(400).json({ message: `the provided game mode: ${mode} was invalid` });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
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
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
});
// export
module.exports = router;