//account page for a logged in user

//currently any name can be given via localhost:300/account/username-go-here
//but later will reroute to sign in page if no login cookie (which is got after sign in confirms valid user with backend)

import React, { useEffect } from 'react';
import { useState, useLayoutEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
//styles
import '../Styles/Account.css'
import '../Styles/General.css'
//resources
import WordeoLogo from '../Images/WordeoLogo.png';
import Achievement from '../Components/Achievement';
import Button from '../Components/Button';

const AccountPage = () => {
    const { user } = useParams();

    const [canLogin, setCanLogin] = useState(true);
    const [editing, setEditing] = useState(false);
    const [wantDelete, setDelete] = useState(false);

    const [reply, setReply] = useState({});

    const baseUrl = "http://localhost:8080";

    const [userData, setUserData] = useState({
        username: user,
        highscore: 0,
        played: 0,
        description: "",
        achievements: []
    })

    //check for cookie to set canLogin (stub for now)
    let loggedInUser = "Guest";
    let userId = "";

    const cookiePairs = document.cookie.split(';');

    // Iterate through the cookie pairs to find the 'user' and 'userID' values
    for (const pair of cookiePairs) {
        const [key, value] = pair.trim().split('=');
        if (key === 'user') {
            loggedInUser = value;
        } else if (key === 'userid') {
            userId = value;
        }
    }

    useLayoutEffect(() => {
        document.body.style.backgroundColor = "#393939";
    })

    useEffect(() => {
        const fetchScoreData = async (userId) => {
            let highScore = 0;
            let numGames = 0;
            try {
                const res = await fetch(`${baseUrl}/scores?userID=${userId}`);
                const data = await res.json();
                if (data.length) {
                    highScore = parseInt(data[0].score);
                    numGames = parseInt(data.length);
                }
            } catch (err) {
                console.log(err);
            }

            // set state with the result
            setUserData(prev => ({
                ...prev,
                highscore: highScore,
                played: numGames
            }));
        }

        const callAPIAccountOld = async (userId) => {
            let desc = `${user}'s bio!`;
            try {
                const reqJson =
                {
                    userID: userId
                }

                const res = await fetch(baseUrl + '/user/show', {
                    method: 'POST',
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify(reqJson)
                });

                const data = await res.json();
                if (data.response.description !== "") {
                    desc = data.response.description;
                }

            } catch (err) {
                console.log(err);
            }

            // set state with the result
            setUserData(prev => ({
                ...prev,
                description: desc
            }));
        }

        //if not test mode check cookie and update the data
        //the tests will only use the template
        if ((process.env.JEST_WORKER_ID === undefined || process.env.NODE_ENV !== 'test')) {
            setCanLogin(loggedInUser == user);
            if (loggedInUser == user) {
                //logged in, so get auth from backend to update the data template
                callAPIAccountOld(userId);
                fetchScoreData(userId);
            }
        }
    }, [])

    //login check with backend is skipped if in test mode
    //  (test renders with the template info)
    if (canLogin || (!(process.env.JEST_WORKER_ID === undefined || process.env.NODE_ENV !== 'test'))) {
        return (
            <div>
                {page()}
            </div>
        )
    }
    else {
        //if not logged in or testing auto-redirect to sign in
        return <Navigate to='/account/signin' />
    }

    function handleEdit() {
        setEditing(!editing);
    }

    function handleEditApply() {
        try {
            let desc = document.getElementById('descInput').value;
            setUserData(
                {
                    username: userData.username,
                    highscore: userData.highscore,
                    played: userData.played,
                    description: desc,
                    achievements: userData.achievements
                }
            )

            //send updates to backend if not testing
            if ((process.env.JEST_WORKER_ID === undefined || process.env.NODE_ENV !== 'test')) {
                callAPIEdit(userId, desc);
            }


            setEditing(!editing);
        }
        catch (error) {
            alert('There was a problem applying the changes.' + error)
        }
    }

    async function callAPIEdit(userId, description) {
        const reqJson =
        {
            userID: userId,
            userName: loggedInUser,
            description: description
        }

        const res = await fetch(baseUrl + '/user/update', {
            method: 'POST',
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(reqJson)
        });

        const data = await res.json()

        if (data)
            setReply(data)
        else {
            setReply("An error occured")
            console.log('error')
        }
    }

    function handleLogout() {
        //remove login cookie here
        document.cookie = "user=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT"
        toHome();
    }

    function handleWantDelete() {
        //user wants to delete account
        setDelete(!wantDelete)
    }

    function doDelete() {
        //backend deletion go here
        //remove cookie
        if ((process.env.JEST_WORKER_ID === undefined || process.env.NODE_ENV !== 'test'))
            callAPIDelete({ user })

        document.cookie = "user=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT"
        toHome();
    }

    async function callAPIDelete(name) {
        console.log('delete account ' + name)
        const reqJson =
        {
            userID: name
        }

        const res = await fetch(baseUrl + '/api/delete', {
            method: 'POST',
            headers: {
                "Content-type": "application/json"
            },
            body: (reqJson)
        });

        const data = await res.json()

        if (data)
            setReply(data)
        else {
            setReply("An error occured")
            console.log('error')
        }

        console.log(reply)
    }

    function toHome() {
        //returns to home menu
        window.location = '/';
    }

    function page() {
        if (!wantDelete)
            return (
                <div>
                    {top()}
                    <div>
                        {editMode()}
                    </div>
                </div>
            )
        else
            return (
                <div>
                    {editMode()}
                </div>
            )
    }

    function editMode() {
        if (!editing)    //normal account display
            return (
                <div>
                    <div className='accountColoumn' style={{ display: 'inline-block', position: 'absolute', top: '35%', left: '0%', right: '30%' }}>
                        <h1 color='#FCFCFC'>Highest Score</h1>
                        <h1 id='highscore'>{userData.highscore}</h1>

                        <h1>Games Played</h1>
                        <h1 id='played'>{userData.played}</h1>
                    </div>
                    <div className='accountColoumn' style={{ display: 'inline-block', position: 'absolute', top: '15%', left: '30%' }}>
                        <div id='desc' style={{ marginBtoom: 10, wordWrap: 'break-word', maxWidth: '960px' }}>
                            {userData.description}
                        </div>
                        <div style={{ background: 'white', minWidth: '960px' }} className='dividerH' />
                        <h1>Achievements</h1>
                        {getAchievements()}
                    </div>
                </div>
            )
        else
            if (!wantDelete)     //edit menu
                return (
                    <div>
                        <div style={{ width: '1240px' }} className='accountColoumn'>
                            <h1>Edit Profile</h1>
                            <div style={{ background: 'white' }} className='dividerH' />
                            <h2>Username</h2>
                            <textarea id='usernameInput' defaultValue={userData.username} className='editDescBox' rows='1'></textarea>
                            <h2>Description</h2>
                            <textarea id='descInput' defaultValue={userData.description} className='editDescBox' rows='6'></textarea>
                        </div>
                    </div>
                )
            else        //confirm deletion
                return (
                    <div style={{ width: '1240px', textAlign: 'center', justifyContent: 'center', color: 'white' }}>
                        <h1>Are you sure you want to delete your account?</h1>
                        <div style={{ background: 'white' }} className='dividerH' />
                        <div style={{ padding: 10, display: 'flex', justifyContent: 'center' }}>
                            <Button type='ternary' label='Delete' size='large' onClick={doDelete}></Button>
                            <div style={{ margin: 50 }} />
                            <Button type='primary' label='Cancel' size='large' onClick={handleWantDelete}></Button>
                        </div>
                    </div>
                )
    }

    function top() {
        return (
            <div className='topbar'>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridGap: 0, justifyContent: 'center' }}>
                    <div>
                        <img src={WordeoLogo} alt='Wordeo' style={{ height: 64, cursor: 'pointer', marginLeft: 20 }} onClick={toHome} />
                    </div>
                    <div style={{ marginTop: 20, textAlign: 'center', fontSize: '24px' }}>
                        {user}'s Account Dashboard
                    </div>
                    <div>
                        {topButtons()}
                    </div>
                </div>
            </div>
        )
    }

    function topButtons() {
        if (!editing)
            return (
                <div style={{ marginLeft: 200, marginRight: 20, display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gridGap: 0, justifyContent: 'right' }}>
                    <button className='button-edit' onClick={handleEdit}>Edit</button>
                    <button className='button-out' onClick={handleLogout}>Logout</button>
                </div>
            )
        else
            return (
                <div style={{ marginLeft: 200, marginRight: 20, display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gridGap: 0, justifyContent: 'right' }}>
                    <button className='button-edit' onClick={handleEditApply}>Apply</button>
                    <button className='button-out' onClick={handleWantDelete}>Delete Account</button>
                </div>
            )
    }

    function getAchievements() {
        if (userData.achievements.length > 0)
            return (
                userData.achievements.map(({ title, desc }) => {
                    return (
                        <Achievement key={(title, desc)} name={title} description={desc} />
                    )
                })
            )
        else
            return (
                <h2 style={{ color: "white" }}>
                    No achievements yet.
                </h2>
            )
    }
}

export default AccountPage