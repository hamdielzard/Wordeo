//the page for signing in or signing up

import React from 'react';
import WordeoLogo from '../Images/WordeoLogo.png';
import '../Styles/SignIn.css';
import '../Styles/General.css'
import Button from '../Components/Button';

const SignInPage = () => {

    function validateSignUp()
    {
        const name = document.getElementById('upUser').value;
        const password = document.getElementById('upPass').value;
        const warning = document.getElementById('upWarning');

        frontEndChecks(name,password,warning);

        //backend calls go here
        //if successful give cookie and go to account page
        //otherwise update warning message
    }

    function validateSignIn()
    {
        const name = document.getElementById('inUser').value;
        const password = document.getElementById('inPass').value;
        const warning = document.getElementById('inWarning');

        frontEndChecks(name,password,warning);

        //backend calls go here
        //if successful give cookie and go to main menu
        //otherwise update warning message
    }

    //checks input before sending to backend
    function frontEndChecks(name,password,warning)
    {
        if(name.length<1)
            warning.innerHTML='Username required.';
        else if (password.length<1)
            warning.innerHTML='Password required.';
    }

    return (
        <div className='signin'>
            <div style={{justifyContent:'center',paddingBottom:'5%'}}>
                <img src={WordeoLogo} alt='Wordeo'/>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridGap: 40,justifyContent:'center' }}>
                <div>
                    <div style={{color:'#FFF'}} className='inputHolder'>
                        <h1>Sign Up</h1>
                        <p id='upWarning' style={{color:'white'}}></p>
                        <input id='upUser' type='text' placeholder='username' maxLength='16' className='inputField'></input>
                        <input id='upPass' type='text' placeholder='password' maxLength='16' className='inputField'></input>
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
                        <input id='inPass' type='text' placeholder='password' maxLength='16' className='inputField'></input>
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