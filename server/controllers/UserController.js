const User = require('../models/User')

// Show the list of Users
const index = (req, res, next) => {
    User.find() // Mongoose querry that returns all users from database
    .then(response => {
        res.json({
            response
        })
    })
    .catch(error => {
        res.json({
            message: 'An error Occured!'
        })
    })
}

// Show single user
const show = (req, res, next) => {
    let userID = req.body.userID
    User.findById(userID)
    .then(response => {
        res.json({
            response
        })
    })
    .catch(error => {
        res.json({
            message: 'An error Occured!'
        })
    })
}

// Add new user
const store = (req, res, next) => {
    let user = new User({
        userName: req.body.userName,
        highscore: req.body.highscore   // Initialize to 0 if required
    })
    user.save()
    .then(response => {
        res.json({
            message: 'User added successfully!'
        })
    })
    .catch(error => {
        res.json({
            message: 'An error Occured!'
        })
    })
}

// Update user
const update = (req, res, next) => {
    let userID = req.body.userID

    let updateData = {
        userName: req.body.userName,
        highscore: req.body.highscore
    }

    User.findByIdAndUpdate(userID, {$set: updateData})
    .then(() => {
        res.json({
            message: 'User updated successfully!'
        })
    })
    .catch(error => {
        res.json({
            message: 'An error Occured!'
        })
    })
}

// Delete user
const destroy = (req, res, next) => {
    let userID = req.body.userID

    User.findByIdAndRemove(userID)
    .then(() => {
        res.json({
            message: 'User deleted successfully!'
        })
    })
    .catch(error => {
        res.json({
            message: 'An error Occured!'
        })
    })
}

module.exports = {
    index, show, store, update, destroy
}