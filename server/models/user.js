const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AccountSchema = new Schema ({
    user_name: {
        type: String
    },
    password: {
        type: String
    }
}, {timestamps: true}) // creates 'createdAt' & 'updatedAt' timestamps automatically

const User = mongoose.model('User', userSchema)

module.exports = User