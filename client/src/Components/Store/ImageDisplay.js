import React from "react";
import sandClock from "../../Images/addTime.png"
import eye from "../../Images/eye.png"
import royal from "../../Images/royal.jpeg"
import hallowween from "../../Images/hallowween.jpeg"

const ImageDisplay = ({imgName, maxHeight, maxWidth}) => {
    let imgsrc = ""

    if (imgName == "Add Time") {
        imgsrc = sandClock
    }
    else if (imgName == "Reveal Letter") {
        imgsrc = eye
    }
    else if (imgName == "Royal") {
        imgsrc = royal
    }
    else if (imgName == "Halloween") {
        imgsrc = hallowween
    }

    const imageStyle = {
        maxWidth: maxWidth,
        maxHeight: maxHeight
    }

    return(
        <div>
            <img src = {imgsrc} style = {imageStyle} className = "image-display"/>
        </div>
    )
}

export default ImageDisplay