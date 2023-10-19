import React from "react";
import { useState, useEffect } from "react";

import "../../Styles/Timer.css"



const Timer = ({ initialTime, onEnd }) => {
    const [time, setTime] = useState(initialTime);
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        let intervalId;
        if (isActive && time > 0) {
            intervalId = setInterval(() => {
                setTime((prevTime) => prevTime - 1);
            }, 1000);
        } else if (time === 0) {
            onEnd();
            setIsActive(false);
        }
        return () => clearInterval(intervalId);
    }, [isActive, time, onEnd]);

    const handleReset = () => {
        setIsActive(false);
        setTime(initialTime);
    };

    return (
        <div className="timer">
            <div className="timer-text">{time}</div>
        </div>
    );
};

export default Timer;