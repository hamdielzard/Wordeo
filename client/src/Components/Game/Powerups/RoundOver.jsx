import React, { useState, useEffect } from 'react';

const TIMER_TIME = 3;

function RoundOver({
  word,
  restartRound,
  roundWon,
  lastWord = true,
}) {
  const [time, setTime] = useState(TIMER_TIME);
  const backgroundStyle = {
    backgroundColor: '#393939',
  };

  useEffect(() => {
    let intervalId;
    if (time > 0) {
      intervalId = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else {
      restartRound();
    }

    return () => clearInterval(intervalId);
  });

  return (
    <div className="round-over" style={backgroundStyle}>
      <div className="round-over-highlight">
        {roundWon ? 'Round Won!' : 'Round Lost!'}
      </div>
      <div className="round-over-text">
        The correct word was
      </div>
      <div className="round-over-highlight">
        {word}
      </div>
      <div className="round-over-text">
        {lastWord ? 'Game ends in...' : 'The next round begins in...'}
      </div>
      <div className="timer round-over-timer">
        <div className="timer-text">{time}</div>
      </div>
    </div>
  );
}

export default RoundOver;
