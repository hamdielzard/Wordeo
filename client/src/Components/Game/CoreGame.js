import React from "react";
import { useEffect } from "react";

import Timer from './Timer';
import LetterBox from "./LetterBox";
import IncorrectLetterBox from "./InocrrectLetterBox";

const CoreGame = (props) => {
    let word = props.wordData.word

    const [roundStatus, updateRoundStatus] = React.useState({
        wordsGuessed: [],
        correctLetters: [],
        incorrectLetters: []
    })

    const [time, updateTime] = React.useState({
        timeRemaining: 0
    })

    // For every letter in a word, create a letter box for it
    const [letters, updateLetters] = React.useState(() => {
        return initializeLetterBoxes()
    })

    function initializeLetterBoxes() {
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
    }

    const [incorrectLetterBoxes, updateIncorrectLetters] = React.useState([])

    // Listen for key strokes
    useEffect(() => {
        document.addEventListener('keyup', letterInputHandler)
        return () => document.removeEventListener('keyup', letterInputHandler)
    })
    const letterInputHandler = (e) => {
        let newWordsGuessed = roundStatus.wordsGuessed
        let newCorrectLetters = roundStatus.correctLetters
        let newIncorrectLetters = roundStatus.incorrectLetters

        console.log("RAN")
        console.log(roundStatus)

        // Only do logic if this letter has not been guessed yet
        if (!roundStatus.wordsGuessed.includes(e.key))
        {  
            let isCorrect = false

            // Find the letter in the word
            for (let i = 0; i < word.length && !isCorrect; i++) {
                // If it matches, create a new LetterBox that is green and displays a letter
                if (word.charAt(i).toLowerCase() == e.key.toLowerCase()) {
                    isCorrect = true
                }
            }

            // If correct letter was found, update the letter boxes
            if (isCorrect) {
                newCorrectLetters.push(e.key)
                
                // Update letter boxes
                updateLetters(prevLetters => {
                    let newLetterBoxes = []

                    // Create a box for every letter
                    for (let i = 0; i < word.length; i++) {
                        // If current word matches, create a new correct box for it 
                        if (word.charAt(i).toLowerCase() == e.key.toLowerCase()) {
                            newLetterBoxes.push(
                                <div className="letterbox" style={{background: '#ABFF68'}} key = {i}>
                                    <LetterBox 
                                        letter = {word.charAt(i)}
                                        visibility = 'visible'
                                    />
                                </div>
                            )
                        }
                        // If not, use the old box
                        else {
                            newLetterBoxes.push(
                                prevLetters[i]
                            )
                        }
                    }

                    return newLetterBoxes
                })
            }
            // Letter was not correct
            else if (!isCorrect) {
                // Update round status to reflect the new incorrect word
                newIncorrectLetters.push(e.key)

                // Fill and create incorrect letter boxes with the new data
                updateIncorrectLetters(() => {
                    let incorrectLetterBoxes = newIncorrectLetters.map(incorrectLetter => {
                        return (
                            <div className="incorrectLetterBox" key = {incorrectLetter}>
                                <IncorrectLetterBox 
                                    letter = {incorrectLetter}
                                />
                            </div>
                        )
                    })

                    return incorrectLetterBoxes
                })                
            }
            newWordsGuessed.push(e.key)

            updateRoundStatus({
                wordsGuessed: newWordsGuessed,
                incorrectLetters: newIncorrectLetters,
                correctLetters: newCorrectLetters
            })
        }
    }

    // Whenever a user makes a guess (ie gameStatus changes), run this code block to check if the game 
    // has ended
    useEffect(() => {
        let allWordsGuessed = true

        // Check if all letters in the word is in correctLetters
        for (let i = 0; i < word.length && allWordsGuessed; i++) {
            if (!roundStatus.correctLetters.includes(word.charAt(i).toLowerCase())) {
                allWordsGuessed = false;
            }
        }

        if (allWordsGuessed) {
            // Reset round status
            updateRoundStatus({
                wordsGuessed: [],
                correctLetters: [],
                incorrectLetters: [],
            })

            // Reset round status for next round
            props.roundEnd(100)
        }
    }, [roundStatus])

    // When props has changed, the parent component of this component has passed it a new word
    // Create a new round with this new word
    useEffect(() => {
        // Reset letter boxes
        updateLetters(initializeLetterBoxes())
        updateIncorrectLetters([])
    }, [props])

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
                {incorrectLetterBoxes}
            </div>
        </div>
    )
}

export default CoreGame

