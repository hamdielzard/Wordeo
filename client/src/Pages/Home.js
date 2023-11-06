import React from 'react';
import '../Styles/Home.css';

// Components
import Button from '../Components/Button';
import WordeoLogo from '../Images/WordeoLogo.png';

/**
 * **Landing page for Wordeo**
 * 
 * Cookie displayName and userName are checked here to see if the user is logged in.
 * Both cookies must exist!
 * *Backend*: `V2`
 * @returns React page for the home page
 */
function Home() {
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
                <Button label="LEADERBOARD" onClick={() => { window.location = "/leaderboard" }} type="primary" size="medium" />
            </div>
            <div className="homepageFooter">
                Login to save your progress!
            </div>
        </div>
    );
}

/**
 * **Login Button React component*
 * 
 * @returns Returns a button on the homepage that either says "Not signed in" or the displayName
 */
function loginButton() {
    let displayName;
    let userName;

    const displayNameExists = document.cookie.split(";").some((item) => item.trim().startsWith("displayName="));
    const userNameExists = document.cookie.split(";").some((item) => item.trim().startsWith("userName="));

    if (displayNameExists && userNameExists) {
        displayName = ('; ' + document.cookie).split(`; displayName=`).pop().split(';')[0];
        userName = ('; ' + document.cookie).split(`; userName=`).pop().split(';')[0];
    }

    // If logged in
    if (userNameExists && displayNameExists) {
        return (
            <Button transparent={false} label={displayName} onClick={() => { window.location = "/account/" + userName }} type="secondary" size="medium" />
        )
    }
    else {
        return (
            <Button transparent={true} label="Not signed in" onClick={() => { window.location = "/account/signin" }} type="secondary" size="medium" />
        )
    }
}

export default Home;