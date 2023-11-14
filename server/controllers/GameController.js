const logger = require('../logger')
const User = require('../models/user')
const Scores = require('../models/scores')

const DEBUGGING = false;

let lobbies = [];

/**
 * Handle CLI input
 */
process.stdin.on('data', (data) => {
    if (data.toString().trim() === 'games' || data.toString().trim() === 'g') {
        console.log("GAMES ONLINE:");
        console.log(lobbies);
        console.log("\n");
    }
    else if (data.toString().trim() === 'games clean' || data.toString().trim() === 'g clean') {
        cleanupLobbies();
    }
    else if (data.toString().trim() === 'games clean all' || data.toString().trim() === 'g clean all') {
        lobbies = [];
    }
});

/**
 * **POST /lobby**
 * 
 * @see {@link createLobby}
 */
const create = (req, res, next) => {
    // Create a new lobby server-side and return the game code
    // If single player, create a new game with private game code
    // If multiplayer, create a new game with public game code.

    // Verify game mode requested is single player or multiplayer
    const gameMode = req.body.gameMode;
    const userName = req.body.userName;

    // Verify game mode requested is single player or multiplayer
    if (gameMode == null || gameMode == undefined || gameMode == "") {
        res.status(400).json({
            message: 'Game mode not provided!'
        })
        logger.warn(`[400] POST /game - GameController: Game mode not provided`)
        return
    }
    else if (!Object.values(Scores.Modes).includes(gameMode)) {
        res.status(404).json({
            message: `The provided game mode: ${gameMode} was invalid`
        })
        logger.warn(`[404] POST /game - GameController: Invalid game mode provided: ${gameMode}`)
        return
    }

    // Verify User requesting lobby creation is a real user
    if (userName == null || userName == undefined || userName == "") {
        res.status(400).json({
            message: 'User name not provided!'
        })
        logger.warn(`[400] POST /game - GameController: User name not provided`)
        return
    }
    else {
        try {
            if (User.findOne({ userName: userName }) == null) {
                res.status(404).json({
                    message: `User ${userName} not found!`
                })
                logger.warn(`[404] POST /game - GameController: User not found`)
                return
            }
            else {
                // Satisfies all conditions, create a new lobby
                const privateGame = gameMode === Scores.Modes.Solo; // If single player, lobby is private
                const lobby = createLobby(gameMode, userName, privateGame);
                res.status(200).json({
                    message: 'Lobby created successfully!',
                    gameDetails: lobby.gameDetails,
                    players: lobby.players,
                    createdAt: lobby.createdAt,
                    privateGame: lobby.privateGame,
                    userName: lobby.userName
                })
                logger.info(`[200] POST /game - GameController: Game ${lobby.gameDetails.gameCode} created successfully by ${lobby.userName}`)
                return
            }
        }
        catch (error) {
            res.status(500).json({
                message: 'Failed to create lobby!'
            })
            logger.error(`[500] POST /game - GameController: Lobby creation error occurred`)
            logger.cont(`Details: ${error}`)
            return
        }
    }

}

const get = (req, res, next) => {
    const gameCode = req.query.gameCode;

    // Verify game code provided
    if (gameCode == null || gameCode == undefined || gameCode == "") {
        res.status(400).json({
            message: 'Game code not provided!'
        })
        logger.warn(`[400] GET /game - GameController: Game code not provided`)
        return
    }
    else {
        try {
            // Find the lobby with the given game code
            const lobby = findLobby(gameCode);

            // If lobby not found, return 404
            if (lobby == null) {
                res.status(404).json({
                    message: `Lobby with game code ${gameCode} not found!`
                })
                logger.warn(`[404] GET /game - GameController: Lobby not found`)
                return
            }
            else {
                // Lobby found, return the lobby
                res.status(200).json(lobby)
                logger.info(`[200] GET /game - GameController: Lobby ${lobby.gameDetails.gameCode} found`)
                return
            }

        }
        catch (error) {
            res.status(500).json({
                message: 'Failed to get lobby!'
            })
            logger.error(`[500] GET /game - GameController: Lobby get error occurred`)
            logger.cont(`Details: ${error}`)
            return
        }
    }
}

module.exports = {
    create, get
}

// Helper functions

/**
 * **Generates a random 6 character game code**
 * 
 * @returns (string) a randomly generated 6 character game code
 */
const generateGameCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    let gameCode = '';
    for (let i = 0; i < 6; i++) {
        gameCode += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return gameCode;
}

/**
 * **Creates a new lobby and saves it to the lobbies array**
 * 
 * @see {@link generateGameCode} for how the game code is generated
 * @see {@link cleanupLobbies} for how expired lobbies are cleaned up
 * @see {@link findLobby} for how the lobby is found in the lobbies array using the game code
 * @see {@link findPlayer} for how the lobby is found in the lobbies array using the player's user name
 * @see {@link create} for how the lobby is created in the POST /lobby route
 * 
 * @param {Scores.Modes} gameMode Game mode of the lobby to create
 * @param {string} userName User name of the player creating the lobby
 * @param {boolean} privateGame Boolean indicating whether the lobby is private or not
 * @param {Object} customSettings Optional custom settings for the lobby
 * @returns Lobby object representing the lobby that was created
 */
const createLobby = (gameMode, userName, privateGame, customSettings = {}) => {
    const lobby = {
        gameDetails: {
            ...customSettings,
            gameMode: gameMode,
            gameCode: generateGameCode()
        },
        players: [],
        gameMode: gameMode,
        gameStarted: false,
        createdAt: Date.now(),
        privateGame: privateGame,
        userName: userName
    };
    lobbies.push(lobby);
    return lobby;
}

/**
 * **Cleans up expired lobbies**
 * 
 * Expired lobbies are lobbies that have been created for more than 3 minutes and have no players
 * 
 * This function gets called every 30 minutes, or every 20 seconds if {@link DEBUGGING|`DEBUGGING`} flag is set to true
 * 
 */
const cleanupLobbies = () => {
    logger.info(`GameController: Cleaning up expired lobbies...`);
    const now = Date.now();
    const expiredLobbies = lobbies.filter(lobby => {
        const lobbyAge = now - lobby.createdAt;
        const lobbyEmpty = lobby.players.length === 0;
        // If debugging, set to 3 minutes, otherwise 5 seconds
        const lobbyExpired = lobbyAge > (DEBUGGING ? 5000 : 180000);
        return lobbyEmpty && lobbyExpired;
    });
    expiredLobbies.forEach(lobby => {
        const index = lobbies.indexOf(lobby);
        lobbies.splice(index, 1);
    });
};

/**
 * **Finds the lobby with the given game code*
 * 
 * Used in {@link join} to find the lobby with the given game code
 * 
 * @param {string} gameCode six character game code to search for
 * @returns Lobby with the given game code or undefined if not found
 */
const findLobby = (gameCode) => {
    return lobbies.find(lobby => lobby.gameDetails.gameCode === gameCode);
}

/**
 * **Finds the lobby that the player has created**
 * 
 * Used in {@link join} to find the lobby that the player has created
 * 
 * @param {string} userName User name of the player to find
 * @returns Lobby that the player has created or undefined if not found
 */
const findPlayer = (userName) => {
    return lobbies.find(lobby => lobby.players.find(player => player.userName === userName));
}

// Run cleanupLobbies every 30 minutes, or every 20 seconds if debugging
setInterval(cleanupLobbies, (DEBUGGING ? 20000 : 30 * 60 * 1000));

// If debugging, print the lobbies array every 5 seconds
if (DEBUGGING) {
    // Every 5 seconds, print the lobbies array
    setInterval(() => {
        console.log("[DEBUG] LOBBIES:" + lobbies);
    }, 5000);
}