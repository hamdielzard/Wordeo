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

console.log("DSADA")

const GamePage = () =>
{
    const [gameStatus, updateGameStatus] = React.useState({
        round: 1,
        score: 0,
        currWord: data[0],
        gameEnd: false,
        roundTime: 3
    })

    function roundEnd(scoreEarned) {
        console.log("SD")
        if (gameStatus.round+1 <= data.length) {
            updateGameStatus(prev =>({
                ...prev,
                round: prev.round + 1,
                score: prev.score + scoreEarned,
                currWord: data[prev.round],
                roundTime: 3
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

    function timerEnd() {
        roundEnd(0)
    }

    function restartGame() {
        // OPTION TO SELECT NEW GAME DATA GOES HERE

        updateGameStatus({
            round: 1,
            score: 0,
            currWord: data[0],
            gameEnd: false
        })
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
                onEnd = {timerEnd}
            />
            <CoreGame 
                wordData = {gameStatus.currWord}
                roundEnd = {roundEnd}
            /></div>
            }
        </div>
    )
}

export default GamePage