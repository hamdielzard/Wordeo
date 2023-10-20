const logger = require('../logger')
const User = require('../models/user')

// Show the list of Users
const index = (req, res, next) => {
    User.find() // Mongoose querry that returns all users from database
        .then(response => {
            res.status(200).json({
                response
            })
            logger.info(`[200] UserController - Get all users successful`)
        })
        .catch(error => {
            res.status(500).json({
                message: 'An error Occured!'
            })
            logger.error(`[500] UserController - Get all users error occurred: ${error}`)
        })
}

// Show single user
const show = (req, res, next) => {
    let userID = req.body.userID
    User.findById(userID)
        .then(response => {
            res.status(200).json({
                response
            })
            logger.info(`[200] UserController - Get user successful: ${userID}`)
        })
        .catch(error => {
            res.status(500).json({
                message: 'An error Occured!'
            })
            logger.error(`[500] UserController - Get user error occurred: ${error}`)
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
            res.status(200).json({
                message: 'User added successfully!'
            })
            logger.info(`[200] UserController - Add user successful: ${user.userName}`)
        })
        .catch(error => {
            res.status(500).json({
                message: 'An error Occured!'
            })
            logger.error(`[500] UserController - Add user error occurred: ${error}`)
        })
}

// Update user
const update = (req, res, next) => {
    let userID = req.body.userID

    let updateData = {
        userName: req.body.userName,
        description: req.body.description
    }

    User.findByIdAndUpdate(userID, { $set: updateData })
        .then(() => {
            res.status(200).json({
                message: 'User updated successfully!'
            })
            logger.info(`[200] UserController - Update user successful: ${userID}`)
        })
        .catch(error => {
            res.status(500).json({
                message: 'An error Occured!'
            })
            logger.error(`[500] UserController - Update user error occurred: ${error}`)
        })
}

// Delete user
const destroy = (req, res, next) => {
    let userID = req.body.userID

    User.findByIdAndRemove(userID)
        .then(() => {
            res.status(200).json({
                message: 'User deleted successfully!'
            })
            logger.info(`[200] UserController - Delete user successful: ${userID}`)
        })
        .catch(error => {
            res.status(500).json({
                message: 'An error Occured!'
            })
            logger.error(`[500] UserController - Delete user error occurred: ${error}`)
        })
}

module.exports = {
    index, show, store, update, destroy
}