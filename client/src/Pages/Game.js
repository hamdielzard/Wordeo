//the page where the game is played

import React from 'react'
import GameHeader from '../Components/Game/GameHeader'
import CoreGame from '../Components/Game/CoreGame'
import GameOver from '../Components/Game/GameOver'
import '../Styles/Game.css';

// TEMP GAME DATA
import data from '../TEMPDB/data';

// TO DO
// Round time calculation
// Score calculation
// Coin calculation
// 

const GamePage = ({initialState = false}) =>
{
    const cookie = ('; '+document.cookie).split(`; user=`).pop().split(';')[0];
    var user;
    if(cookie.length>0)
        user=cookie;
    else
        user='Guest';

    const [gameStatus, updateGameStatus] = React.useState({
        round: 1,
        score: 0,
        currWord: data[0],
        gameEnd: initialState,
        roundTime: 0
    })

    function roundEnd(scoreEarned) {
        console.log(scoreEarned)

        if (gameStatus.round+1 <= data.length) {
            updateGameStatus(prev =>({
                ...prev,
                round: prev.round + 1,
                score: prev.score + scoreEarned,
                currWord: data[prev.round],
                roundTime: 0
            }))
        }
        else {
            updateGameStatus(prev =>({
                ...prev,
                score: prev.score + scoreEarned,
                gameEnd: true
            }))
        }
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
                name = {user}
            />
            {gameStatus.gameEnd ? 
            <GameOver 
                score = {gameStatus.score}
                coins = {gameStatus.score/2}
                restartGame = {restartGame}
            />
            :
            <CoreGame 
                wordData = {gameStatus.currWord}
                roundEnd = {roundEnd}
            />}
        </div>
    )
}

export default GamePage