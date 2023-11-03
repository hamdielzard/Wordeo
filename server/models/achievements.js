const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AchievementSchema = new Schema({
    title: {
        type: String,
        unique: true
    },
    description: {
        type: String
    },
    userName: {
        type: String,
        required: true
    },
}, { timestamps: true }) // creates 'createdAt' & 'updatedAt' timestamps automatically

const Achievement = mongoose.model('Achievement', AchievementSchema)

module.exports = Achievement