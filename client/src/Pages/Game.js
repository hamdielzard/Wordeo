//the page where the game is played

import React from 'react'
import GameHeader from '../Components/Game/GameHeader';
import CoreGame from '../Components/Game/CoreGame';
import '../Styles/Game.css';

// TEMP GAME DATA
import data from '../TEMPDB/data';

const GamePage = () =>
{
    const [gameStatus, updateGameStatus] = React.useState({
        round: 1,
        currWord: data[0],
        score: 0
    })

    function roundEnd(scoreEarned) {
        console.log(scoreEarned)
    }

    return(
        <div className='game'>
            <GameHeader 
                score = {gameStatus.score}
                round = {gameStatus.round}
                maxRound = {data.length}
                name = "Player1"
            />
            <CoreGame 
                wordData = {gameStatus.currWord}
                roundEnd = {roundEnd}
            />
        </div>
    )
}

export default GamePage