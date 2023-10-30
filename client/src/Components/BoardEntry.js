//component for an entry on the leaderboard
import React from 'react';
import '../Styles/Leaderboard.css'

const BoardEntry = ({ score,user,display,col,rank }) => {
    if(display && display!=user)
    return (
        <tr className='scoreRow'>
            <td style={{paddingRight:"120px",Width:"50px",color:col}}>#{rank}</td>
            <td style={{paddingRight:"120px",minWidth:"120px",maxWidth:"120px",color:col}}>{user} ({display})</td>
            <td style={{width:"100px",color:col}}>{score}</td>
        </tr>
    )
    else
    return (
        <tr className='scoreRow'>
            <td style={{paddingRight:"120px",Width:"50px",color:col}}>#{rank}</td>
            <td style={{paddingRight:"120px",minWidth:"120px",maxWidth:"120px",color:col}}>{user}</td>
            <td style={{width:"100px",color:col}}>{score}</td>
        </tr>
    )
}

export default BoardEntry;