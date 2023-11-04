import React from "react";
import coin from "../../Images/Coin.png"

const Currency = ({balance}) => {
    return (
        <div className="currency">
            <img src = {coin} className="item-icon-coin"/>
            <p className="item-icon-price">{balance}</p>
        </div>
    )
}

export default Currency