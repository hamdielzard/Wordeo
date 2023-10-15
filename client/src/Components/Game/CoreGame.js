import React from "react";

import Timer from './Timer';
import LetterBox from "./LetterBox";

const CoreGame = (props) => {
    const [roundStatus, updateRoundStatus] = React.useState({
        correctWords: [],
        incorrectWords: []
    })

    const [time, updateTime] = React.useState({
        timeRemaining: 0
    })

    const letters = []
    for (let i = 0; i < props.wordData.word.length; i++) {
        letters.push(
            <div className="letterbox">
                <LetterBox 
                    key = {i}
                    letter = {props.wordData.word.charAt(i)}
                />
            </div>
        )
    }

    return(
        <div className="coreGame">
            <Timer />
            <div className="hint">
                {props.wordData.hints[0]}
            </div>
            <div className="lettergrid">
                {letters}
            </div>
        </div>
    )
}

export default CoreGame