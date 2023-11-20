import React, { useEffect } from 'react';

import LetterBox from '../LetterBox';

function CoreGame({
  wordData,
  roundEnd,
  incorrectLetterGuessed,
  initialCorrectLetters = [],
  initialIncorrectLetters = [],
  activePowerup,
  powerupOnConsume,
}) {
  const word = wordData.word.toLowerCase();

  const [roundStatus, updateRoundStatus] = React.useState({
    wordsGuessed: [],
    correctLetters: initialCorrectLetters,
    incorrectLetters: initialIncorrectLetters,
    roundOver: false,
  });

  // For every letter in a word, create a letter box for it
  const [letters, updateLetters] = React.useState(createLetterBoxes(initialCorrectLetters));
  const [incorrectLetterBoxes, updateIncorrectLetters] = React.useState(
    createIncorrectLetterBoxes(roundStatus.incorrectLetters),
  );

  function createLetterBoxes(correctLetters) {
    const initialLetters = [];

    // Create a box for every letter
    for (let i = 0; i < word.length; i += 1) {
      // If current word matches, create a visible green box for it
      if (correctLetters.includes(word.charAt(i).toLowerCase())) {
        initialLetters.push(
          <div key={word.concat(' ', i)}>
            <LetterBox
              letter={`${word.charAt(i)}`}
              correct
            />
          </div>,
        );
      } else { // If not, create a hidden white box for it
        initialLetters.push(
          <div key={word.concat(' ', i)}>
            <LetterBox
              letter=""
            />
          </div>,
        );
      }
    }
    return initialLetters;
  }

  function createIncorrectLetterBoxes(incorrectLetters) {
    const incorrectBoxes = incorrectLetters.map((incorrectLetter) => (
      <div key={incorrectLetter}>
        <LetterBox
          letter={incorrectLetter}
          correct={false}
        />
      </div>
    ));

    return incorrectBoxes;
  }

  // Listen for key strokes whilst round is ongoing
  useEffect(() => {
    if (!roundStatus.roundOver) {
      document.addEventListener('keyup', letterInputHandler);
      return () => document.removeEventListener('keyup', letterInputHandler);
    }
  });
  const letterInputHandler = (e) => {
    const newWordsGuessed = roundStatus.wordsGuessed;
    const newCorrectLetters = roundStatus.correctLetters;
    const newIncorrectLetters = roundStatus.incorrectLetters;

    const letterGuessed = e.key.toLowerCase();

    // Only do logic if this letter has not been guessed yet
    // and that it is a letter
    if (!roundStatus.wordsGuessed.includes(letterGuessed)
    && letterGuessed.length === 1
    && (letterGuessed.toLowerCase() !== letterGuessed.toUpperCase())) {
      let isCorrect = false;

      // Find the letter in the word
      for (let i = 0; i < word.length && !isCorrect; i += 1) {
        // If it matches, create a new LetterBox that is green and displays a letter
        if (word.charAt(i).toLowerCase() === letterGuessed) {
          isCorrect = true;
        }
      }

      // If correct letter was found, update the letter boxes
      if (isCorrect) {
        newCorrectLetters.push(letterGuessed);
        updateLetters(createLetterBoxes(roundStatus.correctLetters));
      } else if (!isCorrect) { // Letter was not correct
        // Update round status to reflect the new incorrect word
        newIncorrectLetters.push(letterGuessed);

        // Inform Game that an incorrect letter was guessed
        incorrectLetterGuessed();

        // Fill and create incorrect letter boxes with the new data
        updateIncorrectLetters(createIncorrectLetterBoxes(roundStatus.incorrectLetters));
      }
      newWordsGuessed.push(letterGuessed);

      updateRoundStatus({
        wordsGuessed: newWordsGuessed,
        incorrectLetters: newIncorrectLetters,
        correctLetters: newCorrectLetters,
      });
    }
  };

  // Whenever a user makes a guess (ie roundStatus changes),
  // run this code block to check if the game has ended
  useEffect(() => {
    let allWordsGuessed = true;

    // Check if all letters in the word is in correctLetters
    for (let i = 0; i < word.length && allWordsGuessed; i += 1) {
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
        roundOver: true,
      });

      // Let Game.js know that round has ended
      roundEnd();
    }
  }, [roundStatus]);

  // When wordData has changed, the parent component of this component has passed it a new word
  // Create a new round with this new word
  useEffect(() => {
    // Reset round status
    updateRoundStatus({
      wordsGuessed: [],
      correctLetters: [],
      incorrectLetters: [],
      roundOver: false,
    });

    // Reset letter boxes
    updateLetters(createLetterBoxes(initialCorrectLetters));
    updateIncorrectLetters(createIncorrectLetterBoxes(initialIncorrectLetters));
  }, [wordData]);

  useEffect(() => {
    if (activePowerup === 'Reveal Letter') {
      let letterFound = false;

      while (!letterFound) {
        // Random index
        const i = Math.floor(Math.random() * ((word.length - 1) - 0 + 1) + 0);

        if (!letterFound && !roundStatus.correctLetters.includes(word.charAt(i).toLowerCase())) {
          letterFound = true;

          // Create deep copy of the correct letters to be used by update
          // Need to do this because updateRoundStatus won't update quickly enough before running
          // updateLetters
          const correctLettersCopy = JSON.parse(JSON.stringify(roundStatus.correctLetters));
          correctLettersCopy.push(word.charAt(i).toLowerCase());

          updateRoundStatus((prev) => ({
            ...prev,
            correctLetters: [...prev.correctLetters, word.charAt(i).toLowerCase()],
          }));

          updateLetters(createLetterBoxes(correctLettersCopy));
        }
      }

      powerupOnConsume();
    }
  }, [activePowerup]);

  return (
    <div className="gameMain">
      <div className="gameClue">
        {wordData.hints[0]}
      </div>
      <div className="gameLetterBoxes">
        {letters}
      </div>
      <div className="gameLetterBoxes">
        {incorrectLetterBoxes}
      </div>
    </div>

  );
}

export default CoreGame;
