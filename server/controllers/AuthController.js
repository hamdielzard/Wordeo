const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const logger = require('../logger')


// Registration process
const register = (req, res, next) => {
    var userName = req.body.userName

    User.findOne({ userName: userName })
        .then(user => {
            if (user) {
                res.status(409).json({
                    message: "User already exists!"
                })
                logger.error(`[409] AuthController - Sign up error occurred: ${userName} already exists`)
            } else {
                bcrypt.hash(req.body.password, 10, function (err, hashedPass) {
                    if (err) {
                        res.error(400).json({
                            error: err
                        })
                        logger.error(`[400] AuthController - Sign up error occurred: ${err}`)
                    }

                    let user = new User({
                        userName: req.body.userName,
                        password: hashedPass
                    })

                    user.save()
                        .then(user => {
                            res.json({
                                message: 'User Added Successfully!'
                            })
                        })
                    logger.info(`[200] AuthController - Sign up successful: ${userName}`)

                        .catch(error => {
                            res.status(500).json({
                                message: 'An error occured!'
                            })
                            logger.error(`[500] AuthController - Sign up error occurred: ${error}`)
                        })
                })
            }
        });

}

// Login process
const login = (req, res, next) => {
    var userName = req.body.userName
    var password = req.body.password

    User.findOne({ userName: userName })
        .then(user => {
            if (user) {
                bcrypt.compare(password, user.password, function (err, result) {
                    if (err) {
                        res.status(500).json({
                            error: err
                        })
                        logger.error(`[500] AuthController - Login error occurred: ${err}`)
                    }
                    if (result) {
                        let token = jwt.sign({ userName: user.userName }, 'verySecretValue', { expiresIn: '1h' })
                        res.status(200).json({
                            message: 'Login successful!',
                            token
                        })
                        logger.info(`[200] AuthController - Login successful: ${userName}`)
                    }
                    else {
                        res.status(400).json({
                            message: 'Password does not match!'
                        })
                        logger.warn(`[400] AuthController - Failed login: ${userName} password does not match`)
                    }
                })
            }
            else {
                res.status(404).json({
                    message: "No such user found!"
                })
                logger.warn(`[404] AuthController - Login error occurred: ${userName} does not exist`)
            }
        })
}

module.exports = {
    register, login
}