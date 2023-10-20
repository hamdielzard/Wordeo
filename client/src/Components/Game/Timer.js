import React from "react";
import { useState, useEffect } from "react";

import "../../Styles/Timer.css"

const Timer = ({ initialTime, wordGuessed, onEnd }) => {
    const [time, setTime] = useState(initialTime);
    const [isActive, setIsActive] = useState(true)

    useEffect(() => {

        let intervalId;
        if (!wordGuessed && isActive && time > 0) {
            intervalId = setInterval(() => {
                setTime((prevTime) => prevTime - 1);
            }, 1000);
        } 
        // time ends
        else if (!wordGuessed && isActive && time === 0) {    
            onEnd()
            // Deactivate timer so that it is not immediately used upon re render
            setIsActive(false); 
        } 
        // If timer component is not active, reactivate it for use
        else if (!isActive) {
            setTime(initialTime)
            setIsActive(true)
        }
        // Word was guessed correctly
        else if (wordGuessed) {
            let scoreEarned = (initialTime * 10) * (time / initialTime)
            onEnd(scoreEarned)
            setIsActive(false)
        }
        return () => clearInterval(intervalId);
    }, [isActive, time, onEnd]);

    return (
        <div className="timer">
            <div className="timer-text">{time}</div>
        </div>
    );
};

export default Timer;