import React from "react";

import Timer from './Timer';

const CoreGame = (props) =>
{
    const [roundStatus, updateRoundStatus] = React.useState({
        correctWords: [],
        incorrectWords: []
    })

    const [time, updateTime] = React.useState({
        timeRemaining: 0
    })

    return(
        <div>
            <Timer />
            <div className="hint">
                {props.wordData.hints[0]}
            </div>
        </div>
    )
}

export default CoreGame