//the page where the game is played

import React from 'react'
import GameHeader from '../Components/Game/GameHeader'
import GameOver from '../Components/Game/GameOver'
import Timer from '../Components/Game/Timer'
import CoreGame from '../Components/Game/CoreGame'
import fetchWords from '../Components/Game/FetchWords'
import '../Styles/Game.css';

let timeLost = 0

const GamePage = ({
    initialState = false,
    numRounds = 10
}) => {
    const cookie = ('; ' + document.cookie).split(`; user=`).pop().split(';')[0];
    var user;
    if (cookie.length > 0)
        user = cookie;
    else
        user = 'Guest';

    const [loading, setLoading] = React.useState(true)

    const [gameData, setGameData] = React.useState([])

    const [gameStatus, updateGameStatus] = React.useState({
        round: 1,
        score: 0,
        currWord: null,
        gameEnd: false,
        roundTime: null,
        wordGuessed: false
    })

    const [roundStatus, updateRoundStatus] = React.useState({
        incorrectLettersGuessed: 0
    })

    React.useEffect(()=> {
        fetchWords(numRounds)
            .then((data) => {
                setGameData(data);
                updateGameStatus(prev => ({
                    ...prev,
                    currWord: data[0],
                    roundTime: 10 + data[0].difficulty * 5
                }));
                setLoading(false);
            })
    }, [gameStatus.gameEnd]);

    // Called by Timer.js to update game status
    function roundEnd(scoreEarned) {
        if (gameStatus.round+1 <= gameData.length) {
            updateGameStatus(prev =>({
                ...prev,
                round: prev.round + 1,
                score: prev.score + scoreEarned,
                currWord: gameData[prev.round],
                roundTime: 10 + gameData[prev.round].difficulty * 5,
                wordGuessed: false
            }))
        }
        else {
            updateGameStatus(prev =>({
                ...prev,
                score: prev.score + scoreEarned,
                gameEnd: true,
                roundTime: 0
            }))
        }
    }

    // Called by CoreGame.js to update game status
    function wordGuessed() {
        updateGameStatus(prev => ({
            ...prev,
            wordGuessed: true
        }))
    }

    // Called by CoreGame.js to update round status
    function incorrectLetterGuessed() {
        updateRoundStatus(prev => ({
            incorrectLettersGuessed: prev.incorrectLettersGuessed + 1
        }))
    }

    function restartGame() {
        updateGameStatus(prev => ({
            round: 1,
            score: 0,
            currWord: gameData[0],
            gameEnd: false,
            roundTime: 10 + gameData[0].difficulty * 5,
            wordGuessed: false
        }))
    }

    return (
        <div className='game'>
            { !loading &&
                <GameHeader 
                score = {gameStatus.score}
                round = {gameStatus.round}
                maxRound = {numRounds}
                name = {user}
                />
            }
            {
                !loading && 
                gameStatus.gameEnd &&
                <GameOver 
                score = {gameStatus.score}
                coins = {gameStatus.score/2}
                restartGame = {restartGame}
                />
            }
            {   !loading && 
                !gameStatus.gameEnd &&
                <div className='gameContainer'>    
                <Timer 
                    initialTime = {gameStatus.roundTime}
                    wordGuessed = {gameStatus.wordGuessed}
                    onEnd = {roundEnd}
                    timePenalty = {5}
                    incorrectLettersGuessed = {roundStatus.incorrectLettersGuessed}
                />
                <CoreGame 
                    wordData = {gameStatus.currWord}
                    roundEnd = {wordGuessed}
                    incorrectLetterGuessed = {incorrectLetterGuessed}
                /></div>
            }
        </div>
    )
}

export default GamePage