import React from 'react';
import sandClock from '../../Images/addTime.png';
import eye from '../../Images/eye.png';
import royal from '../../Images/royal.jpeg';
import hallowween from '../../Images/hallowween.jpeg';
import ghosticon from '../../Images/ghost-icon.svg';
import caticon from '../../Images/cat-icon.svg';

function ImageDisplay({ imgName, maxHeight, maxWidth }) {
  let imgsrc = '';

  // TODO: Match Items with their icon whenever item is added
  if (imgName === 'Add Time') {
    imgsrc = sandClock;
  } else if (imgName === 'Reveal Letter') {
    imgsrc = eye;
  } else if (imgName === 'Royal') {
    imgsrc = royal;
  } else if (imgName === 'Halloween') {
    imgsrc = hallowween;
  } else if (imgName === 'Calico Cat') {
    imgsrc = caticon;
  } else if (imgName === 'Spooky Ghost') {
    imgsrc = ghosticon;
  }

  const imageStyle = {
    maxWidth,
    maxHeight,
  };

  return (
    <div>
      <img src={imgsrc} style={imageStyle} className="image-display" alt={imgName} />
    </div>
  );
}

export default ImageDisplay;
