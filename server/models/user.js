const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AccountSchema = new Schema({
    user_id: {
        type: String
    },
    userName: {
        type: String
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
}, { timestamps: true }) // creates 'createdAt' & 'updatedAt' timestamps automatically

const User = mongoose.model('User', AccountSchema)

module.exports = User