import React, { useEffect } from 'react'
import '../Styles/Game.css'
import Button from '../Components/Button'
import Card from '../Components/Card';
import Timer from '../Components/Timer';
import LetterBox from '../Components/LetterBox';
const io = require('socket.io-client');


const API_URL = 'http://localhost:8080';
const MP_URL = 'http://localhost:6060';
const socket = io(MP_URL);
const playerName = document.cookie.split(";").some((item) => item.trim().startsWith("displayName=")) ? ('; ' + document.cookie).split(`; displayName=`).pop().split(';')[0] : null;
const userNameCK = document.cookie.split(";").some((item) => item.trim().startsWith("userName=")) ? ('; ' + document.cookie).split(`; userName=`).pop().split(';')[0] : null;
const gameCode = window.location.pathname.split("/").pop();


const GamePage = () => {
    // VERIFICATION
    if (gameCode === "game") {
        window.location.pathname = '/';
    }


    // STATE
    const [gameCodeCopied, setGameCodeCopied] = React.useState(false);
    const [lobbyShown, setLobbyShown] = React.useState(true);
    const [gameDetails, setGameDetails] = React.useState({
        message: null,
        gameDetails: {
            gameMode: null,
            gameCode: "ABCDEF",
        },
        players: null,
        createdAt: null,
        privateGame: null,
        userName: null,
        words: null,
    });
    const [wordList, setWordList] = React.useState(null);
    const [roundCount, setRoundCount] = React.useState(null);
    const [currentRound, setCurrentRound] = React.useState(0);
    const [playerList, setPlayerList] = React.useState([]);
    const [currentScore, setCurrentScore] = React.useState(0);
    const [sentStarted, setSentStarted] = React.useState(false);


    if (!playerList.includes(playerName)) {
        setPlayerList(playerList.concat(playerName));
    }



    // SOCKET IO
    // playerJoined event received
    socket.on('playerJoined', (data) => {
        if (playerList.includes(data.playerName)) {
            return;
        }
        setPlayerList(playerList.concat(data.playerName));

        // Also emit to the server that I am in the game too
        socket.emit('iAmHereToo', { "gameCode": gameCode, "playerName": playerName })
    });

    // youAreHereToo event received
    socket.on('youAreHereToo', (data) => {
        if (playerList.includes(data.playerName)) {
            return;
        }
        setPlayerList(playerList.concat(data.playerName));
    });

    // playerLeft event received
    socket.on('playerLeft', (data) => {
        setPlayerList(playerList.filter((player) => player !== data.playerName));
    });

    // gameStarted event received
    socket.on('gameStarted', (data) => {
        if (lobbyShown) {
            startClientGame();
        }
    });

    // gameRoundStarted event received
    socket.on('gameRoundStarted', (data) => {
        setCurrentRound(currentRound + 1);
        setCurrentScore(0);
    });


    // EFFECTS
    useEffect(() => {
        getGameDetails(gameCode);
    }, [gameDetails.gameDetails.gameCode]);


    // LOBBY
    if (lobbyShown) {
        return (<div className="lobbyPage">
            <div className="lobbyHeader">
                <div className="lobbyHeaderSide rightHead">
                    Game Code: ‎
                    <span className="lobbyGameCode" onClick={() => { copyGameCode() }}>
                        {gameCodeCopied ? "copied!" : (gameDetails.gameDetails.gameCode ? gameDetails.gameDetails.gameCode : "Loading gameCode")}
                    </span>
                </div>
                <div className="lobbyHeaderSide">
                    {gameDetails.gameDetails.gameMode ? (gameDetails.gameDetails.gameMode === "solo" ? "Solo Play" : "Multiplayer") : "Loading gameMode"}
                </div>
                <div className="lobbyHeaderSide leftHead">
                    {playerName ? playerName : "Loading userName"}
                </div>
            </div>
            <div className="lobbyInteractive">
                <div className="rightHead lobbyIntSide">
                    <div className="largeLabelLobby">
                        Game Settings
                        <div className="lobbySetting">
                            <span className="mediumLabel">Puzzles</span>
                            <span className="mediumLabel bold">{gameDetails.gameDetails.puzzleCount ? gameDetails.gameDetails.puzzleCount : "10"}</span>
                        </div>
                        <div className="lobbySetting">
                            <span className="mediumLabel">Category</span>
                            <span className="mediumLabel bold">{gameDetails.gameDetails.category ? gameDetails.gameDetails.category : "ALL"}</span>
                        </div>
                        <div className="lobbySetting">
                            <span className="mediumLabel">Owner</span>
                            <span className="mediumLabel bold">{gameDetails.userName ? gameDetails.userName : "No owner"}</span>
                        </div>
                        <div className="lobbyButtons">
                            <Button label="Start Game" type={"secondary"} onClick={() => { startGame() }} />
                            <Button label="Leave Lobby" type={'ternary'} onClick={() => { leaveLobby() }} />
                        </div>
                    </div>
                    <div className="lobbyChat">
                        Chat
                    </div>
                </div>
                <div className="lobbyIntSide leftHead playerListTB">
                    <div className="largeLabelLobby">
                        Players
                    </div>
                    <div className="lobbyPlayerList">
                        {playerList.map((player, index) => {
                            return (
                                <Card name={player} key={index} />
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>)
    }
    // GAME PAGE
    else {
        return (<div className="lobbyPage">
            <div className="lobbyHeader">
                <div className="lobbyHeaderSide rightHead">
                    Score: ‎
                    <span className="lobbyGameCode" onClick={() => { }}>
                        {currentScore}
                    </span>
                </div>
                <div className="lobbyHeaderSide">
                    Round {currentRound} of {roundCount}
                </div>
                <div className="lobbyHeaderSide leftHead">
                    {playerName ? playerName : "Loading userName"}
                </div>
            </div>
            <div className="gameInteractive">
                <div className='gameTimer'>
                    <Timer initialTime={10000} onTimerComplete={() => { }} />
                </div>
                <div className='gameMain'>
                    <div className='gameClue'>
                        Clue
                    </div>
                    <div className='gameLetterBoxes'>
                        <LetterBox letter={"A"} correct={true} />
                        <LetterBox />
                        <LetterBox />
                    </div>
                    <div className='gameLetterBoxes'>
                        <LetterBox letter={"B"} correct={false} />

                    </div>
                </div>
            </div>
        </div>)
    }
    // HELPER FUNCTIONS


    /**
     * Gets game details and if valid joins the game lobby
     * @param {string} gameCode Game code to get details for
     * @returns Game details object
     */
    async function getGameDetails(gameCode) {
        const response = await fetch(API_URL + `/game?gameCode=${gameCode}`);
        if (response.status === 200) {
            const data = await response.json();
            socket.emit('join-lobby', { "gameCode": gameCode, "playerName": playerName })
            setGameDetails(data);
        }
        else if (response.status === 404) {
            window.location.pathname = '/';
        }
        else {
            throw new Error('Failed to fetch game details');
        }
    }

    /**
     * **Copy the game code to the clipboard**
     */
    function copyGameCode() {
        navigator.clipboard.writeText(gameDetails.gameDetails.gameCode);
        setGameCodeCopied(true);
        setTimeout(() => {
            setGameCodeCopied(false);
        }, 800);
    }

    /**
     * **Leaves the lobby and returns to the home page**
     */
    function leaveLobby() {
        socket.emit('leave-lobby', { "gameCode": gameCode, "playerName": playerName })
        window.location.pathname = '/';
    }

    /**
     * **Starts the game**
     */
    function startGame() {
        // Check if I am the owner
        if (userNameCK === gameDetails.userName) {
            socket.emit('start-game', { "gameCode": gameCode, "playerName": playerName })
            startClientGame();
        }
        else {
            alert("You are not the owner of this game!")
        }
    }

    function startClientGame() {
        setLobbyShown(false);
        console.log(gameDetails)
        //setWordList(gameDetails.words);
        //setRoundCount(gameDetails.words.length);
    }

    function getPuzzleAtCurrentRound() {
        return wordList[currentRound - 1];
    }

    function progressRound() {
        if (currentRound === roundCount) {
            endGame();
        }
        else {
            setCurrentRound(currentRound + 1);
        }
    }

    function endGame() {
        console.log("Game ended")
    }

};

// Helper functions



/**
 * **Calculate initial time and score of a puzzle**
 * 
 * @param {int} difficulty Difficulty of word, should range between 1 to 10, but will accept vals below 0 and higher than 10.
 * @param {int} wordLength The length of the word (unimplemented, maybe easier LONGER words should take longer to solve)
 * @returns Array of [initialTime, initialScore]
 */
function determineWordInitialTimeAndScore(difficulty, wordLength) {
    if (difficulty <= 2) {
        // 0 to 2
        return [15, 1000];
    }
    else if (difficulty <= 6) {
        // 3 to 6
        return [20, 2000];
    }
    else if (difficulty <= 8) {
        // 7 to 8
        return [25, 3000];
    }
    else if (difficulty <= 10) {
        // 9 to 10
        return [30, 4000];
    }
    else {
        // 11+
        return [30, 5000];
    }
}

/**
 * **Calculate final score of a puzzle**
 * 
 * @param {int} timeStarted The time the word was shown
 * @param {int} timeSolved How much time was left when the word was solved
 * @param {int} initialPossibleScore Initial score for the puzzle
 * @returns Final score int
 */
function determineFinalScore(timeStarted, timeSolved, initialPossibleScore) {
    // Time started is the time the word was shown
    // Time solved is how much time was left when the word was solved
    // Time difference is how much time it took to solve the word
    let timeDifference = timeSolved - timeStarted;

    // If the time solved is 0, then the word was not solved
    if (timeSolved === 0) {
        return 0;
    }

    // If the time difference is negative, then the word was solved after the timer ran out
    if (timeDifference < 0) {
        return 0; // Should not happen
    }

    // Calculate the score
    let score = initialPossibleScore - (timeDifference * 100);
    if (score < 0) {
        score = 0;
    }
    return score;
}




export default GamePage