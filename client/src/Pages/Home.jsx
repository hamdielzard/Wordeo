/* eslint-disable no-unused-expressions */
import React from 'react';
import '../Styles/Home.css';

// Components
import Button from '../Components/Button';
import WordeoLogo from '../Images/WordeoLogo.png';

const API_URL = 'http://localhost:8080';

/**
 * **Landing page for Wordeo**
 *
 * Cookie displayName and userName are checked here to see if the user is logged in to update
 * the button.
 *
 * Both cookies must exist!
 *
 * *Backend*: `V2`
 * @returns React page for the home page
 */
function Home() {
  const [playClicked, setPlayClicked] = React.useState(false);
  const [playModalOpen, setPlayModalOpen] = React.useState(false);
  const [warningError, setWarningError] = React.useState('');
  const [joinCode, setJoinCode] = React.useState('');

  React.useEffect(() => {

  }, []);

  const handleJoinCodeChange = (event) => {
    setJoinCode(event.target.value);
  };

  const handleSoloPlayClick = () => {
    // Request a solo play game code
    requestNewLobby('solo');
  };

  const handleJoinGameClick = () => {
    window.location.pathname = `/game/${joinCode}`;
  };

  const handleCreateGameClick = () => {
    requestNewLobby('multi');
  };

  // Backend Calls
  async function requestNewLobby(gameMode) {
    let displayName;
    let userName;

    const displayNameExists = document.cookie.split(';').some((item) => item.trim().startsWith('displayName='));
    const userNameExists = document.cookie.split(';').some((item) => item.trim().startsWith('userName='));

    if (displayNameExists && userNameExists) {
      // eslint-disable-next-line no-unused-vars
      displayName = (`; ${document.cookie}`).split('; displayName=').pop().split(';')[0];
      userName = (`; ${document.cookie}`).split('; userName=').pop().split(';')[0];
    }

    // If logged in
    if (userNameExists && displayNameExists) {
      const response = await fetch(`${API_URL}/game`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName,
          gameMode,
        }),
      });

      const data = await response.json();

      if (response.status !== 200) {
        throw Error(data.message);
      } else if (data.message.includes('created successfully') && data.userName === userName) {
        window.location.pathname = `/game/${data.gameDetails.gameCode}`;
      }
    } else {
      alert('You are not logged in!');
    }
  }

  // Main Page
  return (
    <div className="homepage">
      <div className="homepageHeader">
        <img className="homepageLogo" src={WordeoLogo} alt="Wordeo Logo" />
        <div className="signInButton">{loginButton()}</div>
      </div>
      <div className="homepageInteractive">
        <Button label="PLAY" onClick={() => { setPlayClicked(true); setPlayModalOpen(true); }} type="primary" size={48} />
        {playClicked && (
        <div className={`overlay ${playModalOpen ? 'overlayFadeIn' : 'overlayFadeOut'}`}>
          <div className={`modalBox ${playModalOpen ? 'modalOpen' : 'modalClose'}`}>
            <div className="modalBoxHeader">
              Play
            </div>
            <div className="modalBoxBody">
              <p className="modalLabel">Solo Play</p>
              <div className="modalButtonSection">
                <Button label="Play now!" onClick={() => { handleSoloPlayClick(); }} type="secondary" size={32} />
              </div>
              <p className="modalLabel">Multiplayer</p>
              <div className="modalButtonSection">
                <div className="multiplayerComponents">
                  <input tabIndex="0" className="modalInput" type="text" placeholder="JOIN CODE" onChange={handleJoinCodeChange} maxLength={6} onKeyDown={(e) => { e.key === 'Enter' ? setWarningError('Not implemented yet!') : noOp(); }} />
                  <Button label="Join Game" onClick={() => { handleJoinGameClick(); }} type="primary" size={32} />
                  <Button label="Create Game" onClick={() => { handleCreateGameClick(); }} type="secondary" size={32} />
                </div>
              </div>

              <Button label="Cancel" onClick={() => { setPlayModalOpen(false); setTimeout(setPlayClicked, 100); }} type="ternary" size={32} />
            </div>
          </div>
          {warningError && (
          <div className={`toastRed ${warningError ? '' : ''}`}>
            {warningError}
            <div style={{ display: 'none' }}>
              {setTimeout(() => { setWarningError(''); }, 3000)}
            </div>
          </div>
          )}
        </div>
        )}
        <br />
        <Button label="LEADERBOARD" onClick={() => { window.location = '/leaderboard'; }} type="primary" size={32} />
        <br />
        <Button label="STORE" onClick={() => { window.location = '/store'; }} type="primary" size={32} />
      </div>

      <div className="homepageFooter">Login to save your progress!</div>
    </div>
  );
}

function noOp() { }

// Helper functions

/**
 * **Login Button React component*
 *
 * @returns Returns a button on the homepage that either says "Not signed in" or the displayName
 */
function loginButton() {
  let displayName;
  let userName;

  const displayNameExists = document.cookie.split(';').some((item) => item.trim().startsWith('displayName='));
  const userNameExists = document.cookie.split(';').some((item) => item.trim().startsWith('userName='));

  if (displayNameExists && userNameExists) {
    displayName = (`; ${document.cookie}`).split('; displayName=').pop().split(';')[0];
    userName = (`; ${document.cookie}`).split('; userName=').pop().split(';')[0];
  }

  // If logged in
  if (userNameExists && displayNameExists) {
    return (
      <Button transparent={false} label={displayName} onClick={() => { window.location = `/account/${userName}`; }} type="secondary" size={32} />
    );
  }

  return (
    <Button transparent label="Not signed in" onClick={() => { window.location = '/account/signin'; }} type="secondary" size={32} />
  );
}

export default Home;
