import React from 'react';
import '../Styles/Account.css';
import trophy from '../Images/trophy.png';

/**
 * Single achievement table entry
 * @param name - name of the achievement
 * @param description - description of the achievement
 * @param locked - whether the achievement is locked or not
 */
function Achievement({ name, description, locked }) {
  const backgroundColor = '#959595';
  const textColor = '#000000';
  let opacity = 1;

  if (locked) {
    opacity = 0.5;
  }

  return (
    <div
      className="achievementHolder"
      style={{
        backgroundColor,
        borderRadius: 20,
        textColor,
        opacity,
        margin: 10,
        border: '2px solid #F0F0F0',
      }}
    >
      <img
        src={trophy}
        alt="trophy"
        style={{
          height: 64, marginLeft: 15, marginRight: 15, borderRadius: 20,
        }}
      />
      <div style={{ display: 'inline-block' }}>
        <h2>{name}</h2>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default Achievement;
