import React from 'react';
import { useLayoutEffect } from 'react';
import '../Styles/Home.css';

// Components
import Button from '../Components/Button';
import WordeoLogo from '../Images/WordeoLogo.png';

function Home() {

    useLayoutEffect(()=>{
        document.body.style.backgroundColor = "#FFF";
    })

    return (
        <div className='homepage'>
            <div className="homepageHeader">
                <img src={WordeoLogo} alt="Wordeo Logo" />
                <div className="signInButton">
                    {loginButton()}
                </div>
            </div>
            <div className='homepageInteractive'>
                <Button label="PLAY" onClick={() => { window.location = "/game" }} type="primary" size="large" />       
                <Button label="Leaderboards" onClick={() => { }} type="primary" size="medium" />
                <div className='musicSFXToggle'>
                    <Button label="Music" onClick={() => { }} type="toggles" size="medium" />
                    <Button label="SFX" onClick={() => { }} type="toggles" size="medium" />
                </div>

            </div>
            <div className="homepageFooter">
                Login to save your progress!
            </div>
        </div>
    );
}

function loginButton()
{
    if((document.cookie.split(";").some((item) => item.trim().startsWith("user="))))
    {
        const cookie = ('; '+document.cookie).split(`; user=`).pop().split(';')[0];
        return(
                <Button label={cookie} onClick={() => { window.location = "/account/"+cookie }} type="secondary" size="medium" />
        )
    }
    else
    {
        return(
                <Button label="Not signed in" onClick={() => { window.location = "/account/signin" }} type="secondary" size="medium" />
        )
    }
}

function Play() {
    // Redirect to game page
    return -1;
}

export default Home;
