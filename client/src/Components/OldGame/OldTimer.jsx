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
  updateHint,
}) {
  const [time, setTime] = useState(initialTime);
  useEffect(() => {
    let intervalId;
    if (!wordGuessed && time > 0) {
      if ((time < initialTime) && (time % 5 === 0)) { // Call update hint every 5 seconds
        console.log('update');
        updateHint();
      }
      intervalId = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (!wordGuessed && time <= 0) { // Out of time
      onEnd(initialTime, time);
      setTime(initialTime);
    }

    console.log(time);
    console.log(initialTime);
    console.log(time % 5 === 0);
    console.log('\n');
    return () => clearInterval(intervalId);
  }, [time]);

  // Penalties
  useEffect(() => {
    // Only apply penalties when there are wrong letters
    if (!(incorrectLettersGuessed === 0)) {
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

  useEffect(() => {
    if (time !== initialTime) {
      setTime(initialTime);
    }
  }, [initialTime]);

  return (
    <div className="timer">
      <div className="timer-text">{time}</div>
    </div>
  );
}

export default Timer;
