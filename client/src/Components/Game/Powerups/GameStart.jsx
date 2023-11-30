import React, { useState, useEffect } from 'react';

const TIMER_TIME = 5;

function GameStart({ startCoreGame }) {
  const [time, setTime] = useState(TIMER_TIME);
  useEffect(() => {
    let intervalId;
    if (time > 0) {
      intervalId = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else {
      startCoreGame();
    }

    return () => clearInterval(intervalId);
  }, [time]);
  return (
    <div className="game-start">
      <div className="game-start-text">
        The game starts in...
      </div>
      <div className="timer">
        <div className="timer-text">{time}</div>
      </div>
    </div>
  );
}

export default GameStart;
