//the page where the game is played

import React from 'react'
import GameHeader from '../Components/Game/GameHeader'
import CoreGame from '../Components/Game/CoreGame'
import GameOver from '../Components/Game/GameOver'
import Timer from '../Components/Game/Timer'
import '../Styles/Game.css';

// TEMP GAME DATA
import data from '../TEMPDB/data';

// TO DO
// Round time calculation
// Score calculation
// Coin calculation
//

let timeLost = 0

const GamePage = () =>
{
    const [gameStatus, updateGameStatus] = React.useState({
        round: 1,
        score: 0,
        currWord: data[0],
        gameEnd: false,
        roundTime: 30,
        wordGuessed: false
    })

    const [roundStatus, updateRoundStatus] = React.useState({
        incorrectLettersGuessed: 0
    })

    // Called by Timer.js to update game status
    function roundEnd(scoreEarned) {
        if (gameStatus.round+1 <= data.length) {
            updateGameStatus(prev =>({
                ...prev,
                round: prev.round + 1,
                score: prev.score + scoreEarned,
                currWord: data[prev.round],
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
            currWord: data[0],
            gameEnd: false,
            roundTime: 30,
            wordGuessed: false
        }))
    }

    return(
        <div className='game'>
            <GameHeader 
                score = {gameStatus.score}
                round = {gameStatus.round}
                maxRound = {data.length}
                name = "Player1"
            />

            {gameStatus.gameEnd ? 
            <GameOver 
                score = {gameStatus.score}
                coins = {gameStatus.score/2}
                restartGame = {restartGame}
            />
            :        
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