const logger = require('../logger')
const User = require('../models/user')

// GET /user/
const index = (req, res, next) => {
    // All users are returned if no body is given.
    if (req.query.userName == null || req.query.userName == undefined || req.query.userName == "") {
        User.find() // Get all users
            .then(response => {
                res.status(200).json({
                    response
                })
                logger.info(`[200] GET /user - UserController: Get ALL users successful`)
            })
            .catch(error => {
                res.status(500).json({
                    message: 'Failed to get all users!'
                })
                logger.error(`[500] GET /user - UserController: Get ALL users error occurred`)
                logger.cont(`Details: ${error}`)
            })
    }
    else {
        let userName = req.query.userName;
        User.findOne({ userName: userName })
            .then(response => {
                if (!response) {
                    // User not found (404)
                    res.status(404).json({
                        message: `User ${userName} not found!`
                    })
                    logger.warn(`[404] GET /user userName: ${userName} - UserController: User not found`)
                    return
                }
                res.status(200).json({
                    response
                })
                logger.info(`[200] GET /user userName: ${userName} - UserController: Get single user successful`)
            })
            .catch(error => {
                res.status(500).json({
                    message: 'Failed to get user!'
                })
                logger.error(`[500] GET /user userName: ${userName} - UserController: Get user error occurred`)
                logger.cont(`Details: ${error}`)
            })
    }
}

// PATCH /user/
const update = (req, res, next) => {
    let userName = req.body.userName;

    let updateData = {
        displayName: req.body.displayName,
        description: req.body.description
    };

    if (updateData.description == null || updateData.description == undefined || updateData.description == "") {
        updateData.description = "";
    }
    if (userName == null || userName == undefined || userName == "") {
        // Missing userName (400)
        res.status(400).json({
            message: 'Bad request! userName is required!'
        })
        logger.warn(`[400] PATCH /user userName: ${userName} - UserController: Bad request! Missing userName`)
        return
    }
    if (updateData.displayName == null || updateData.displayName == undefined || updateData.displayName == "") {
        // Missing displayName (400)
        res.status(400).json({
            message: 'Bad request! displayName is required!'
        })
        logger.warn(`[400] PATCH /user userName: ${userName} - UserController: Bad request! Missing displayName`)
        return
    }
    else {
        User.findOne({ "userName": userName })
            .then(user => {
                if (!user) {
                    // User not found (404)
                    res.status(404).json({
                        message: `User ${userName} not found!`
                    })
                    logger.warn(`[404] PATCH /user userName: ${userName} - UserController: User not found`)
                    return
                }
                User.findOneAndUpdate({ "userName": userName }, updateData)
                    .then(response => {
                        // Success (200)
                        res.status(200).json({
                            message: `User ${userName} updated successfully!`,
                            displayName: updateData.displayName,
                            description: updateData.description
                        })
                        logger.info(`[200] PATCH /user userName: ${userName} - UserController: Update user successful`)
                        logger.cont(`displayName: ${updateData.displayName}`)
                        logger.cont(`description: ${updateData.description}`)
                    })
                    .catch(error => {
                        // Error (500)
                        res.status(500).json({
                            message: 'Failed to update user!'
                        })
                        logger.info(`[500] PATCH /user userName: ${userName} - UserController: Failed to update user!`)
                        logger.cont(`displayName: ${updateData.displayName}`)
                        logger.cont(`description: ${updateData.description}`)
                        logger.cont(`Details: ${error}`)
                    })
            })
    }
}

// DELETE /user/
const destroy = (req, res, next) => {
    let userName = req.body.userName;

    if (userName == null || userName == undefined || userName == "") {
        // Missing userName (400)
        res.status(400).json({
            message: 'Bad request! userName is required!'
        })
        logger.warn(`[400] DELETE /user userName: ${userName} - UserController: Bad request! Missing userName`)
        return
    }

    User.findOne({ "userName": userName })
        .then(user => {
            if (!user) {
                // User not found (404)
                res.status(404).json({
                    message: `User ${userName} not found!`
                })
                logger.warn(`[404] DELETE /user userName: ${userName} - UserController: User not found`)
                return
            }

            User.findOneAndDelete({ "userName": userName })
                .then(response => {
                    res.status(200).json({
                        message: `User ${response.userName} was deleted successfully!`,
                        response
                    })
                    logger.info(`[200] DELETE /user userName: ${userName} - UserController: Delete user successful`)
                })
                .catch(error => {
                    res.status(500).json({
                        message: 'Failed to delete user!'
                    })
                    logger.info(`[500] DELETE /user userName: ${userName} - UserController: Failed to delete user!`)
                    logger.cont(`Details: ${error}`)
                })
        })
        .catch(error => {
            res.status(500).json({
                message: 'Failed to find user!'
            })
            logger.info(`[500] DELETE /user userName: ${userName} - UserController: Failed to find user!`)
            logger.cont(`Details: ${error}`)
        })
}

module.exports = {
    index, update, destroy
}