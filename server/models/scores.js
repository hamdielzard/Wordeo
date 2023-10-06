const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AccountSchema = require('.accounts/');

const ScoreSchema = new Schema({
    score: {
        type: Number,
        required: true
    },
    user: {
        type: AccountSchema,
        required: true
    }
}, {timestamps: true}) // creates 'createdAt' & 'updatedAt' timestamps automatically

// mongoose will reference the collection 'Scores' from the database
const Score = mongoose.Model('Score', ScoreSchema);

// export
module.exports = Score;