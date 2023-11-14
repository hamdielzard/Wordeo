import React, { useEffect } from 'react'
import '../Styles/Game.css'
import Button from '../Components/Button'
const io = require('socket.io-client');


const API_URL = 'http://localhost:8080';
const MP_URL = 'http://localhost:6060';
const socket = io(MP_URL);
const playerName = document.cookie.split(";").some((item) => item.trim().startsWith("displayName=")) ? ('; ' + document.cookie).split(`; displayName=`).pop().split(';')[0] : null;
const gameCode = window.location.pathname.split("/").pop();


const GamePage = () => {
    // VERIFICATION
    if (gameCode === "game") {
        window.location.pathname = '/';
    }


    // STATE
    const [lobbyShown, setLobbyShown] = React.useState(false);
    const [gameDetails, setGameDetails] = React.useState({
        message: null,
        gameDetails: {
            gameMode: null,
            gameCode: "ABCDEF",
        },
        players: null,
        createdAt: null,
        privateGame: null,
        userName: null
    });
    const [wordList, setWordList] = React.useState([]);
    const [roundCount, setRoundCount] = React.useState(0);


    // SOCKET IO
    socket.on('playerJoined', (data) => {
        console.log(data);
    });


    // EFFECTS
    useEffect(() => {
        getGameDetails(gameCode).then((data) => {
            setGameDetails(data);
        });
        
        setWordList([{
            "word": "test",
            "hints": [
                "test",
                "test",
                "test",
            ],
            "category": "application",
            "difficulty": 1,
        }])
    }, []);


    // LOBBY
    if (lobbyShown) {
        return (<div className="lobbyPage">
            <div className="lobbyHeader">
                <div className="lobbyHeaderSide rightHead">
                    Game Code: ‎
                    <span className="lobbyGameCode" onClick={() => { }}>
                        {gameDetails.gameDetails.gameCode ? gameDetails.gameDetails.gameCode : "Loading gameCode"}
                    </span>
                </div>
                <div className="lobbyHeaderSide">
                    {gameDetails.gameDetails.gameMode ? gameDetails.gameDetails.gameMode : "Loading gameMode"}
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
                            <Button label="Start Game" type={"secondary"} onClick={() => { socket.emit('message', "hello world") }} />
                            <Button label="Leave Lobby" type={'ternary'} onClick={() => { leaveLobby() }} />
                        </div>
                    </div>
                    <div className="lobbyChat">
                        Chat
                    </div>
                </div>
                <div className="lobbyIntSide leftHead">
                    <div className="largeLabelLobby">
                        Players
                    </div>
                    <div className="lobbyPlayerList">
                        No players yet!
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
                        0
                    </span>
                </div>
                <div className="lobbyHeaderSide">
                    Round 1
                </div>
                <div className="lobbyHeaderSide leftHead">
                    {playerName ? playerName : "Loading userName"}
                </div>
            </div>
            <div className="gameInteractive">
                <div className='gameTimer'>
                    
                </div>
                <div className='gameClue'>
                    
                </div>
                <div className='gameLetterBoxes'>
                    
                </div>
                <div className='gameLetterIncorrectBoxes'>
                    
                </div>
            </div>
        </div>)
    }
    // HELPER FUNCTIONS

    /**
     * Leaves the lobby and returns to the home page
     */
    function leaveLobby() {
        socket.emit('leave-lobby', { "gameCode": gameCode, "playerName": playerName })
        window.location.pathname = '/';
    }

    function startGame() {
        socket.emit('start-game', { "gameCode": gameCode, "playerName": playerName })
        setLobbyShown(false);
    }

};

// Helper functions

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
        return data;
    } else {
        throw new Error('Failed to fetch game details');
    }
}




export default GamePage