import React from "react";

const LetterBox = (props) => {
    const styles = {
        visibility: props.visibility,
    }

    return (
        <div 
            style={styles}
            className="letter"
            id = {props.id}
        >
            {props.letter}
        </div>
    )
}

export default LetterBox