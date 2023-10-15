import React from "react";
import { useEffect } from "react";

import Timer from './Timer';
import LetterBox from "./LetterBox";
import IncorrectLetterBox from "./InocrrectLetterBox";

const CoreGame = (props) => {
    const word = props.wordData.word

    const [roundStatus, updateRoundStatus] = React.useState({
        wordsGuessed: [],
        correctWords: [],
        incorrectLetters: []
    })

    const [time, updateTime] = React.useState({
        timeRemaining: 0
    })

    // For every letter in a word, create a letter box for it
    const [letters, updateLetters] = React.useState(() => {
        var initialLetters = []

        for (let i = 0; i < word.length; i++) {
            initialLetters.push(
                <div className="letterbox" style={{background: '#FFF'}} key = {i}>
                    <LetterBox 
                        letter = {word.charAt(i)}
                        visibility = 'hidden'
                    />
                </div>
            )
        }

        return initialLetters
    })

    const [incorrectLetters, updateIncorrectLetters] = React.useState([])

    // Listen for key strokes
    useEffect(() => {
        document.addEventListener('keydown', letterInputHandler, true)
    })
    const letterInputHandler = (e) => {
        let flippedBoxes = 0
        
        let newWordsGuessed = roundStatus.wordsGuessed
        let newCorrectWords = roundStatus.correctWords
        let newIncorrectLetters = roundStatus.incorrectLetters

        
        // Only do logic if this letter has not been guessed yet
        if (!roundStatus.wordsGuessed.includes(e.key))
        {     
            updateLetters(prevLetters => {
                let newLetterBoxes = []

                // Loop through all letters
                for (let i = 0; i < word.length; i++) {
                    // If it matches, create a new LetterBox that is green and displays a letter
                    if (word.charAt(i).toLowerCase() == e.key.toLowerCase()) {
                        newLetterBoxes.push(
                            <div className="letterbox" style={{background: '#ABFF68'}} key = {i}>
                                <LetterBox 
                                    letter = {word.charAt(i)}
                                    visibility = 'visible'
                                />
                            </div>
                        )
                        flippedBoxes++
                    }
                    // If it does not match, use the previous letterBox
                    else {
                        newLetterBoxes.push(
                            prevLetters[i]
                        )
                    }
                }

                return newLetterBoxes
            })

            // Update states from roundStatus
            if (flippedBoxes == 0) {
                // Update round status to reflect the new incorrect word
                newIncorrectLetters.push(e.key)
                updateRoundStatus(prev => ({
                    ...prev,
                    incorrectLetters: newIncorrectLetters
                }))
                console.log(roundStatus)

                // Fill and create incorrect letter boxes with the new data
                updateIncorrectLetters(() => {
                    let incorrectLetterBoxes = newIncorrectLetters.map(incorrectLetter => {
                        return (
                            <div className="incorrectLetterBox">
                                <IncorrectLetterBox 
                                    letter = {incorrectLetter}
                                />
                            </div>
                        )
                    })

                    return incorrectLetterBoxes
                })

                console.log(incorrectLetters)
                
            }
            else {
                newCorrectWords.push(e.key)
            }
            newWordsGuessed.push(e.key)

            updateRoundStatus({
                wordsGuessed: newWordsGuessed,
                correctWords: newCorrectWords,
            })
        }
        
    }

    return(
        <div className="coreGame">
            <Timer />
            <div className="hint">
                {props.wordData.hints[0]}
            </div>
            <div className="lettergrid">
                {letters}
            </div>
            <div className ="lettergrid">
                {incorrectLetters}
            </div>
        </div>
    )
}

export default CoreGame