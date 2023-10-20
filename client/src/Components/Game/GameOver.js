import React from "react";
import {Link} from "react-router-dom";

import Button from "../Button";

const GameOver = (props) => {
    return(
        <div className="gameOver">
            <div className="gameOver--text">
                Lexical Legend!
            </div>
            <div className="gameOver--score">
                {props.score}
            </div>
            <Button label="Play again?" onClick={props.restartGame} type="primary" size="medium" />
            <Button label="Leave game" onClick={() => {window.location = "/"}} type="secondary" size="medium" />
        </div>
    )
}

export default GameOver