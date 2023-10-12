import React from 'react';
import './Styles/Home.css';
import Button from './Components/Button';

function Home() {
    return (
        <div className='homepage'>
            <div className="homepageHeader">
                <h1>Wordeo</h1>
            </div>
            <div className='homepageInteractive'>
                <Button label="PLAY" onClick={() => { }} type="primary" size="large" />
                <Button label="Leaderboards" onClick={() => { }} type="primary" size="medium" />
                <div className='musicSFXToggle'>
                    <Button label="Music" onClick={() => { }} type="toggles" size="medium" />
                    <Button label="SFX" onClick={() => { }} type="toggles" size="medium" />
                </div>
            </div>
            <div className="homepageFooter">

            </div>
        </div>
    );
}


export default Home;
