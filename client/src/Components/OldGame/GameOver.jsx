import React from 'react';
import Button from '../Button';

function GameOver(props) {
  return (
    <div className="gameOver">
      <div className="gameOver--text">
        Lexical Legend!
      </div>
      <div className="gameOver--score">
        {props.score}
      </div>
      <div className="gameOver--coins">
        +
        {' '}
        {props.coins}
        {' '}
        Coins
      </div>
      <Button label="Play again?" onClick={props.restartGame} type="primary" size="medium" />
      <Button label="Leave game" onClick={() => { window.location = '/'; }} type="secondary" size="medium" />
    </div>
  );
}

export default GameOver;
