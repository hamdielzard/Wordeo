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
            <div className="gameOver--coins">
                + {props.coins} coins
            </div>
            <Button label="Play again?" onClick={props.restartGame} type="primary" size="medium" />
            <Link to='/' className='noStyle'>
                <Button label="Leave game" onClick={() => {}} type="secondary" size="medium" />
            </Link>
        </div>
    )
}

export default GameOver