import React from 'react';
import '../Styles/Account.css'
import trophy from '../Images/trophy.png';

/**
 * Single achievement table entry
 * @param name - name of the achievement
 * @param description - description of the achievement
 */

const Achievement = ({ name,description }) => {
    return (
        <div className='achievementHolder'>
            <img src={trophy} alt='trophy' style={{height:64,marginLeft:15,marginRight:15,borderRadius:20}}/>
            <div style={{display:'inline-block'}}>
                <h2>{name}</h2>
                <p>{description}</p>
            </div>
        </div>
    )
}

export default Achievement;