import React from 'react';
import ImageDisplay from '../../Store/ImageDisplay';
import '../../../Styles/Powerup.css';

function PowerupButton({ powerups, powerupHandler }) {
  const buttons = powerups.map((item) => {
    let isSelectable = false;
    let style = '';

    if (item.quantity > 0 && !item.hasActivated) {
      isSelectable = true;
      style = {
        cursor: 'pointer',
      };
    } else {
      // eslint-disable-next-line no-unused-vars
      style = {
        cursor: 'auto',
      };
    }

    return (
      <div className="power-up-button-container">
        <div
          className="power-up-button"
          key={item.name}
          style={isSelectable ? { cursor: 'pointer' } : { cursor: 'auto' }}
          onClick={() => powerupHandler(item)}
        >
          <ImageDisplay
            imgName={item.name}
            maxHeight="80px"
            maxWidth="60px"
          />

          {item.quantity}
        </div>
        {!isSelectable && <div className="power-up-button-overlay" />}
      </div>

    );
  });

  return (
    <div className="power-up-grid">
      {buttons}
    </div>
  );
}

export default PowerupButton;
