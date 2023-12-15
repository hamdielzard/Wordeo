import React, { useEffect } from 'react';
import '../Styles/Game.css';
import Button from '../Components/Button';
import Card from '../Components/Card';
import GameOver from '../Components/Game/Powerups/GameOver';
import { Powerup } from '../Components/Game/Powerups/Powerup';
import PowerupButton from '../Components/Game/Powerups/PowerupButton';
import CoreGame from '../Components/Game/Powerups/CoreGame';
import OldTimer from '../Components/Game/Powerups/Timer';
import RoundOver from '../Components/Game/Powerups/RoundOver';
import GameStart from '../Components/Game/Powerups/GameStart';
import ChatBox from '../Components/Chat';
import {
  postScore, patchCoins, patchStatistics,
} from '../Util/ApiCalls';

const io = require('socket.io-client');

const API_URL = 'http://localhost:8080';
const MP_URL = 'http://localhost:6060';
const socket = io(MP_URL);
const playerName = document.cookie.split(';').some((item) => item.trim().startsWith('displayName=')) ? (`; ${document.cookie}`).split('; displayName=').pop().split(';')[0] : null;
const userNameCK = document.cookie.split(';').some((item) => item.trim().startsWith('userName=')) ? (`; ${document.cookie}`).split('; userName=').pop().split(';')[0] : null;
const gameCode = window.location.pathname.split('/').pop();

function GamePage({
  initialState = false,
  initialCorrectLetters = [],
  lobbyDebug = false,
  data = [],
  usingStub = data.length !== 0,
  numRounds = data.length ? data.length : 10,
  gameMode = 'solo',
}) {
  // VERIFICATION
  if (gameCode === 'game') {
    window.location.pathname = '/';
  }

  // Lobby state
  const [gameCodeCopied, setGameCodeCopied] = React.useState(false);
  const [lobbyShown, setLobbyShown] = React.useState(true);
  const [gameDetails, setGameDetails] = React.useState({
    message: null,
    gameDetails: {
      gameMode,
      gameCode: 'ABCDEF',
    },
    players: null,
    createdAt: null,
    privateGame: null,
    userName: null,
    words: null,
  });
  const [roundCount, setRoundCount] = React.useState(data.length ? data.length : null);
  const [currentRound, setCurrentRound] = React.useState(1);
  const [playerList, setPlayerList] = React.useState([]);
  const [currentScore, setCurrentScore] = React.useState(0);
  const [multiScores, setMultiScores] = React.useState({});
  const [multiWinner, setMultiWinner] = React.useState(null);
  const [coins, setCoins] = React.useState(0);
  // Game states
  /*
   * round - Curr round for the game
   * score - Curr score for the game
   * currWord - Curr word for the game
   * initialScore - Highest possible score for currWord
   * roundEnd - If true, display RoundOver
   * gameStart - If true, display GameStart
   * gameEnd - If true, display GameEnd
   * roundTime - Time given for currWord
   * wordGuessed - If true, word was guessed
   * hintNum - Number of hints to be displayed
   */
  const [gameStatus, updateGameStatus] = React.useState({
    round: 1,
    score: 0,
    currWord: data.length ? data[0] : null,
    initialScore: data.length ? determineWordInitialScore(data[0].difficulty, data[0].word.length) : 0,
    roundEnd: false,
    gameStart: false,
    gameEnd: initialState,
    roundTime: data.length ? determineWordInitialTime(data[0].difficulty, data[0].word.length) : null,
    wordGuessed: false,
    wordsGuessed: 0,
    hintNum: 0,
  });

  // Round States
  /*
   * roundWon - If true, round was won
   * wordSolved - Word that was solved in this round
   * incorrectLettersGuessed - Number of incorrect letters guessed this round
   */
  const [roundStatus, updateRoundStatus] = React.useState({
    roundWon: null,
    wordSolved: null,
    incorrectLettersGuessed: 0,
  });
  const [gameData, setGameData] = React.useState([]);
  const [messages, setMessages] = React.useState([]);

  if (!playerList.includes(playerName)) {
    setPlayerList(playerList.concat(playerName));
  }

  // gameRoundStarted event received
  socket.on('gameRoundStarted', () => {
    setCurrentRound(currentRound + 1);
    setCurrentScore(0);
  });

  // EFFECTS
  useEffect(() => {
    getGameDetails(gameCode);
  }, [gameDetails.gameDetails.gameCode]);

  const [inventory, updateInventory] = React.useState(initializeInventory());

  const [activePowerup, updateActivePowerup] = React.useState('none');

  function initializeInventory() {
    return [new Powerup('Add Time', 0, false), new Powerup('Reveal Letter', 0, false)];
  }

  // Called at the beginning
  // Called whenever game ends, if game ends then post score
  // If game does not end, get new word data
  useEffect(() => {
    if (lobbyDebug === false) {
      if (gameStatus.gameEnd === true) {
        // submit score & update coins
        if (userNameCK) {
          const earnedCoins = Math.floor(gameStatus.score / 30);
          setCoins(earnedCoins);
          postScore(gameDetails.gameDetails.gameMode, userNameCK, gameStatus.score);
          patchCoins(userNameCK, earnedCoins);
          patchStatistics(userNameCK, gameStatus.wordsGuessed);
        }

        socket.emit('submitScore', { playerName, gameCode: gameDetails.gameDetails.gameCode, score: gameStatus.score });
      }
    }
  }, [gameStatus.gameEnd]);

  useEffect(() => {
    const handleNewMessage = (socketData) => {
      // Update the state with the new message
      setMessages((prevMessages) => [...prevMessages, socketData]);
    };

    const fetchUserInventory = async (userName) => {
      const res = await fetch(`${API_URL}/user?userName=${userName}`);
      const userData = await res.json();
      if (userData.response) {
        return userData.response.inventory;
      }

      return [];
    };

    fetchUserInventory(userNameCK).then((res) => {
      if (res.length !== 0) {
        console.log(res);
        const quantities = res.reduce((result, item) => {
          result[item.name] = item.quantity;
          return result;
        }, {});

        const addTime = new Powerup('Add Time', quantities['Add Time'], false);
        const reveal = new Powerup('Reveal Letter', quantities['Reveal Letter'], false);

        updateInventory([addTime, reveal]);
      }
    });

    // SOCKET IO
    // playerJoined event received
    socket.on('playerJoined', (socketData) => {
      if (playerList.includes(socketData.playerName)) {
        return;
      }
      setPlayerList(playerList.concat(socketData.playerName));

      // Also emit to the server that I am in the game too
      socket.emit('iAmHereToo', { gameCode, playerName });
    });

    // youAreHereToo event received
    socket.on('youAreHereToo', (socketData) => {
      if (playerList.includes(socketData.playerName)) {
        return;
      }
      setPlayerList(playerList.concat(socketData.playerName));
    });

    // playerLeft event received
    socket.on('playerLeft', (socketData) => {
      setPlayerList(playerList.filter((player) => player !== socketData.playerName));
    });

    // gameStarted event received
    socket.on('gameStarted', (socketData) => {
      setGameData(socketData);
      updateGameStatus((prev) => ({
        ...prev,
        currWord: socketData[0],
        initialScore: determineWordInitialScore(socketData[0].difficulty, socketData[0].word.length),
        roundTime: determineWordInitialTime(socketData[0].difficulty, socketData[0].word.length),
      }));
      setRoundCount(socketData.length);
    });

    socket.on('gameResult', (socketData) => {
      setMultiScores(socketData);

      // determine the winner
      let winner = null;
      let highestScore = -1;

      Object.entries(socketData).forEach(([name, score]) => {
        if (score > highestScore) {
          winner = name;
          highestScore = score;
        }
      });

      setMultiWinner(winner);
    });

    socket.on('message-lobby', handleNewMessage);

    return () => {
      socket.off('message-lobby', handleNewMessage);
    };
  }, []);

  function startClientGame() {
    updateGameStatus((prev) => ({
      ...prev,
      gameStart: true,
    }));
    setLobbyShown(false);
  }

  useEffect(() => {
    // start game if data is loaded and gameStart component is not displayed
    if (gameData.length !== 0) {
      startClientGame();
    }
  }, [gameData]);

  // LOBBY
  if (lobbyShown && !lobbyDebug) {
    return (
      <div className="lobbyPage">
        <div className="lobbyHeader">
          <div className="lobbyHeaderSide rightHead">
            Game Code: ‎
            <span className="lobbyGameCode" onClick={() => { copyGameCode(); }}>
              {gameCodeCopied ? 'copied!' : (gameDetails.gameDetails.gameCode ? gameDetails.gameDetails.gameCode : 'Loading gameCode')}
            </span>
          </div>
          <div className="lobbyHeaderSide">
            {gameDetails.gameDetails.gameMode ? (gameDetails.gameDetails.gameMode === 'solo' ? 'Solo Play' : 'Multiplayer') : 'Loading gameMode'}
          </div>
          <div className="lobbyHeaderSide leftHead">
            {playerName || 'Loading userName'}
          </div>
        </div>
        <div className="lobbyInteractive">
          <div className="rightHead lobbyIntSide">
            <div className="largeLabelLobby">
              Game Settings
              <div className="lobbySetting">
                <span className="mediumLabel">Puzzles</span>
                <span className="mediumLabel bold">{gameDetails.gameDetails.puzzleCount ? gameDetails.gameDetails.puzzleCount : '10'}</span>
              </div>
              <div className="lobbySetting">
                <span className="mediumLabel">Category</span>
                <span className="mediumLabel bold">{gameDetails.gameDetails.category ? gameDetails.gameDetails.category : 'ALL'}</span>
              </div>
              <div className="lobbySetting">
                <span className="mediumLabel">Owner</span>
                <span className="mediumLabel bold">{gameDetails.userName ? gameDetails.userName : 'No owner'}</span>
              </div>
              <div className="lobbyButtons">
                <Button label="Start Game" type="secondary" onClick={() => { startGame(); }} />
                <Button label="Leave Lobby" type="ternary" onClick={() => { leaveLobby(); }} />
              </div>
            </div>
            <div className="lobbyChat">
              <ChatBox messages={messages} sendMessage={sendMessage} />
            </div>
          </div>
          <div className="lobbyIntSide leftHead playerListTB">
            <div className="largeLabelLobby">
              Players
            </div>
            <div className="lobbyPlayerList">
              {playerList.map((player, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <Card name={player} key={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  // GAME PAGE
  if (!lobbyShown || lobbyDebug) {
    return (
      <div className="lobbyPage">
        <div className="lobbyHeader">
          <div className="lobbyHeaderSide rightHead">
            Score: ‎
            <span className="lobbyGameCode" onClick={() => { }}>
              {currentScore}
            </span>
          </div>
          <div className="lobbyHeaderSide">
            Round
            {' '}
            {currentRound}
            {' '}
            of
            {' '}
            {roundCount}
          </div>
          <div className="lobbyHeaderSide leftHead">
            {playerName || 'Loading userName'}
          </div>
        </div>
        {(gameStatus.gameEnd && !gameStatus.roundEnd)
          && (
            <GameOver
              score={currentScore}
              coins={coins}
              gameMode={gameDetails.gameDetails.gameMode}
              multiScores={multiScores}
              multiWinner={multiWinner}
              restartGame={restartGame}
            />
          )}
        {(gameStatus.gameStart)
          && (
            <GameStart
              startCoreGame={startCoreGame}
            />
          )}
        {(!gameStatus.gameEnd && !gameStatus.gameStart && !gameStatus.roundEnd)
          && (
            <div className="gameInteractive">
              <div className="gamePowerups">
                <PowerupButton
                  powerups={inventory}
                  powerupHandler={powerupHandler}
                  activePowerup={activePowerup}
                />
              </div>
              <div className="gameTimer">
                <OldTimer
                  initialTime={gameStatus.roundTime}
                  wordGuessed={gameStatus.wordGuessed}
                  onEnd={roundEnd}
                  timePenalty={2}
                  incorrectLettersGuessed={roundStatus.incorrectLettersGuessed}
                  activePowerup={activePowerup}
                  powerupOnConsume={powerupOnConsume}
                  updateHint={updateHint}
                />
              </div>
              <CoreGame
                wordData={gameStatus.currWord}
                roundEnd={wordGuessed}
                incorrectLetterGuessed={incorrectLetterWasGuessed}
                activePowerup={activePowerup}
                powerupOnConsume={powerupOnConsume}
                initialCorrectLetters={initialCorrectLetters}
                hintNum={gameStatus.hintNum}
              />
            </div>
          )}
        {(!gameStatus.gameEnd && !gameStatus.gameStart && gameStatus.roundEnd)
          && (
            <RoundOver
              word={roundStatus.wordSolved}
              restartRound={restartRound}
              roundWon={roundStatus.roundWon}
              lastWord={false}
            />
          )}
        {(gameStatus.gameEnd && !gameStatus.gameStart && gameStatus.roundEnd)
          && (
            <RoundOver
              word={roundStatus.wordSolved}
              restartRound={restartRound}
              roundWon={roundStatus.roundWon}
            />
          )}
      </div>
    );
  }

  // GAME FUNCTIONS

  // Called by GameStart.jsx to stop displaying start screen
  function startCoreGame() {
    updateGameStatus((prev) => ({
      ...prev,
      gameStart: false,
    }));
  }

  // Called by CoreGame.js whenever a word was guessed, wordGuessed is set to true,
  // Since gameStatus.wordGuessed is a dependency of Timer.js, Timer.js will respond to this
  // change in state
  function wordGuessed() {
    updateGameStatus((prev) => ({
      ...prev,
      wordGuessed: true,
      wordsGuessed: (prev.wordsGuessed || 0) + 1,
    }));
  }

  // Called by Timer.js when either time has run out, or user has solved the word
  function roundEnd(timeStarted, timeSolved) {
    const scoreEarned = determineFinalScore(timeStarted, timeSolved, gameStatus.initialScore);
    // Duplicate powerups and make all powerups available again
    // updateInventory(prevInventory => prevInventory.map(powerup => new Powerup(powerup.name, powerup.quantity, false)))

    if (scoreEarned === 0) {
      updateRoundStatus((prev) => ({
        ...prev,
        wordSolved: gameStatus.currWord.word,
        roundWon: false,
      }));
    } else {
      updateRoundStatus((prev) => ({
        ...prev,
        wordSolved: gameStatus.currWord.word,
        roundWon: true,
      }));
    }

    setCurrentScore((prev) => prev + scoreEarned);

    // Duplicate powerups and make all powerups available again
    updateInventory((prevInventory) => prevInventory.map((powerup) => new Powerup(powerup.name, powerup.quantity, false)));

    if (gameStatus.round + 1 <= gameData.length) {
      setCurrentRound((prev) => prev + 1);

      updateGameStatus((prev) => ({
        ...prev,
        round: prev.round + 1,
        score: prev.score + scoreEarned,
        currWord: gameData[prev.round],
        initialScore: determineWordInitialScore(gameData[prev.round].difficulty, gameData[prev.round].word.length),
        roundTime: determineWordInitialTime(gameData[prev.round].difficulty, gameData[prev.round].word.length),
        roundEnd: true,
        wordGuessed: false,
        hintNum: 0,
      }));
    } else {
      // game ended
      updateGameStatus((prev) => ({
        ...prev,
        score: prev.score + scoreEarned,
        roundEnd: true,
        gameEnd: true,
        roundTime: 0,
      }));
    }
  }

  // Called by Timer.js every 5 seconds
  // Increments number of hints to be displayed
  function updateHint() {
    updateGameStatus((prev) => ({
      ...prev,
      hintNum: (prev.hintNum + 1),
    }));
  }

  // Called by CoreGame.js whenever an incorrect letter was guessed
  function incorrectLetterWasGuessed() {
    updateRoundStatus((prev) => ({
      incorrectLettersGuessed: prev.incorrectLettersGuessed + 1,
    }));
  }

  // Called by RoundOver to restart the round
  function restartRound() {
    updateRoundStatus({
      incorrectLettersGuessed: 0,
    });

    updateGameStatus((prev) => ({
      ...prev,
      roundEnd: false,
    }));
  }

  function restartGame() {
    startGame();
    updateGameStatus({
      round: 1,
      score: 0,
      currWord: gameData[0],
      gameEnd: false,
      gameStart: false, // this is set by startClientGame
      roundEnd: false,
      initialScore: determineWordInitialScore(gameData[0].difficulty, gameData[0].word.length),
      roundTime: determineWordInitialTime(gameData[0].difficulty, gameData[0].word.length),
      wordGuessed: false,
      hintNum: 0,
    });
    setCurrentRound(1);
    setCurrentScore(0);
  }

  // Called when a power up button is clicked
  function powerupHandler(powerup) {
    // Powerups can only be used once per round
    if (!powerup.hasActivated) {
      powerup.quantity -= 1;
      powerup.hasActivated = true;

      if (powerup.name === 'Add Time') {
        updateActivePowerup('Add Time');
      } else if (powerup.name === 'Reveal Letter') {
        updateActivePowerup('Reveal Letter');
      }
    }
  }

  // Called after a powerup has been used
  function powerupOnConsume() {
    updateActivePowerup('none');
  }

  // Chat Functions
  // Called by the ChatBox child component to send messages
  function sendMessage(message) {
    const newMessage = {
      playerName,
      message,
      gameCode: gameDetails.gameDetails.gameCode,
    };

    socket.emit('message-lobby', newMessage);
  }

  // HELPER FUNCTIONS

  /**
     * Gets game details and if valid joins the game lobby
     * @param {string} code Game code to get details for
     * @returns Game details object
     */
  async function getGameDetails(code) {
    const response = await fetch(`${API_URL}/game?gameCode=${code}`);
    if (response.status === 200) {
      const resData = await response.json();
      socket.emit('join-lobby', { gameCode, playerName });
      setGameDetails(resData);
    } else if (response.status === 404) {
      window.location.pathname = '/';
    } else {
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
    socket.emit('leave-lobby', { gameCode, playerName });
    window.location.pathname = '/';
  }

  /**
     * **Starts the game**
     */
  function startGame() {
    // Check if I am the owner
    if (userNameCK === gameDetails.userName) {
      socket.emit('start-game', { gameCode, playerName, count: numRounds });
    } else {
      alert('You are not the owner of this game!');
    }

    // when loading data from stubs, update the data only when startGame is called
    if (usingStub) {
      setGameData(data);
    }
  }
}

// Helper functions

/**
 * **Calculate initial time and score of a puzzle**
 *
 * @param {int} difficulty Difficulty of word, should range between 1 to 10, but will accept vals below 0 and higher than 10.
 * @param {int} wordLength The length of the word (unimplemented, maybe easier LONGER words should take longer to solve)
 * @returns Array of [initialTime, initialScore]
 */
// eslint-disable-next-line no-unused-vars
function determineWordInitialTime(difficulty, wordLength) {
  if (difficulty <= 2) {
    // 0 to 2
    return 15;
  }
  if (difficulty <= 6) {
    // 3 to 6
    return 20;
  }
  if (difficulty <= 8) {
    // 7 to 8
    return 25;
  }
  if (difficulty <= 10) {
    // 9 to 10
    return 30;
  }

  // 11+
  return 30;
}

// eslint-disable-next-line no-unused-vars
function determineWordInitialScore(difficulty, wordLength) {
  if (difficulty <= 2) {
    // 0 to 2
    return 1000;
  }
  if (difficulty <= 6) {
    // 3 to 6
    return 2000;
  }
  if (difficulty <= 8) {
    // 7 to 8
    return 3000;
  }
  if (difficulty <= 10) {
    // 9 to 10
    return 4000;
  }

  // 11+
  return 5000;
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
  const timeDifference = timeStarted - timeSolved;

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

export default GamePage;
