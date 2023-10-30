//the page where the game is played

import React from 'react'
import GameHeader from '../Components/Game/GameHeader'
import GameOver from '../Components/Game/GameOver'
import Timer from '../Components/Game/Timer'
import CoreGame from '../Components/Game/CoreGame'
import { fetchWords, postScore } from '../Util/ApiCalls'
import '../Styles/Game.css';

let timeLost = 0

const GamePage = ({
    initialLoad = true,
    initialState = false,
    data = [],
    numRounds = data.length ? data.length : 10,
}) => {
    let user = "Guest";
    let userId = "";
    
    const cookiePairs = document.cookie.split(';');
    
    // Iterate through the cookie pairs to find the 'user' and 'userID' values
    for (const pair of cookiePairs) {
        const [key, value] = pair.trim().split('=');
        if (key === 'user') {
            user = value;
        } else if (key === 'userid') {
            userId = value;
        }
    }

    const [loading, setLoading] = React.useState(initialLoad)

    const [gameData, setGameData] = React.useState(data)

    const [gameStatus, updateGameStatus] = React.useState({
        round: 1,
        score: 0,
        currWord: data.length ? data[0] : null,
        gameEnd: initialState,
        roundTime: null,
        wordGuessed: false
    })

    const [roundStatus, updateRoundStatus] = React.useState({
        incorrectLettersGuessed: 0
    })

    React.useEffect(()=> {
        if (gameStatus.gameEnd == true) {
            // submit score
            if (user !== "Guest") {
                console.log("final score: " + gameStatus.score)
                postScore(userId, gameStatus.score);
            }
        }

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
    // Called when timer runs out, so round is over
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
            // game ended
            updateGameStatus(prev =>({
                ...prev,
                score: prev.score + scoreEarned,
                gameEnd: true,
                roundTime: 0
            }))
        }
        
        restartRound()
    }

    // Called by CoreGame.js to update game status
    // Called whenever a word was guessed, so round is over
    function wordGuessed() {
        updateGameStatus(prev => ({
            ...prev,
            wordGuessed: true
        }))

        restartRound()
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

    function restartRound() {
        updateRoundStatus({
            incorrectLettersGuessed: 0
        })
    }

    return(
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
                    timePenalty = {2}
                    incorrectLettersGuessed = {roundStatus.incorrectLettersGuessed}
                />
                <CoreGame 
                    wordData = {gameStatus.currWord}
                    roundEnd = {wordGuessed}
                    incorrectLetterGuessed = {incorrectLetterGuessed}
                    roundNum = {gameStatus.round}
                /></div>
            }
        </div>
    )
}

export default GamePage