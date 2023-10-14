//the page where the game is played

import React from 'react'
import GameHeader from '../Components/Game/GameHeader';
import Timer from '../Components/Game/Timer';
import CoreGame from '../Components/Game/CoreGame';
import '../Styles/Game.css';

// TEMP GAME DATA
import data from '../TEMPDB/data';

const GamePage = () =>
{
    const [gameStatus, updataStatus] = React.useState({
        round: 1,
        score: 0,
        currWord: data[0]
    })

    return(
        <div className='game'>
            <GameHeader 
                score = {gameStatus.score}
                round = {gameStatus.round}
                maxRound = {data.length}
                name = "Player1"
            />
            <Timer />
            <CoreGame />
        </div>
    )
}

export default GamePage