import React from 'react';
import {Link} from "react-router-dom";
import '../Styles/Home.css';

// Components
import Button from '../Components/Button';
import WordeoLogo from '../Images/WordeoLogo.png';

function Home() {
    return (
        <div className='homepage'>
            <div className="homepageHeader">
                <img src={WordeoLogo} alt="Wordeo Logo" />
                <div className="signInButton">
                <Button label="Not signed in" onClick={() => { window.location = "/account/signin" }} type="secondary" size="medium" />
                </div>
            </div>
            <div className='homepageInteractive'>
                <Link to='/game' className='noStyle'>
                    <Button label="PLAY" type="primary" size="large" />       
                </Link>
                <Button label="Leaderboards" onClick={() => { }} type="primary" size="medium" />
                <div className='musicSFXToggle'>
                    <Button label="Music" onClick={() => { }} type="toggles" size="medium" />
                    <Button label="SFX" onClick={() => { }} type="toggles" size="medium" />
                </div>

            </div>
            <div className="homepageFooter">
                Login to save your progress and earn coins!
            </div>
        </div>
    );
}

function Play() {
    // Redirect to game page
    return -1;
}

export default Home;
