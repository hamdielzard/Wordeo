import React from 'react';
import PropTypes from 'prop-types';
import '../Styles/Button.css';

/**
 * Button component in the style of Wordeo
 * @param label - String that is displayed on the button
 * @param onClick - Function that is called when the button is clicked
 * @param type - String that determines the type of button [primary, secondary, ternary, toggles]
 * @param size - String that determines the text size of the button [small, medium, large]
 */
const Button = ({ label, onClick, type, size }) => {

    let buttonType = 'button-primary';

    if (type === 'secondary') {
        buttonType = 'button-secondary';
    } else if (type === 'ternary') {
        buttonType = 'button-ternary';
    } else if (type === 'toggles') {
        buttonType = 'button-toggles';
    }

    let buttonSize = 32;

    if (size === 'small') {
        buttonSize = 16;
    }
    else if (size === 'large') {
        buttonSize = 48;
    }


    return (
        <button className={buttonType} style={{ fontSize: buttonSize }} onClick={onClick}>
            {label}
        </button>
    );
};

Button.propTypes = {
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    type: PropTypes.oneOf(['primary', 'secondary', 'ternary', 'toggles']),
    size: PropTypes.oneOf(['small', 'medium', 'large']),
};

Button.defaultProps = {
    type: 'primary',
    size: 'medium',
};

export default Button;
