const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const logger = require('../logger');

// POST /auth/register
const register = (req, res) => {
  const { userName } = req.body;
  let { displayName } = req.body;
  const { password } = req.body;

  if (displayName == null || displayName === undefined || displayName === '') {
    displayName = userName;
  }

  if (userName == null || userName === undefined || userName === '') {
    logger.error(`[400] POST /auth/register - AuthController: Sign up error occurred: ${userName} is not a valid username`);
    return res.status(400).json({
      message: 'Invalid username!',
    });
  }

  if (password == null || password === undefined || password === '') {
    logger.error(`[400] POST /auth/register - AuthController: Sign up error occurred: ${userName} is not a valid password`);
    return res.status(400).json({
      message: 'Invalid password!',
    });
  }

  User.findOne({ userName })
    .then((user) => {
      if (user) {
        logger.error(`[409] POST /auth/register - AuthController: Sign up error occurred: ${userName} already exists`);
        return res.status(409).json({
          message: 'User already exists!',
        });
      }
      bcrypt.hash(password, 10, (err, hashedPass) => {
        if (err) {
          logger.error(`[400] POST /auth/register - AuthController: Sign up error occurred: ${err}`);
          return res.status(400).json({
            message: 'Failed to sign up at this time',
          });
        }

        const newUser = new User({
          displayName,
          userName: req.body.userName,
          password: hashedPass,
          highscore: 0,
          gamesPlayed: 0,
          gamesWon: 0,
          description: '',
          wordsGuessed: 0,
        });

        newUser.save()
          .then((updatedUser) => {
            logger.info(`[200] POST /auth/register - AuthController: Sign up successful: ${userName}`);
            return res.status(200).json({
              message: 'User registered successfully!',
              userName: updatedUser.userName,
              displayName: updatedUser.displayName,
            });
          })
          .catch((error) => {
            logger.error(`[500] POST /auth/register - AuthController: Sign up error occurred: ${error}`);
            return res.status(500).json({
              message: 'An error occurred!',
            });
          });
      });
    });
};

// POST /auth/login
const login = (req, res) => {
  const { userName } = req.body;
  const { password } = req.body;

  User.findOne({ userName })
    .then((user) => {
      if (!user) {
        logger.warn(`[404] POST /auth/login - AuthController: Login error occurred: ${userName} does not exist`);
        return res.status(404).json({
          message: 'No such user found!',
        });
      }

      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          logger.error(`[500] POST /auth/login - AuthController: Login error occurred: ${err}`);
          return res.status(500).json({
            message: 'An error occurred!',
          });
        }
        if (result) {
          const token = jwt.sign({ userName: user.userName }, 'verySecretValue', { expiresIn: '1h' });
          logger.info(`[200] POST /auth/login - AuthController: Login successful: ${userName}`);
          return res.status(200).json({
            message: 'Login successful!',
            token,
            userName: user.userName,
            displayName: user.displayName,
          });
        }
        logger.warn(`[400] POST /auth/login - AuthController: Failed login: ${userName} password does not match`);
        return res.status(400).json({
          message: 'Password does not match!',
        });
      });
    });
};

module.exports = {
  register,
  login,
};
