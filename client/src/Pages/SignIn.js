//the page for signing in or signing up

import React from 'react';
import { useLayoutEffect } from 'react';
import WordeoLogo from '../Images/WordeoLogo.png';
import '../Styles/SignIn.css';
import '../Styles/General.css'
import Button from '../Components/Button';

const SignInPage = () => {

    useLayoutEffect(()=>{
        document.body.style.backgroundColor = "#FFF";
    })

    function validateSignUp()
    {
        const name = document.getElementById('upUser').value;
        const password = document.getElementById('upPass').value;
        const warning = document.getElementById('upWarning');

        const error = frontEndChecks(name,password,warning);

        if(!error)
        {
            //backend calls go here

            //if validated add cookie
            document.cookie = "user="+name+";domain=;path=/";
            window.location = '/account/'+name;
            //otherwise update warning message
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

            //if validated add cookie
            document.cookie = "user="+name+";domain=;path=/";
            window.location = '/';
            //otherwise update warning message
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
}

export default SignInPage