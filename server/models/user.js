const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ItemSchema = new Schema({
    name: String,
    quantity: Number
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
    inventory: [ItemSchema]

}, { timestamps: true }) // creates 'createdAt' & 'updatedAt' timestamps automatically

const User = mongoose.model('User', AccountSchema)

module.exports = User