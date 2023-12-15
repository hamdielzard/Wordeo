import React from 'react';
import Button from '../../Button';

function GameOver(props) {
  const renderSoloGameOver = () => (
    <>
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
    </>
  );

  const renderMultiGameOver = () => {
    if (Object.keys(props.multiScores).length === 0) {
      return (
        <div className="gameOver--text">
          Waiting for other players to submit their score...
        </div>
      );
    }

    return (
      <>
        <div className="gameOver--text">
          The winner was
          {' '}
          {props.multiWinner}
          !
        </div>
        <div className="gameOver--scores">
          <table>
            <tbody>
              {Object.entries(props.multiScores).map(([playerName, score]) => (
                <tr key={playerName}>
                  {playerName}
                  :
                  {' '}
                  {score}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="gameOver--coins">
          +
          {' '}
          {props.coins}
          {' '}
          Coins
        </div>
      </>
    );
  };

  return (
    <div className="gameOver">
      {props.gameMode === 'solo' ? renderSoloGameOver() : null}
      {props.gameMode === 'multi' ? renderMultiGameOver() : null}

      <Button label="Leave game" onClick={() => { window.location = '/'; }} type="secondary" size="medium" />
    </div>
  );
}

export default GameOver;
