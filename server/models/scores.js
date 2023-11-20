const mongoose = require('mongoose');

const { Schema } = mongoose;

// enumerations of game types
const Modes = Object.freeze({
  Solo: 'solo',
  Multi: 'multi',
});

const ScoreSchema = new Schema({
  score: {
    type: Number,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  gameMode: {
    type: String,
    enum: Object.values(Modes),
    required: true,
  },
}, { timestamps: true }); // creates 'createdAt' & 'updatedAt' timestamps automatically

Object.assign(ScoreSchema.statics, { Modes });

// mongoose will reference the collection 'Scores' from the database
const Score = mongoose.model('Score', ScoreSchema);

// export
module.exports = {
  Score,
  Modes,
};
