import React, { useState } from "react";
import Button from "../Button";
import ImageDisplay from "./ImageDisplay";

const ItemPopup = ({item, isVisible, popupOnExit}) => {
    const [quantity, updateQuantity] = useState(1)

    return (isVisible) ? (
        <div>
            <div className="item-popup-overlay" />
            <div className="item-popup">
                <div className="item-popup-exit">
                    <Button 
                        transparent = {false} 
                        label = "Exit" 
                        onClick={() => {
                            popupOnExit(false, item, quantity)
                            updateQuantity(1)
                        }}
                        type="ternary" 
                        size="small"
                    />
                </div>
                <div className="item-popup-image">
                    <ImageDisplay
                        imgName={item.name}
                        maxWidth="250px"
                    />
                </div>
                <div className="item-popup-information">
                    <div className="item-popup-name">{item.name}</div>
                    <div className="item-popup-description">{item.description}</div>
                    {
                        item.category == "powerup" ?
                        <div className="item-popup-payment">
                            <input 
                                type="number"
                                required
                                value={quantity}
                                onChange={(e) => updateQuantity((e.target.value != 0) ? e.target.value : 1)}
                                className="quantity-input-box"
                            />
                            <Button 
                                transparent = {false} 
                                label = {(item.price * quantity).toString()} 
                                onClick={() => {
                                    popupOnExit(true, item, quantity, item.price * quantity)
                                    updateQuantity(1)
                                }}
                                type="secondary" 
                                size="medium" 
                            />
                        </div> :
                        <div className="item-popup-payment">
                            <input 
                                type="number"
                                required
                                value={quantity}
                                className="quantity-input-box"
                            />
                            <Button 
                                transparent = {false} 
                                label = {(item.price * quantity).toString()} 
                                onClick={() => {
                                    popupOnExit(true, item, quantity, item.price * quantity)
                                    updateQuantity(1)
                                }}
                                type="secondary" 
                                size="medium" 
                            />
                        </div>
                    }
                </div>
            </div>
        </div>
    ) : ""
}

export default ItemPopup