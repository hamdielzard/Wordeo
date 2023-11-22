import React from 'react';
import coin from '../../Images/Coin.png';

function Currency({ balance }) {
  return (
    <div className="currency" data-testid="currency">
      <img src={coin} className="item-icon-coin" alt="a coin" />
      <p className="item-icon-price">{balance}</p>
    </div>
  );
}

export default Currency;
