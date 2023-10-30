//component for an entry on the leaderboard
import React from 'react';
import '../Styles/Leaderboard.css'

const BoardEntry = ({ score,user,display,col,rank }) => {
    if(display && display!=user)
    return (
        <tr className='scoreRow'>
            <td style={{paddingRight:"120px",minwidth:"100px",color:col}}>#{rank}</td>
            <td style={{paddingRight:"120px",minWidth:"100px",color:col}}>{user} ({display})</td>
            <td style={{width:"100px",color:col}}>{score}</td>
        </tr>
    )
    else
    return (
        <tr className='scoreRow'>
            <td style={{paddingRight:"120px",minwidth:"100px",color:col}}>#{rank}</td>
            <td style={{paddingRight:"120px",minWidth:"100px",color:col}}>{user}</td>
            <td style={{width:"100px",color:col}}>{score}</td>
        </tr>
    )
}

export default BoardEntry;