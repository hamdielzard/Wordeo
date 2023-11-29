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
  const [timeSinceLastHint, setTimeSinceLastHint] = useState(0);
  const [timerStyle, setTimerStyle] = useState({
    backgroundColor: '#F2F2F2',
  });

  useEffect(() => {
    let intervalId;
    if (!wordGuessed && time > 0) {
      if (timeSinceLastHint >= 5) { // Call update hint every 5 seconds
        console.log('update');
        updateHint();
      }
      intervalId = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
        setTimeSinceLastHint((prevTime) => prevTime + 1);
      }, 1000);
    } else if (!wordGuessed && time <= 0) { // Out of time
      onEnd(initialTime, time);
      resetTimers();
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
      // Set timer color to red to indicate that a mistake was made
      setTimerStyle({
        backgroundColor: '#FF6767',
      });

      setTime((prev) => prev - timePenalty);

      // Set timer color back to white after one second
      const timeoutId = setTimeout(() => {
        setTimerStyle({
          backgroundColor: '#F2F2F2',
        });
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [incorrectLettersGuessed]);

  // Check if word was guessed correctly
  useEffect(() => {
    if (wordGuessed) {
      onEnd(initialTime, time);
      resetTimers();
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
      resetTimers();
    }
  }, [initialTime]);

  function resetTimers() {
    setTime(initialTime);
    setTimeSinceLastHint(0);
  }

  return (
    <div className="timer" style={timerStyle}>
      <div className="timer-text">{time}</div>
    </div>
  );
}

export default Timer;
