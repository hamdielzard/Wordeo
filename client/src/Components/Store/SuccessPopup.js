import React from "react";
import Button from "../Button";

const SuccessPopup = ({
    isVisible,
    success,
    message = success ? "The item bought has been added to your inventory" : "Insufficient funds",
    successPopupOnExit
}) => {
    let header = success ? "Success!" : "Failed!"
    let content = message
    
    return (isVisible) ? (
        <div className="success-popup">
            <div className="success-popup-header">
                {header}
            </div>
            <div className="success-popup-content">
                {content}
            </div>
            <Button 
                transparent = {false} 
                label = "Continue Shopping"
                onClick={() => {
                    successPopupOnExit({isVisible: false, success: false})
                }}
                type="secondary" 
                size="medium" 
            />
        </div>
    ) : ""
}

export default SuccessPopup