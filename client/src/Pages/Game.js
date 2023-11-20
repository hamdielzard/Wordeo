import React, { useEffect } from 'react';
import '../Styles/Game.css';
import Button from '../Components/Button';
import Card from '../Components/Card';
import GameOver from '../Components/OldGame/GameOver';
import { Powerup } from '../Components/Game/Powerups/Powerup';
import PowerupButton from '../Components/Game/Powerups/PowerupButton';
import CoreGame from '../Components/OldGame/CoreGame';
import OldTimer from '../Components/OldGame/OldTimer';
import { fetchWords, postScore } from '../Util/ApiCalls';

const io = require('socket.io-client');

const API_URL = 'http://localhost:8080';
const MP_URL = 'http://localhost:6060';
const socket = io(MP_URL);
const playerName = document.cookie.split(';').some((item) => item.trim().startsWith('displayName=')) ? (`; ${document.cookie}`).split('; displayName=').pop().split(';')[0] : null;
const userNameCK = document.cookie.split(';').some((item) => item.trim().startsWith('userName=')) ? (`; ${document.cookie}`).split('; userName=').pop().split(';')[0] : null;
const gameCode = window.location.pathname.split('/').pop();

function GamePage({
  initialLoad = true,
  initialState = false,
  initialCorrectLetters = [],
  lobbyDebug = false, data = [],
  numRounds = data.length ? data.length : 10,
}) {
  const user = 'Guest';
  const userId = '';

  // VERIFICATION
  if (gameCode === 'game') {
    window.location.pathname = '/';
  }

  // STATE
  const [gameCodeCopied, setGameCodeCopied] = React.useState(false);
  const [lobbyShown, setLobbyShown] = React.useState(true);
  const [gameDetails, setGameDetails] = React.useState({
    message: null,
    gameDetails: {
      gameMode: null,
      gameCode: 'ABCDEF',
    },
    players: null,
    createdAt: null,
    privateGame: null,
    userName: null,
    words: null,
  });
  const [wordList, setWordList] = React.useState(null);
  const [roundCount, setRoundCount] = React.useState(data.length ? data.length : null);
  const [currentRound, setCurrentRound] = React.useState(1);
  const [playerList, setPlayerList] = React.useState([]);
  const [currentScore, setCurrentScore] = React.useState(0);
  const [sentStarted, setSentStarted] = React.useState(false);

  // Game states
  const [gameStatus, updateGameStatus] = React.useState({
    round: 1,
    score: 0,
    currWord: data.length ? data[0] : null,
    initialScore: data.length ? determineWordInitialScore(data[0].difficulty, data[0].word.length) : 0,
    gameEnd: initialState,
    roundTime: null,
    wordGuessed: false,
  });
  const [roundStatus, updateRoundStatus] = React.useState({
    incorrectLettersGuessed: 0,
  });
  const [loading, setLoading] = React.useState(initialLoad);
  const [gameData, setGameData] = React.useState(data);

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
    socket.emit('iAmHereToo', { gameCode, playerName });
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

  const [inventory, updateInventory] = React.useState(initializeInventory());

  const [activePowerup, updateActivePowerup] = React.useState('none');

  function initializeInventory() {
    return [new Powerup('Add Time', 5, false), new Powerup('Reveal Letter', 1, false)];
  }

  // Called at the beginning
  // Called whenever game ends, if game ends then post score
  // If game does not end, get new word data
  React.useEffect(() => {
    if (lobbyDebug == false) {
      if (gameStatus.gameEnd == true) {
        // submit score
        if (user !== 'Guest') {
          console.log(`final score: ${gameStatus.score}`);
          postScore(userId, gameStatus.score);
        }
      } else {
        fetchWords(numRounds)
          .then((data) => {
            setGameData(data);
            updateGameStatus((prev) => ({
              ...prev,
              currWord: data[0],
              initialScore: determineWordInitialScore(data[0].difficulty, data[0].word.length),
              roundTime: determineWordInitialTime(data[0].difficulty, data[0].word.length),
            }));
            setRoundCount(data.length);
            setLoading(false);
          });
      }
    }
  }, [gameStatus.gameEnd]);

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
              Chat
            </div>
          </div>
          <div className="lobbyIntSide leftHead playerListTB">
            <div className="largeLabelLobby">
              Players
            </div>
            <div className="lobbyPlayerList">
              {playerList.map((player, index) => (
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
            {roundCount}
          </div>
          <div className="lobbyHeaderSide leftHead">
            {playerName || 'Loading userName'}
          </div>
        </div>
        { gameStatus.gameEnd
                && (
                <GameOver
                  score={currentScore}
                  restartGame={restartGame}
                />
                )}
        { !gameStatus.gameEnd
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
                    />
                  </div>
                  <CoreGame
                    wordData={gameStatus.currWord}
                    roundEnd={wordGuessed}
                    incorrectLetterGuessed={incorrectLetterWasGuessed}
                    activePowerup={activePowerup}
                    powerupOnConsume={powerupOnConsume}
                    initialCorrectLetters={initialCorrectLetters}
                  />
                </div>
                )}
      </div>
    );
  }

  // GAME FUNCTIONS
  // Called by CoreGame.js whenever a word was guessed, wordGuessed is set to true,
  // Since wordGuessed is a dependency of Timer.js, Timer.js will respond to this change in state
  function wordGuessed() {
    updateGameStatus((prev) => ({
      ...prev,
      wordGuessed: true,
    }));

    restartRound();
  }

  // Called by Timer.js when either time has run out, or user has solved the word
  function roundEnd(timeStarted, timeSolved) {
    const scoreEarned = determineFinalScore(timeStarted, timeSolved, gameStatus.initialScore);
    // Duplicate powerups and make all powerups available again
    // updateInventory(prevInventory => prevInventory.map(powerup => new Powerup(powerup.name, powerup.quantity, false)))

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
        wordGuessed: false,
      }));
    } else {
      // game ended
      updateGameStatus((prev) => ({
        ...prev,
        score: prev.score + scoreEarned,
        gameEnd: true,
        roundTime: 0,
      }));
    }

    restartRound();
  }

  // Called by CoreGame.js to update game status
  // Called whenever a word was guessed, wordGuessed is set to true,
  // And Timer.js will calculate the score and call roundEnd()
  function wordGuessed() {
    updateGameStatus((prev) => ({
      ...prev,
      wordGuessed: true,
    }));

    restartRound();
  }

  // Called by CoreGame.js to update round status
  function incorrectLetterWasGuessed() {
    updateRoundStatus((prev) => ({
      incorrectLettersGuessed: prev.incorrectLettersGuessed + 1,
    }));
  }

  function restartRound() {
    updateRoundStatus({
      incorrectLettersGuessed: 0,
    });
  }

  function restartGame() {
    updateGameStatus({
      round: 1,
      score: 0,
      currWord: gameData[0],
      gameEnd: false,
      initialScore: determineWordInitialScore(gameData[0].difficulty, gameData[0].word.length),
      roundTime: determineWordInitialTime(gameData[0].difficulty, gameData[0].word.length),
      wordGuessed: false,
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

      if (powerup.name == 'Add Time') {
        updateActivePowerup('Add Time');
      } else if (powerup.name == 'Reveal Letter') {
        updateActivePowerup('Reveal Letter');
      }
    }
  }

  // Called after a powerup has been used
  function powerupOnConsume() {
    updateActivePowerup('none');
  }

  // HELPER FUNCTIONS

  /**
     * Gets game details and if valid joins the game lobby
     * @param {string} gameCode Game code to get details for
     * @returns Game details object
     */
  async function getGameDetails(gameCode) {
    const response = await fetch(`${API_URL}/game?gameCode=${gameCode}`);
    if (response.status === 200) {
      const data = await response.json();
      socket.emit('join-lobby', { gameCode, playerName });
      setGameDetails(data);
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
      socket.emit('start-game', { gameCode, playerName });
      startClientGame();
    } else {
      alert('You are not the owner of this game!');
    }
  }

  function startClientGame() {
    setLobbyShown(false);
    console.log(gameDetails);
    // setWordList(gameDetails.words);
    // setRoundCount(gameDetails.words.length);
  }

  function getPuzzleAtCurrentRound() {
    return wordList[currentRound - 1];
  }

  function progressRound() {
    if (currentRound === roundCount) {
      endGame();
    } else {
      setCurrentRound(currentRound + 1);
    }
  }

  function endGame() {
    console.log('Game ended');
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
