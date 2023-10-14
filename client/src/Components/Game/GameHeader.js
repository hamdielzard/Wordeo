import React from "react";
import '../../Styles/Game.css';

const GameHeader = (props) => {
    return (
        <div className="gameheader">
            <div className = "gameheader--score">
                Score: <span className="bold">{props.score}</span>
            </div>
            <div className = "gameheader--round">
                Round <span className="bold">{props.round} of {props.maxRound}</span>
            </div>
            <div className = "gameheader--name">
                {props.name}
            </div>
        </div>
    )
}

export default GameHeader