const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ItemSchema = new Schema({
    name: String,
    quantity: Number
});

const AchievementSchema = new Schema({
    name: String,
    description: String,
    locked: Boolean
});

const AccountSchema = new Schema({
    displayName: {
        type: String
    },
    userName: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    highscore: {
        type: Number
    },
    gamesPlayed: {
        type: Number
    },
    gamesWon: {
        type: Number
    },
    description: {
        type: String
    },
    wordsGuessed: {
        type: Number
    },
    coins: {
        type: Number,
        default: 0,
    },

    inventory: [ItemSchema],
    
    achievements: [AchievementSchema]
}, { timestamps: true }) // creates 'createdAt' & 'updatedAt' timestamps automatically

const User = mongoose.model('User', AccountSchema)

module.exports = User