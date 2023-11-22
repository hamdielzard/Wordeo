import React from 'react';
import Button from '../Button';
import '../../Styles/Store.css';

function Menu({ selection, updateSelection }) {
  return (
    <div className="menu">
      <div className="menu-title">
        Store
      </div>
      <div className="menu-item-buttons">
        <Button
          transparent={selection === 'all'}
          label="All"
          onClick={() => { updateSelection('all'); }}
          type="primary"
          size="medium"
          className="menu-button"
        />
        <Button
          transparent={selection === 'powerup'}
          label="Powerups"
          onClick={() => { updateSelection('powerup'); }}
          type="primary"
          size="medium"
          className="menu-button"
        />
        <Button
          transparent={selection === 'icon'}
          label="Icons"
          onClick={() => { updateSelection('icon'); }}
          type="primary"
          size="medium"
          className="menu-button"
        />
      </div>
      <div className="menu-exit">
        <Button
          label="Exit"
          onClick={() => { window.location = '/'; }}
          type="ternary"
          size="medium"
          className="menu-button"
        />
      </div>
    </div>
  );
}

export default Menu;
