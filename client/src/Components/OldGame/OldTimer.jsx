// Responsible for timer on game page and calculates the score based on time remaining

import React, { useState, useEffect } from 'react';

import '../../Styles/Timer.css';

function Timer({
  initialTime,
  wordGuessed,
  onEnd,
  timePenalty,
  incorrectLettersGuessed,
  activePowerup,
  powerupOnConsume,
}) {
  const [time, setTime] = useState(initialTime);

  useEffect(() => {
    let intervalId;
    if (!wordGuessed && time > 0) {
      intervalId = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (!wordGuessed && time <= 0) { // time ends
      onEnd(initialTime, time);
      setTime(initialTime);
    }
    return () => clearInterval(intervalId);
  }, [time]);

  useEffect(() => {
    // Only apply penalties when there are wrong letters
    if (!incorrectLettersGuessed === 0) {
      setTime((prev) => prev - timePenalty);
    }
  }, [incorrectLettersGuessed]);

  // Check if word was guessed correctly
  useEffect(() => {
    if (wordGuessed) {
      onEnd(initialTime, time);
      setTime(initialTime);
    }
  }, [wordGuessed]);

  useEffect(() => {
    if (activePowerup === 'Add Time') {
      setTime((prev) => prev + 5);
      powerupOnConsume();
    }
  }, [activePowerup]);

  return (
    <div className="timer">
      <div className="timer-text">{time}</div>
    </div>
  );
}

export default Timer;
