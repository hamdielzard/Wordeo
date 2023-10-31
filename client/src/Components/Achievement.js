import React from 'react';
import '../Styles/Account.css'
import trophy from '../Images/trophy.png';

/**
 * Single achievement table entry
 * @param name - name of the achievement
 * @param description - description of the achievement
 * @param locked - whether the achievement is locked or not
 */
const Achievement = ({ name, description, locked }) => {
    let backgroundColor = '#959595';
    let textColor = '#000000';
    let opacity = 1;

    if (locked) {
        opacity = 0.5;
    }


    return (
        <div className='achievementHolder' style={{ backgroundColor: backgroundColor, borderRadius: 20, textColor: textColor, opacity: opacity }}>
            <img src={trophy} alt='trophy' style={{ height: 64, marginLeft: 15, marginRight: 15, borderRadius: 20 }} />
            <div style={{ display: 'inline-block' }}>
                <h2>{name}</h2>
                <p>{description}</p>
            </div>
        </div>
    )
}

export default Achievement;