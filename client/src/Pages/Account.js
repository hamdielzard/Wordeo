//account page for a logged in user

//currently any name can be given via localhost:300/account/username-go-here
//but later will reroute to sign in page if no login cookie (which is got after sign in confirms valid user with backend)

import React from 'react'
import { useState,useLayoutEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom'
//styles
import '../Styles/Account.css'
import '../Styles/General.css'
//resources
import WordeoLogo from '../Images/WordeoLogo.png';
import Achievement from '../Components/Achievement';
import Button from '../Components/Button';

const AccountPage = () =>
{
    const {user}=useParams();

    const [canLogin,setCanLogin] = useState(true);
    const [editing,setEditing] = useState(false);
    const [wantDelete,setDelete] = useState(false);
    var highscore = 0;
    var played = 0;
    var [description,setDescription] = useState('');

    useLayoutEffect(()=>{
        document.body.style.backgroundColor = "#393939";
    })

    //backend call to get account information (if has cookie, otherwise reroute to signin)
    function checkLogin()
    {
        //canLogin to be set by cookie here

        if(canLogin)
            //logged in, so get auth from backend then give to page function
            return page()
        else
            //if not logged in auto-redirect to sign in
            return <Navigate to='/account/signin'/>
    }

    function handleEdit()
    {
        setEditing(!editing);
    }

    function handleEditApply()
    {
        //would send updates to backend here
        try
        {
            let desc = document.getElementById('descInput').value;
            setDescription(desc)

            setEditing(!editing);
        }
        catch (error) 
        {
            alert('There was a problem applying the changes.' + error)
        }
    }

    function handleLogout()
    {
        //remove login cookie here
        toHome();
    }

    function handleWantDelete()
    {
        //user wants to delete account
        setDelete(!wantDelete)
    }

    function doDelete()
    {
        //backend deletion go here
        //also remove cookie
        toHome();
    }

    function toHome()
    {
        //returns to home menu
        window.location = '/';
    }

    function page()
    {
        if(!wantDelete)
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

    function editMode()
    {
        if(!editing)    //normal account display
            return (
                <div>
                    <div className='accountColoumn' style={{display:'inline-block',position:'absolute',top:'35%',left:'0%',right:'30%'}}>
                        <h1 color='#FCFCFC'>Highest Score</h1>
                        <h1 id='highscore'>{highscore}</h1>

                        <h1>Games Played</h1>
                        <h1 id='played'>{played}</h1>
                    </div>
                    <div className='accountColoumn' style={{display:'inline-block', position:'absolute',top:'15%',left:'30%'}}>
                        <div id='desc' style={{marginBtoom:10,wordWrap:'break-word',maxWidth:'960px'}}>
                            {description}
                        </div>
                        <div style={{background:'white',minWidth:'960px'}} className='dividerH'/>
                        <h1>Achievements</h1>
                        {getAchievements()}
                    </div>
                </div>
            )
        else
            if(!wantDelete)     //edit menu
            return(
                <div>
                    <div style={{width:'1240px'}}className='accountColoumn'>
                        <h1>Edit Profile</h1>
                        <div style={{background:'white'}} className='dividerH'/>
                        <h2>Description</h2>
                        <textarea id='descInput' defaultValue={description} className='editDescBox' rows='6'></textarea>
                    </div>
                </div>
            )
            else        //confirm deletion
            return (
                    <div style={{width:'1240px',textAlign:'center',justifyContent:'center',color:'white'}}>
                        <h1>Are you sure you want to delete your account?</h1>
                        <div style={{background:'white'}} className='dividerH'/>
                        <div style={{padding:10,display:'flex',justifyContent:'center'}}>
                            <Button type='ternary' label='Delete' size='large' onClick={doDelete}></Button>
                            <div style={{margin:50}}/>
                            <Button type='primary' label='Cancel' size='large' onClick={handleWantDelete}></Button>
                        </div>
                    </div>
            )
    }

    function top()
    {
        return (
            <div className='topbar'>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridGap: 0,justifyContent:'center' }}>
                        <div>
                            <img src={WordeoLogo} alt='Wordeo' style={{height:64,cursor:'pointer',marginLeft:20}} onClick={toHome}/>
                        </div>
                        <div style={{marginTop:20,textAlign:'center'}}>
                            {user}'s Account Dashboard
                        </div>
                        <div>
                            {topButtons()}
                        </div>
                    </div>
                </div>
        )
    }

    function topButtons()
    {
        if(!editing)
            return(
                <div style={{ marginLeft:200,marginRight:20,display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gridGap: 0,justifyContent:'right' }}>
                    <button className='button-edit' onClick={handleEdit}>Edit</button>
                    <button className='button-out' onClick={handleLogout}>Logout</button>
                </div>
            )
        else
            return(
                <div style={{ marginLeft:200,marginRight:20,display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gridGap: 0,justifyContent:'right' }}>
                    <button className='button-edit' onClick={handleEditApply}>Apply</button>
                    <button className='button-out' onClick={handleWantDelete}>Delete Account</button>
                </div>
            )
    }

    function getAchievements()
    {
        //get the elements from the account

        //stub return
        return(
            <div style={{maxWidth:'10px'}}>
                <Achievement name='Test' description='the description goes here and shows up under the title'/>
                <Achievement name='Next is example' description='descriptions for achievements are short and describe how it was got'/>
                <Achievement name='Down to the Wire' description='Solve a puzzle with 3 or fewer seconds left.'/>
            </div>
        )
    }

    return(
        <div>
            {checkLogin()}
        </div>
    )
}

export default AccountPage