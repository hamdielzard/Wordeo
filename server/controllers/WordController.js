const Word = require('../models/words');
const logger = require('../logger');

const createWord = async (req, res) => {
    // the JSON request body: e.g., {"word": "my word", "hints": ["hint1", "hint2"], "category": "Vocabulary", "difficulty": 1}
    const word = req.body.word;             // a single word
    const hints = req.body.hints;           // list of hints for the word
    const category = req.body.category;     // category for the word
    const difficulty = req.body.difficulty; // difficulty of a word from 0 

    const newWord = new Word({
        word: word,
        hints: hints,
        category: category,
        difficulty: difficulty
    });

    try {
        const result = await newWord.save();
        res.status(200).json(result);
        logger.info(`[200] POST /words - Add word successful: ${word}`);
    } catch (err) {
        res.status(400).json({ message: err.message });
        logger.error(`[400] POST /words - Add word error occurred: ${err}`);
    }
};

const getByWord = async (req, res) => {
    // the JSON request body: e.g., {"word": "my word"}
    const word = req.body.word;     // a single word

    try {
        const result = await Word.find({ word: word });
        res.status(200).json(result);
        logger.info(`[200] GET /words - Get word successful: ${word}`);
    } catch (err) {
        res.status(500).json({ message: err.message });
        logger.error(`[500] GET /words - Get word error occurred: ${err}`);
    }
};
const updateWord = async (req, res) => {
    // the JSON request body: e.g., {"word": "my word", "hint": "original hint 1", "newHints": ["new hint1", "new hint2"]}
    const word = req.body.word;             // a single word
    const hint = req.body.hint;             // a single hint to identify the word
    const newHints = req.body.newHints;     // a list of new hints for the word to be updated

    try {
        const result = await Word.updateOne({ word: word, hints: hint }, { hints: newHints });
        res.status(200).json(result);
        logger.info(`[200] PATCH /words - Update word successful: ${word}`);
    } catch (err) {
        res.status(500).json({ message: err.message });
        logger.error(`[500] PATCH /words - Update word error occurred: ${err}`);
    }
};
const deleteWord = async (req, res) => {
    // the JSON request body: e.g., {"word": "my word", "hint": "original hint 1"}
    const word = req.body.word;     // a single word
    const hint = req.body.hint;     // a single hint to identify the word

    try {
        const result = await Word.deleteOne({ word: word, hints: hint });
        res.status(200).json(result);
        logger.info(`[200] DELETE /words - Delete word successful: ${word}`);
    } catch (err) {
        res.status(500).json({ message: err.message });
        logger.error(`[500] DELETE /words - Delete word error occurred: ${err}`);
    }
};
const createWords = async (req, res) => {    // the JSON request body: e.g., {"words": [{"word": "my word", "hints": ["hint1", "hint2"],...}, {...}]}
    const words = req.body.words;   // list of word & hints pair

    try {
        const result = await Word.insertMany(words);
        res.status(200).json(result);
        logger.info(`[200] POST /words / - Add multiple words successful`);
    } catch (err) {
        res.status(400).json({ message: err.message });
        logger.error(`[400] POST /words / - Add multiple words error occurred: ${err}`);
    }
};
const getWords = async (req, res) => {
    var filter = {};

    // filter by category
    if (req.query.category) {
        filter.category = req.query.category;
    }

    // filter by difficulty
    if (req.query.difficulty) {
        filter.difficulty = req.query.difficulty;
    }

    try {
        var result;
        // limit the number of items used and return randomized list
        if (req.query.count) {
            result = await Word.aggregate([
                { $match: filter },
                { $sample: { size: parseInt(req.query.count) } }
            ]);
        } else {
            result = await Word.find(filter);
        }
        res.status(200).json(result);
        logger.info(`[200] GET /words / - Get all words successful`);
    } catch (err) {
        res.status(500).json({ message: err.message });
        logger.error(`[500] GET /words / - Get all words error occurred: ${err}`);
    }
};

module.exports = {
    createWord,
    getByWord,
    updateWord,
    deleteWord,
    createWords,
    getWords
}