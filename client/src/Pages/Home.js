import React from 'react';
import {Link} from "react-router-dom";
import '../Styles/Home.css';

// Components
import Button from '../Components/Button';

function Home() {
    return (
        <div className='homepage'>
            <div className="homepageHeader">
                <h1>Wordeo</h1>
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

            </div>
        </div>
    );
}


export default Home;
