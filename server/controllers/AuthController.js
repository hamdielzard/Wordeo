const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const logger = require('../logger')


// Registration process
const register = (req, res, next) => {
    var userName = req.body.userName;

    User.findOne({ userName: userName })
        .then(user => {
            if (user) {
                logger.error(`[409] AuthController - Sign up error occurred: ${userName} already exists`)
                return res.status(409).json({
                    message: "User already exists!"
                })
            } else {
                bcrypt.hash(req.body.password, 10, function (err, hashedPass) {
                    if (err) {
                        logger.error(`[400] AuthController - Sign up error occurred: ${err}`)
                        return res.error(400).json({
                            error: err
                        })
                    }

                    let user = new User({
                        userName: req.body.userName,
                        password: hashedPass,
                        highscore: 0,
                        gamesPlayed: 0,
                        gamesWon: 0,
                        description: "",
                        wordsGuessed: 0
                    })

                    user.save()
                        .then(user => {
                            logger.info(`[200] AuthController - Sign up successful: ${userName}`)
                            return res.status(200).json({
                                message: 'User Added Successfully!'
                            })
                        })
                    

                        .catch(error => {
                            logger.error(`[500] AuthController - Sign up error occurred: ${error}`)
                            return res.status(500).json({
                                message: 'An error occured!'
                            })
                            
                        })
                })
            }
        });

}

// Login process
const login = (req, res, next) => {
    var userName = req.body.userName;
    var password = req.body.password;

    User.findOne({ userName: userName })
        .then(user => {
            if (!user) {
                logger.warn(`[404] AuthController - Login error occurred: ${userName} does not exist`)
                return res.status(404).json({
                    message: "No such user found!"
                })
            }
            
            bcrypt.compare(password, user.password, function (err, result) {
                    if (err) {
                        logger.error(`[500] AuthController - Login error occurred: ${err}`)
                        return res.status(500).json({
                            error: err
                        })
                    }
                    if (result) {
                        let token = jwt.sign({ userName: user.userName }, 'verySecretValue', { expiresIn: '1h' })
                        logger.info(`[200] AuthController - Login successful: ${userName}`)
                        return res.status(200).json({
                            message: 'Login successful!',
                            token,
                            userId: user._id // Include the user ID
                        })
                    }
                    else {
                        logger.warn(`[400] AuthController - Failed login: ${userName} password does not match`)
                        return res.status(400).json({
                            message: 'Password does not match!'
                        })
                    }
                })
        })
}

module.exports = {
    register,
    login
};