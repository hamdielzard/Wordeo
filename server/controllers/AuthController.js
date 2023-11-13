const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const logger = require('../logger')


// POST /auth/register
const register = (req, res, next) => {
    var userName = req.body.userName;
    var displayName = req.body.displayName;
    var password = req.body.password;
    
    if (displayName == null || displayName == undefined || displayName == "") {
        displayName = userName;
    }
    
    if (userName == null || userName == undefined || userName == "") {
        logger.error(`[400] POST /auth/register - AuthController: Sign up error occurred: ${userName} is not a valid username`)
        return res.status(400).json({
            message: 'Invalid username!'
        })
    }
    
    if (password == null || password == undefined || password == "") {
        logger.error(`[400] POST /auth/register - AuthController: Sign up error occurred: ${userName} is not a valid password`)
        return res.status(400).json({
            message: 'Invalid password!'
        })
    }

    User.findOne({ userName: userName })
        .then(user => {
            if (user) {
                logger.error(`[409] POST /auth/register - AuthController: Sign up error occurred: ${userName} already exists`)
                return res.status(409).json({
                    message: "User already exists!"
                })
            } else {
                bcrypt.hash(password, 10, function (err, hashedPass) {
                    if (err) {
                        logger.error(`[400] POST /auth/register - AuthController: Sign up error occurred: ${err}`)
                        return res.status(400).json({
                            message: 'Failed to sign up at this time'
                        })
                    }

                    let user = new User({
                        displayName: req.body.displayName,
                        userName: req.body.userName,
                        password: hashedPass,
                        highscore: 0,
                        gamesPlayed: 0,
                        gamesWon: 0,
                        description: "",
                        wordsGuessed: 0,
                        coins: 0,
                        achievements: createLockedAchievements()
                    })

                    user.save()
                        .then(user => {
                            logger.info(`[200] POST /auth/register - AuthController: Sign up successful: ${userName}`)
                            return res.status(200).json({
                                message: 'User registered successfully!',
                                userName: user.userName,
                                displayName: user.displayName
                            })
                        })


                        .catch(error => {
                            logger.error(`[500] POST /auth/register - AuthController: Sign up error occurred: ${error}`)
                            return res.status(500).json({
                                message: 'An error occured!'
                            })

                        })
                })
            }
        });

}

// Define a function to create 5 locked achievements
const createLockedAchievements = () => {
    const achievements = [
        {
            name: "Adventurer",
            description: "Achieved for updating your description!",
            locked: true
        },
        {
            name: "Achievement 2",
            description: "Achievement Locked",
            locked: true
        },
        {
            name: "Achievement 3",
            description: "Achievement Locked",
            locked: true
        },
        {
            name: "Achievement 4",
            description: "Achievement Locked",
            locked: true
        },
        {
            name: "Achievement 5",
            description: "Achievement Locked",
            locked: true
        }
    ];

    return achievements;
};

// POST /auth/login
const login = (req, res, next) => {
    var userName = req.body.userName;
    var password = req.body.password;

    User.findOne({ userName: userName })
        .then(user => {
            if (!user) {
                logger.warn(`[404] POST /auth/login - AuthController: Login error occurred: ${userName} does not exist`)
                return res.status(404).json({
                    message: "No such user found!"
                })
            }

            bcrypt.compare(password, user.password, function (err, result) {
                if (err) {
                    logger.error(`[500] POST /auth/login - AuthController: Login error occurred: ${err}`)
                    return res.status(500).json({
                        message: "An error occurred!"
                    })
                }
                if (result) {
                    let token = jwt.sign({ userName: user.userName }, 'verySecretValue', { expiresIn: '1h' })
                    logger.info(`[200] POST /auth/login - AuthController: Login successful: ${userName}`)
                    return res.status(200).json({
                        message: 'Login successful!',
                        token,
                        userName: user.userName,
                        displayName: user.displayName
                    })
                }
                else {
                    logger.warn(`[400] POST /auth/login - AuthController: Failed login: ${userName} password does not match`)
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