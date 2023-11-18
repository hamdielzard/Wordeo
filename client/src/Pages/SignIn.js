import { useState } from 'react';
import '../Styles/SignIn.css';
import WordeoLogo from '../Images/WordeoLogo.png';

/**
 * **This sign in/up page allows users to sign in or sign up to Wordeo.**
 * 
 * Upon logging in or registering, a cookie for userName and displayName is set.
 * 
 * *Backend*: `V2`
 * @returns React page for signing in or signing up
 */

function SignInPage() {
    const [reply, setReply] = useState('');

    async function callAPIRegister(name, pass) {
        const reqJson = {
            userName: name,
            password: pass,
        };

        const res = await fetch('http://localhost:8080/api/register/', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify(reqJson),
        });
        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message);
        }

        return data;
    }

    async function callAPILogin(name, pass) {
        const reqJson = {
            userName: name,
            password: pass,
        };

        const res = await fetch('http://localhost:8080/api/login/', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify(reqJson),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message);
        }

        return data;
    }

    async function handleSignUp(name, password) {
        if (!name) {
            setReply("Username required.");
            return;
        }

        if (!password) {
            setReply("Password required.")
            return;
        }

        let data;

        try {
            data = await callAPIRegister(name, password);

            if (data.message) {
                const userName = data.userName;
                const displayName = data.displayName;

                if (data.message === 'User registered successfully!') {
                    document.cookie = `userName=${userName}; domain=; path=/`;
                    document.cookie = `displayName=${displayName || userName}; domain=; path=/`;
                    window.location.pathname = '/';
                }
                else {
                    console.log(data.message)
                    setReply(data.message);
                }

            } else {
                console.log(data.message)
                setReply('An error occurred');
            }
        } catch (err) {
            console.log(err.message);
            setReply(err.message);
        }

        return data;
    }

    async function handleSignIn(name, password) {
        if (!name) {
            setReply("Username required.");
            return;
        }

        if (!password) {
            setReply("Password required.")
            return;
        }

        let data;

        try {
            data = await callAPILogin(name, password);

            if (data.message) {
                const userName = data.userName;
                const displayName = data.displayName;

                if (data.status === 404) {
                    console.log(data.message)
                    setReply(data.message);
                } else if (data.status === '') {

                }
                else {
                    document.cookie = `userName=${userName}; domain=; path=/`;
                    document.cookie = `displayName=${displayName || userName}; domain=; path=/`;
                    window.location.pathname = '/';
                }
            } else {
                console.log(data.message)
                setReply('An error occurred.');

            }
        } catch (err) {
            console.log(err.message);
            setReply(err.message);
        }

        return data;
    }

    async function handleSubmit(event) {
        event.preventDefault();

        const name = event.target.elements.username.value.trim();
        const password = event.target.elements.password.value.trim();

        if (event.target.name === 'signup') {
            await handleSignUp(name, password);
        } else if (event.target.name === 'signin') {
            await handleSignIn(name, password);
        }
    }

    return (
        <div className="signInMain">
            <img src={WordeoLogo} alt='Wordeo Logo' onClick={() => { window.location.pathname = '/' }} style={{ cursor: 'pointer' }} />
            <div className="signinContainer">
                <div className="signBox">
                    <form onSubmit={handleSubmit} name="signin">
                        <div className="inputHolder">
                            <h1 className='signHeader'>Sign In</h1>
                            <input className="inputField" type="text" id="signInUser" name="username" placeholder='Username' />
                            <input className="inputField" type="password" id="signInPass" name="password" placeholder='Password' />
                            <button className="button-secondary" style={{fontSize:32}} type="submit">Sign In</button>
                        </div>
                    </form>
                </div>
                <h2 className="ORText">OR</h2>
                <div className="signBox">
                    <form onSubmit={handleSubmit} name="signup">
                        <div className="inputHolder">
                            <h1 className='signHeader'>Sign Up</h1>
                            <input className="inputField" type="text" id="username" name="username" placeholder='Username' />
                            <input className="inputField" type="password" id="signUpPass" name="password" placeholder='Password' />
                            <button className="button-secondary" style={{fontSize:32}} type="submit">Sign Up</button>


                        </div>
                    </form>
                </div>
            </div>
            {reply && <p className="warningFooter">{reply}</p>}
            <div className='signinFooter'>
                Creating an account saves your progress and allows you to earn achievements!
            </div>
        </div>
    );
}

export default SignInPage;