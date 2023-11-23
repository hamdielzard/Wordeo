import React from 'react';
import '../Styles/Home.css';
import '../Styles/Card.css';
import { ReactComponent as Crown } from '../Images/crown.svg';

function Card({
  name: displayName, foreColour, backColour, userName, image, onClick, owner,
}) {
  // eslint-disable-next-line no-unused-vars
  const [user, setUser] = React.useState(null);

  let fc = 'black'; // foreground colour
  let bc = 'white'; // background colour
  let img = null; // image behind card

  if (foreColour) {
    fc = foreColour;
  }
  if (backColour) {
    bc = backColour;
  }
  if (image) {
    img = image;
  }
  if (userName) {
    setUser(userName);
  }

  return (
    <div
      className="mainCard"
      style={{
        color: fc,
        backgroundColor: bc,
        backgroundImage: `url(${img})`,
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0px 0px 20px 3px ${bc}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = `0px 0px 0px 0px ${bc}`;
      }}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 10,
      }}
      >
        <h2 style={{ margin: 20 }}>{displayName}</h2>
        {owner && (
        <div style={{ filter: 'drop-shadow(0px 0px 10px #D9BD89)' }}>
          <Crown style={{ padding: 0 }} width={36} height={32} />
        </div>
        )}
      </div>
    </div>
  );
}

export default Card;
