import React from "react";
import { useEffect } from "react";

import Timer from './Timer';
import LetterBox from "./LetterBox";
import IncorrectLetterBox from "./IncorrectLetterBox";

const CoreGame = ({wordData, roundEnd, incorrectLetterGuessed, initialCorrectLetters = [], initialIncorrectLetters = []}) => {
    let word = wordData.word

    const [roundStatus, updateRoundStatus] = React.useState({
        wordsGuessed: [],
        correctLetters: initialCorrectLetters,
        incorrectLetters: initialIncorrectLetters,
        roundOver: false
    })

    // For every letter in a word, create a letter box for it
    const [letters, updateLetters] = React.useState(createLetterBoxes(initialCorrectLetters))
    const [incorrectLetterBoxes, updateIncorrectLetters] = React.useState(createIncorrectLetterBoxes(roundStatus.incorrectLetters))

    function createLetterBoxes(correctLetters) {
        var initialLetters = []

        // Create a box for every letter
        for (let i = 0; i < word.length; i++) {
            // If current word matches, create a visible green box for it 
            if (correctLetters.includes(word.charAt(i).toLowerCase())) {
                initialLetters.push(
                    <div className="letterbox" style={{background: '#ABFF68'}} key = {i}>
                        <LetterBox 
                            letter = {word.charAt(i)}
                            visibility = 'visible'
                        />
                    </div>
                )
            }
            // If not, create a hidden white box for it
            else {
                initialLetters.push(
                    <div className="letterbox" style={{background: '#FFF'}} key = {i}>
                        <LetterBox 
                            letter = {word.charAt(i)}
                            visibility = 'hidden'
                        />
                    </div>
                )
            }
        }
        return initialLetters
    }

    function createIncorrectLetterBoxes(incorrectLetters) {
        let incorrectLetterBoxes = incorrectLetters.map(incorrectLetter => {
            return (
                <div className="incorrectLetterBox" key = {incorrectLetter}>
                    <IncorrectLetterBox 
                        letter = {incorrectLetter}
                    />
                </div>
            )
        })

        return incorrectLetterBoxes
    }

    // Listen for key strokes whilst round is ongoing
    useEffect(() => {
        if (!roundStatus.roundOver) {
            document.addEventListener('keyup', letterInputHandler)
            return () => document.removeEventListener('keyup', letterInputHandler)
        }
    })
    const letterInputHandler = (e) => {
        console.log(roundStatus)
        let newWordsGuessed = roundStatus.wordsGuessed
        let newCorrectLetters = roundStatus.correctLetters
        let newIncorrectLetters = roundStatus.incorrectLetters

        let letterGuessed = e.key.toLowerCase()

        // Only do logic if this letter has not been guessed yet
        // and that it is a letter
        if (!roundStatus.wordsGuessed.includes(letterGuessed) && letterGuessed.length == 1 && (letterGuessed.toLowerCase() != letterGuessed.toUpperCase()))
        {  
            let isCorrect = false

            // Find the letter in the word
            for (let i = 0; i < word.length && !isCorrect; i++) {
                // If it matches, create a new LetterBox that is green and displays a letter
                if (word.charAt(i).toLowerCase() == letterGuessed) {
                    isCorrect = true
                }
            }

            // If correct letter was found, update the letter boxes
            if (isCorrect) {
                newCorrectLetters.push(letterGuessed)
                updateLetters(createLetterBoxes(roundStatus.correctLetters))
            }
            // Letter was not correct
            else if (!isCorrect) {
                // Update round status to reflect the new incorrect word
                newIncorrectLetters.push(letterGuessed)

                // Inform Game that an incorrect letter was guessed
                incorrectLetterGuessed()

                // Fill and create incorrect letter boxes with the new data
                updateIncorrectLetters(createIncorrectLetterBoxes(roundStatus.incorrectLetters))                
            }
            newWordsGuessed.push(letterGuessed)

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
                roundOver: true
            })

            // Reset round status for next round
            roundEnd(100)
        }
    }, [roundStatus])

    // When wordData has changed, the parent component of this component has passed it a new word
    // Create a new round with this new word
    useEffect(() => {
        // Reset round status
        updateRoundStatus({
            wordsGuessed: [],
            correctLetters: [],
            incorrectLetters: [],
            roundOver: false
        })

        // Reset letter boxes
        updateLetters(createLetterBoxes(initialCorrectLetters))
        updateIncorrectLetters(createIncorrectLetterBoxes(initialIncorrectLetters))
    }, [wordData])

    return(
        <div className="coreGame">
            <div className="hint">
                {wordData.hints[0]}
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