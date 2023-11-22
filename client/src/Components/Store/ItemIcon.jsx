import React from 'react';
import coin from '../../Images/Coin.png';
import ImageDisplay from './ImageDisplay';

function ItemIcon({ item, itemOnClick }) {
  return (
    <div className="item-icon" onClick={() => itemOnClick(item)} data-testid={item.name}>
      <div className="item-icon-image">
        <ImageDisplay
          imgName={item.name}
          maxHeight="125px"
          maxWidth="200px"
        />
      </div>
      <div className="item-icon-price-cointainer">
        <img src={coin} className="item-icon-coin" alt="a coin" />
        <p className="item-icon-price">{item.price}</p>
      </div>
    </div>
  );
}

export default ItemIcon;
