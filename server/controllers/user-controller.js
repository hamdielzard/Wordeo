/* eslint-disable no-restricted-globals */
/* eslint-disable no-param-reassign */
const logger = require('../logger');
const User = require('../models/user');

// GET /user/
const index = (req, res) => {
  // All users are returned if no body is given.
  if (req.query.userName == null || req.query.userName === undefined || req.query.userName === '') {
    User.find() // Get all users
      .then((response) => {
        res.status(200).json({
          response,
        });
        logger.info('[200] GET /user - UserController: Get ALL users successful');
      })
      .catch((error) => {
        res.status(500).json({
          message: 'Failed to get all users!',
        });
        logger.error('[500] GET /user - UserController: Get ALL users error occurred');
        logger.cont(`Details: ${error}`);
      });
  } else {
    const { userName } = req.query;
    User.findOne({ userName })
      .then((response) => {
        if (!response) {
          // User not found (404)
          res.status(404).json({
            message: `User ${userName} not found!`,
          });
          logger.warn(`[404] GET /user userName: ${userName} - UserController: User not found`);
          return;
        }
        res.status(200).json({
          response,
        });
        logger.info(`[200] GET /user userName: ${userName} - UserController: Get single user successful`);
      })
      .catch((error) => {
        res.status(500).json({
          message: 'Failed to get user!',
        });
        logger.error(`[500] GET /user userName: ${userName} - UserController: Get user error occurred`);
        logger.cont(`Details: ${error}`);
      });
  }
};

const updateDescriptionAchievement = async (updateData, user) => {
  let userUpdated = false;

  if (updateData.description.length !== 0) {
    user.achievements[0].locked = false;
    await user.save();
    userUpdated = true;
  }

  return userUpdated;
};

const updateWinGameAchievement = async (user) => {
  let userUpdated = false;

  if (user.gamesWon >= 5 && user.achievements[1].locked) {
    // Check if the user has won 5 or more games and the achievement is still locked
    user.achievements[1].locked = false; // Unlock the achievement
    await user.save();
    userUpdated = true;
  }

  return userUpdated;
};

const updatePlayTenGamesAchievement = async (user) => {
  let userUpdated = false;

  if (user.gamesPlayed >= 10 && user.achievements[2].locked) {
    // Check if the user has played 10 or more games and the achievement is still locked
    user.achievements[2].locked = false; // Unlock the achievement
    await user.save();
    userUpdated = true;
  }

  return userUpdated;
};

const updateAchievements = async (updateData, user) => {
  const descriptionAchievementUnlocked = await updateDescriptionAchievement(updateData, user);
  const winGameAchievementUnlocked = await updateWinGameAchievement(user);
  const playTenGamesAchievementUnlocked = await updatePlayTenGamesAchievement(user);

  // You can add more achievement logic here if needed

  return {
    descriptionAchievementUnlocked,
    winGameAchievementUnlocked,
    playTenGamesAchievementUnlocked,
  };
};

// PATCH /user/
const update = async (req, res) => {
  const { userName } = req.body;
  const updateData = {
    displayName: req.body.displayName,
    description: req.body.description || '',
  };

  if (!userName) {
    res.status(400).json({ message: 'Bad request! userName is required!' });
    logger.warn(`[400] PATCH /user userName: ${userName} - UserController: Bad request! Missing userName`);
    return;
  }

  if (!updateData.displayName) {
    res.status(400).json({ message: 'Bad request! displayName is required!' });
    logger.warn(`[400] PATCH /user userName: ${userName} - UserController: Bad request! Missing displayName`);
    return;
  }

  try {
    const user = await User.findOne({ userName });

    if (!user) {
      res.status(404).json({ message: `User ${userName} not found!` });
      logger.warn(`[404] PATCH /user userName: ${userName} - UserController: User not found`);
      return;
    }

    await updateAchievements(updateData, user);
    await User.findOneAndUpdate({ userName }, updateData);

    res.status(200).json({
      message: `User ${userName} updated successfully!`,
      displayName: updateData.displayName,
      description: updateData.description,
    });
    logger.info(`[200] PATCH /user userName: ${userName} - UserController: Update user successful`);
    logger.cont(`displayName: ${updateData.displayName}`);
    logger.cont(`description: ${updateData.description}`);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while updating the user!' });
    logger.error(`[500] PATCH /user userName: ${userName} - UserController: Error occurred while updating user`);
    logger.cont(`Details: ${error}`);
  }
};

// PATCH /user/inventory
const createInventory = (req, res) => {
  const { userName, itemName, quantity } = req.body;

  // Ensure required fields are provided in the request body
  if (!userName || !itemName || !quantity) {
    return res.status(400).json({ message: 'Please provide userName, itemName, and quantity in the request body.' });
  }

  User.findOne({ userName })
    .then((user) => {
      if (!user) {
        // User not found (404)
        return res.status(404).json({ message: `User ${userName} not found!` });
      }

      // Check if the item already exists in the inventory
      const existingItem = user.inventory.find((item) => item.name === itemName);

      if (existingItem) {
        // Item already exists, update its quantity
        existingItem.quantity += quantity;
      } else {
        // Item doesn't exist, add it to the inventory
        user.inventory.push({ name: itemName, quantity });
      }

      // Save the updated user document
      return user.save()
        .then((updatedUser) => {
          logger.info(`[200] PATCH /user/inventory - UserController: Inventory update successful for ${userName}`);
          res.status(200).json({ message: 'Inventory updated successfully', user: updatedUser });
        });
    })
    .catch((error) => {
      logger.error(`[500] PATCH /user/inventory - UserController: Inventory update error occurred for ${userName}`);
      logger.cont(`Details: ${error}`);
      return res.status(500).json({ message: 'Failed to update inventory!' });
    });
};

// PATCH /user/coin
const updateCoins = (req, res) => {
  const { userName, quantity } = req.body;

  // Ensure required fields are provided in the request body
  if (!userName || isNaN(quantity)) {
    return res.status(400).json({ message: 'Please provide userName and a valid quantity in the request body.' });
  }

  User.findOne({ userName })
    .then((user) => {
      if (!user) {
        // User not found (404)
        return res.status(404).json({ message: `User ${userName} not found!` });
      }

      if (quantity > 0) {
        // Add coin to balance
        user.coins += quantity;
      } else if (quantity < 0 && user.coins >= Math.abs(quantity)) {
        // Deduct coins if user has enough balance
        user.coins += quantity;
      } else {
        return res.status(400).json({ message: 'Insufficient balance to deduct coins.' });
      }

      // Save the updated user document
      return user.save()
        .then((updatedUser) => {
          res.status(200).json({ message: 'Coins updated successfully', user: updatedUser });
          logger.info(`[200] PATCH /user/coin - UserController: Coins update successful for ${userName}`);
        });
    })

    .catch((error) => {
      res.status(500).json({ message: 'Failed to update coins!' });
      logger.error(`[500] PATCH /user/coin - UserController: Coins update error occurred for ${userName}`);
      logger.cont(`Details: ${error}`);
    });
};

// GET /user/coin
const getCoinBalance = (req, res) => {
  const { userName } = req.query;

  // Ensure the userName is provided in the query parameters
  if (!userName) {
    return res.status(400).json({ message: 'Please provide a userName in the query parameters.' });
  }

  // Find the user by userName
  User.findOne({ userName })
    .then((user) => {
      if (!user) {
        // User not found (404)
        return res.status(404).json({ message: `User ${userName} not found!` });
      }

      // Return the user's coin balance
      return res.status(200).json({ coinBalance: user.coins });
    })
    .catch((error) => {
      res.status(500).json({ message: 'Failed to retrieve coin balance!' });
      logger.error(`[500] GET /user/coin-balance - UserController: Coin balance retrieval error occurred for ${userName}`);
      logger.cont(`Details: ${error}`);
    });
};

// DELETE /user/
const destroy = (req, res) => {
  const { userName } = req.body;

  if (userName == null || userName === undefined || userName === '') {
    // Missing userName (400)
    res.status(400).json({
      message: 'Bad request! userName is required!',
    });
    logger.warn(`[400] DELETE /user userName: ${userName} - UserController: Bad request! Missing userName`);
    return;
  }

  User.findOne({ userName })
    .then((user) => {
      if (!user) {
        // User not found (404)
        res.status(404).json({
          message: `User ${userName} not found!`,
        });
        logger.warn(`[404] DELETE /user userName: ${userName} - UserController: User not found`);
        return;
      }

      User.findOneAndDelete({ userName })
        .then((response) => {
          res.status(200).json({
            message: `User ${response.userName} was deleted successfully!`,
            response,
          });
          logger.info(`[200] DELETE /user userName: ${userName} - UserController: Delete user successful`);
        })
        .catch((error) => {
          res.status(500).json({
            message: 'Failed to delete user!',
          });
          logger.info(`[500] DELETE /user userName: ${userName} - UserController: Failed to delete user!`);
          logger.cont(`Details: ${error}`);
        });
    })
    .catch((error) => {
      res.status(500).json({
        message: 'Failed to find user!',
      });
      logger.info(`[500] DELETE /user userName: ${userName} - UserController: Failed to find user!`);
      logger.cont(`Details: ${error}`);
    });
};

// PATCH /user/stats
const updateStatistics = (req, res) => {
  const { userName, wordsGuessed } = req.body;

  // Ensure required fields are provided in the request body
  if (!userName || isNaN(wordsGuessed)) {
    logger.error('[400] PATCH /user/stats - UserController: Bad request.');
    return res.status(400).json({ message: 'Please provide userName and wordsGuessed in the body.' });
  }

  User.findOne({ userName })
    .then((user) => {
      if (!user) {
        // User not found (404)
        return res.status(404).json({ message: `User ${userName} not found!` });
      }

      user.gamesPlayed += 1;
      user.wordsGuessed += wordsGuessed;

      // Save the updated user document
      return user.save()
        .then((updatedUser) => {
          res.status(200).json({ message: 'Statistics updated successfully', user: updatedUser });
          logger.info(`[200] PATCH /user/stats - UserController: Statistics update successful for ${userName}`);
        });
    })

    .catch((error) => {
      res.status(500).json({ message: 'Failed to update statistics!' });
      logger.error(`[500] PATCH /user/stats - UserController: Statistics update error occurred for ${userName}`);
      logger.cont(`Details: ${error}`);
    });
};

module.exports = {
  index, update, createInventory, updateCoins, getCoinBalance, destroy, updateStatistics,
};
