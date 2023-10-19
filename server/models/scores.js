const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ScoreSchema = new Schema({
    score: {
        type: Number,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
}, {timestamps: true}) // creates 'createdAt' & 'updatedAt' timestamps automatically

// mongoose will reference the collection 'Scores' from the database
const Score = mongoose.model('Score', ScoreSchema);

// export
module.exports = Score;