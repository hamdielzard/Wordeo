// Responsible for timer on game page and calculates the score based on time remaining

import React from "react";
import { useState, useEffect } from "react";

import "../../Styles/Timer.css"

const Timer = ({ initialTime, wordGuessed, onEnd, timePenalty, incorrectLettersGuessed, activePowerup, powerupOnConsume }) => {
    const [time, setTime] = useState(initialTime)
    const [hasEnded, updateHasEnded] = useState(false)
    
    useEffect(() => {

        let intervalId;
        if (!wordGuessed && time > 0) {
            intervalId = setInterval(() => {
                setTime((prevTime) => prevTime - 1);
            }, 1000);
        } 
        // time ends
        else if (!wordGuessed && time <= 0) {    
            onEnd(initialTime, time)
            setTime(initialTime)
        } 
        return () => clearInterval(intervalId);
    }, [time]);

    useEffect(() => {
        // Only apply penalties when there are wrong letters
        if (!incorrectLettersGuessed == 0) {
            setTime(prev => prev - timePenalty)
        }
    }, [incorrectLettersGuessed])

    // Check if word was guessed correctly
    useEffect(() => {
        if (wordGuessed) {
            onEnd(initialTime, time)
            setTime(initialTime)
        }
    }, [wordGuessed])

    useEffect(() => {
        if (activePowerup == "Add Time") {
            setTime(prev => prev + 5)
            powerupOnConsume()
        }
    }, [activePowerup])

    return (
        <div className="timer">
            <div className="timer-text">{time}</div>
        </div>
    );
};

export default Timer;