import React from 'react';
import coin from '../../Images/Coin.png';

function Currency({ balance }) {
  console.log(balance);
  if (balance !== undefined) {
    return (
      <div className="currency" data-testid="currency">
        <img src={coin} className="item-icon-coin" alt="a coin" />
        <p className="item-icon-price">{balance}</p>
      </div>
    );
  }
  return (
    <div className="currency" data-testid="currency">
      <p className="not-login-text">Login to use coins!</p>
    </div>
  );
}

export default Currency;
