//the page for signing in or signing up

import React from 'react';
import { useLayoutEffect, useState } from 'react';
import WordeoLogo from '../Images/WordeoLogo.png';
import '../Styles/SignIn.css';
import '../Styles/General.css'
import Button from '../Components/Button';

const SignInPage = () => {

    const [reply,setReply] = useState({})
    const APIPath = 'http://localhost:8080'

    useLayoutEffect(()=>{
        document.body.style.backgroundColor = "#FFF";
    })

    return (
        <div className='signin'>
            <div style={{justifyContent:'center',paddingBottom:'5%'}}>
                <img src={WordeoLogo} alt='Wordeo' onClick={() => {window.location = "/"}} style={{cursor:'pointer'}}/>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridGap: 40,justifyContent:'center' }}>
                <div>
                    <div style={{color:'#FFF'}} className='inputHolder'>
                        <h1>Sign Up</h1>
                        <p id='upWarning' style={{color:'white'}}></p>
                        <input id='upUser' type='text' placeholder='username' maxLength='16' className='inputField'></input>
                        <input id='upPass' type='password' placeholder='password' maxLength='16' className='inputField'></input>
                        <Button label="Create Account" onClick={validateSignUp} type="secondary" size="medium"/>
                    </div>
                </div>
                <div>
                    <h1 style={{textAlign:'center',color:'white',fontSize:'64px',marginTop:'128px'}} className='outlinetext'>OR</h1>
                </div>
                <div>
                <div style={{color:'#FFF'}} className='inputHolder'>
                        <h1>Sign In</h1>
                        <p id='inWarning' style={{color:'white'}}></p>
                        <input id='inUser' type='text' placeholder='username' maxLength='16' className='inputField'></input>
                        <input id='inPass' type='password' placeholder='password' maxLength='16' className='inputField'></input>
                        <Button label="Login" onClick={validateSignIn} type="secondary" size="medium"/>
                    </div>
                </div>
            </div>
            <div className='signinFooter'>
                Creating an account saves your progress and allows you to earn achievements!
            </div>

        </div>
    )

    async function callAPIRegister(name,pass)
    {
        const reqJson = 
        {
            userName: name,
            password: pass
        }

        const res = await fetch(APIPath+'/api/register/', {
            method: 'POST',
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(reqJson)
        });
        const data = await res.json()

        if(data.message)
            setReply(data.message)
        else
            setReply("An error occured")
    }

    async function callAPILogin(name,pass)
    {
        const reqJson = 
        {
            userName: name,
            password: pass
        }

        const res = await fetch(APIPath+'/api/login/', {
            method: 'POST',
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(reqJson)
        });
        const data = await res.json()

        if(data.message)
            setReply(data.message)
        else
            {
                setReply("An error occured")
                console.log('error')
            }
    }

    function validateSignUp()
    {
        const name = document.getElementById('upUser').value;
        const password = document.getElementById('upPass').value;
        const warning = document.getElementById('upWarning');

        const error = frontEndChecks(name,password,warning);

        if(!error)
        {
            if(!(process.env.JEST_WORKER_ID === undefined || process.env.NODE_ENV !== 'test'))
            {
                //backend calls are skipped in test mode
                document.cookie = "user="+name+";domain=;path=/";
                window.location = '/account/'+name;
            }
            else
            {
                //backend calls go here
                setReply('not changed')
                callAPIRegister(name,password)
                if(reply==='not changed'||reply==='An error occured')
                {
                    warning.innerHTML='A server error occured.'
                }
                else
                {
                    //if validated or in test mode add cookie
                    if(reply==='User already exists!')
                    {
                        console.log(reply)
                        warning.innerHTML='That username is already taken.'
                    }
                    else if(reply==='User Added Successfully!')
                    {
                        //enter account
                        console.log(reply)
                        document.cookie = "user="+name+";domain=;path=/";
                        window.location = '/account/'+name;
                    }
                    else{
                        console.log(reply)
                        warning.innerHTML='The server gave an unexpected reply.'
                    }
                }
            }
        }
    }

    function validateSignIn()
    {
        const name = document.getElementById('inUser').value.trim();
        const password = document.getElementById('inPass').value.trim();
        const warning = document.getElementById('inWarning');

        const error = frontEndChecks(name,password,warning);

        if(!error)
        {
            //backend calls go here
            setReply('not changed')
            callAPILogin(name,password)
            console.log(reply)
            if(reply==='not changed'||reply==='An error occured')
            {
                warning.innerHTML='A server error occured.'
            }
            else
            {
                //if validated or in test mode add cookie
                if(reply==='Password does not match!')
                {
                    console.log(reply)
                    warning.innerHTML='That username is already taken.'
                }
                else if(reply==='Login successful!')
                {
                    //login and go to homepage
                    console.log(reply)
                    document.cookie = "user="+name+";domain=;path=/";
                    window.location = '/';
                }
                else if(reply==='No such user found!')
                {
                    warning.innerHTML='User does not exist.'
                }
                else{
                    console.log(reply)
                    warning.innerHTML='The server gave an unexpected reply.'
                }
            }
        }
    }

    //checks input before sending to backend
    function frontEndChecks(name,password,warning)
    {
        var error = false;

        if(name.length<1)
        {
            error=true;    
            warning.innerHTML='Username required.';
        }
        else if (password.length<1)
        {
            error=true;
            warning.innerHTML='Password required.';
        }

        if(name.toLowerCase()==='signin')
        {
            error=true;
            warning.innerHTML='Invalid Username.';
        }

        return error;
    }
}

export default SignInPage