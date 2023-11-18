import React, { useEffect } from "react";
import "../Styles/Timer.css"

/**
 * **Timer component**
 * @param {int, function} { initialTime, onTimerComplete } For the initial time, and the function to call when the timer is complete
 * @returns Timer component
 */
const Timer = ({ initialTime, onTimerComplete }) => {
    const [time, setTime] = React.useState(initialTime);

    useEffect(() => {
        let intervalId;
        if (time > 0) {
            intervalId = setInterval(() => {
                setTime((prevTime) => prevTime - 1);
            }, 1000);
        } else {
            onTimerComplete();
        }
        return () => clearInterval(intervalId);
    });

    return (
        <div className="timer">
            <div className="timer-text">{time}</div>
        </div>
    );
}

export default Timer;
