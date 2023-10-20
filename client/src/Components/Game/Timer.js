/*import React from "react";
import { useState, useEffect } from "react";

import "../../Styles/Timer.css"


const Timer = ({ initialTime, wordGuessed, onEnd, timePenalty, incorrectLettersGuessed }) => {
    const [time, setTime] = useState(initialTime)
    const [isActive, setIsActive] = useState(true)

    console.log("a")
    
    useEffect(() => {

        let intervalId;
        if (!wordGuessed && isActive && time > 0) {
            intervalId = setInterval(() => {
                setTime((prevTime) => prevTime - 1);
            }, 1000);
        } 
        // time ends
        else if (!wordGuessed && isActive && time <= 0) {    
            onEnd(0)
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
            let scoreEarned = Math.round((initialTime * 10) * (time / initialTime))
            onEnd(scoreEarned)
            setIsActive(false)
        }
        return () => clearInterval(intervalId);
    }, [isActive, time, onEnd]);

    useEffect(() => {
        // Only apply penalties when there are wrong letters
        if (!incorrectLettersGuessed == 0) {
            setTime(prev => prev - timePenalty)
        }
    }, [incorrectLettersGuessed])

    return (
        <div className="timer">
            <div className="timer-text">{time}</div>
        </div>
    );
};

export default Timer;*/


import React from "react";
import { useState, useEffect } from "react";

import "../../Styles/Timer.css"

const Timer = ({ initialTime, wordGuessed, onEnd, timePenalty, incorrectLettersGuessed }) => {
    const [time, setTime] = useState(initialTime)
    
    useEffect(() => {

        let intervalId;
        if (!wordGuessed && time > 0) {
            intervalId = setInterval(() => {
                setTime((prevTime) => prevTime - 1);
            }, 1000);
        } 
        // time ends
        else if (!wordGuessed && time <= 0) {    
            onEnd(0)
        } 
        // Word was guessed correctly
        else if (wordGuessed) {
            let scoreEarned = Math.round((initialTime * 10) * (time / initialTime))
            onEnd(scoreEarned)
        }
        return () => clearInterval(intervalId);
    }, [time]);

    // If initalTime has changed, a new round has started
    useEffect(() => {
        setTime(initialTime)
    }, [initialTime])

    useEffect(() => {
        // Only apply penalties when there are wrong letters
        if (!incorrectLettersGuessed == 0) {
            setTime(prev => prev - timePenalty)
        }
    }, [incorrectLettersGuessed])

    return (
        <div className="timer">
            <div className="timer-text">{time}</div>
        </div>
    );
};

export default Timer;