const mongoose = require('mongoose');

const { Schema } = mongoose;

const ItemSchema = new Schema({
  name: String,
  quantity: Number,
});

const AchievementSchema = new Schema({
  name: String,
  description: String,
  locked: Boolean,
});

const defaultAchievements = [
  {
    name: 'Adventurer',
    description: 'Achieved for updating your description!',
    locked: true,
  },
  {
    name: 'Ace',
    description: 'Achieved for winning 5 games!',
    locked: true,
  },
  {
    name: 'Professional',
    description: 'Achieved for playing 10 games!',
    locked: true,
  },
];

const AccountSchema = new Schema({
  displayName: {
    type: String,
  },
  userName: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  highscore: {
    type: Number,
  },
  gamesPlayed: {
    type: Number,
  },
  gamesWon: {
    type: Number,
  },
  description: {
    type: String,
  },
  wordsGuessed: {
    type: Number,
  },
  coins: {
    type: Number,
    default: 0,
  },

  inventory: [ItemSchema],

  achievements: {
    type: [AchievementSchema],
    default: defaultAchievements,
  },
}, { timestamps: true }); // creates 'createdAt' & 'updatedAt' timestamps automatically

const User = mongoose.model('User', AccountSchema);

module.exports = User;
