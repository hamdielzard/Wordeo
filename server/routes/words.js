const express = require('express');
const router = express.Router();

const WordController = require('../controllers/WordController');

// endpoints

// create a single word
router.post("/word", WordController.createWord);

// fetch a word by it's "word"
// Note: this could return multiple words since a word is not unique
router.get("/word", WordController.getByWord);

// update a single word
// Note: you need to provide a hint to identify a word since a word is not unique
// Note: the newHints will override the existing hints, not added
router.patch("/word", WordController.updateWord);

// delete a single word
// Note: you would need to provide a hint to identify a word since a word is not unique
router.delete("/word", WordController.deleteWord);

// create multiple words
router.post("/", WordController.createWords);

// get all words
// you can filter by category or difficulty using query parameters: e.g., ?difficulty=1&category=Odd
// when specifying a count int the query parameters, the resulting list will be a randomized 
router.get("/", WordController.getWords);

// export
module.exports = router;