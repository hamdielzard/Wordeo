import React from 'react';
import PropTypes from 'prop-types';
import '../Styles/Button.css';

/**
 * Button component in the style of Wordeo
 * @param label - String that is displayed on the button
 * @param onClick - Function that is called when the button is clicked
 * @param type - String that determines the type of button [primary, secondary, ternary, toggles]
 * @param size - String that determines the text size of the button [small, medium, large]
 * @param transparent - Boolean that determines if the button is transparent or not
 * @param scale - Number that determines the scale of the button
 * @param width - Number that determines the width of the button
 */
const Button = ({ label, onClick, type, size, transparent, scale, width }) => {

    let buttonType = 'button-primary';

    if (type === 'secondary') {
        buttonType = 'button-secondary';
    } else if (type === 'ternary') {
        buttonType = 'button-ternary';
    } else if (type === 'toggles') {
        buttonType = 'button-toggles';
    } else if (type === 'gray') {
        buttonType = 'button-gray';
    }

    let buttonTextSize = 32;

    if (size === 'small') {
        buttonTextSize = 16;
    }
    else if (size === 'large') {
        buttonTextSize = 48;
    }
    else if (!isNaN(size)) {
        buttonTextSize = size;
    }

    let opacity = 1;
    if (transparent) {
        opacity = 0.5;
    }

    let buttonScale = 1;
    if (scale) {
        buttonScale = scale;
    }

    let buttonWidth = 340;
    if (width) {
        buttonWidth = width;
    }


    return (
        <button className={buttonType} style={{ fontSize: buttonTextSize, opacity: opacity, scale: buttonScale, width: width }} onClick={onClick}>
            {label}
        </button>
    );
};

Button.propTypes = {
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    type: PropTypes.oneOf(['primary', 'secondary', 'ternary', 'toggles', 'gray']),
    size: PropTypes.number || PropTypes.oneOf(['small', 'medium', 'large']),
    transparent: PropTypes.bool,
    scale: PropTypes.number,
};

Button.defaultProps = {
    type: 'primary',
    size: 'medium',
    transparent: false,
    scale: 1,
};

export default Button;
