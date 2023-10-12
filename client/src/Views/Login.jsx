import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { useGlobalContext } from '../Views/Layout';

function Login() {

    const [loginState, setLoginState] = useState(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [registered, setRegistered] = useState(null);
    const { logged, setLogged } = useGlobalContext();
    //changing states when buttons clicked
    function logInButton(e) {
        e.preventDefault();
        setLoginState("logIn");
    };

    function registerButton(e) {
        e.preventDefault();
        setLoginState("Register");
    };

    function backButton(e) {
        e.preventDefault();
        setLoginState(null);
        setRegistered(null);
    };

    //handling form submits
    async function handleRegister(e) {
        e.preventDefault();
        const newUser = {
            username: username,
            password: password,
            email: email,
        };
        const response = await fetch('http://localhost:3000/register', {
            method: "POST",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                "Accept": "application/json",
            },
            body: JSON.stringify(newUser),
        });
        const result = await response.json();
        setRegistered(result.msg);
        setUsername("");
        setEmail("");
        setPassword("");
    };

    async function handleLogIn(e) {
        e.preventDefault();
        const logInDetails = {
            username: username,
            password: password,
        };
        const response = await fetch('http://localhost:3000/login', {
            method: "POST",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                "Accept": "application/json",
            },
            body: JSON.stringify(logInDetails),
        });
        const data = await response.json();
        if (data.msg) {
            window.alert(data.msg);
        }
        if (data.status === 'OK') {
            setLoginState("loggedIn");
            Cookies.set('username', data.user.username, { expires: 1 });
            Cookies.set('authenticated', true, { expires: 1 });
            setLogged(true);
        };
    };

    return (
        <>
            <section id='section' className='col'>
                <article className='login'>
                    {loginState === "Register" && !registered ? (
                        <section>
                            <form id='register-form' onSubmit={handleRegister}>
                                <label class='line'><h5>Username:</h5>
                                    <input type='string' onChange={e => setUsername(e.target.value)}></input>
                                </label><br />
                                <label class='line'><h5>Password:</h5>
                                    <input type='password' onChange={e => setPassword(e.target.value)}></input>
                                </label><br />
                                <label class='line'><h5>Email:</h5>
                                    <input type='email' value={email} onChange={e => setEmail(e.target.value)}></input>
                                </label><br />
                                <button id='reg-button' type='submit'>Registration</button>
                                <button onClick={backButton}>Back</button>
                            </form>
                        </section>
                    ) : loginState === "Register" && registered ? (
                        <section>
                            <h4 id='success'>{registered}</h4>
                            <button id='back-button' onClick={backButton}>Back</button>
                        </section>
                    )
                        : loginState === "logIn" ? (
                            <section>
                                <form onSubmit={handleLogIn}>
                                    <label>Username:
                                        <input id='username-input' type='string' value={username} onChange={e => setUsername(e.target.value)}></input>
                                    </label>
                                    <label>Password:
                                        <input id='password-input' type='password' value={password} onChange={e => setPassword(e.target.value)}></input>
                                    </label>
                                    <button id='log-in' type='submit' >Log In</button>
                                    <button id='back' onClick={backButton}>Back</button>
                                </form>

                            </section>
                        )
                            : loginState === "loggedIn" ? (
                                <section>
                                    <h4>Logged In successfully!</h4>
                                </section>
                            )
                                : (
                                    <section>
                                        <h4 id='text' >Welcome!</h4>
                                        <p id='text'>Please Log In or Register to the website</p>
                                        <button id='log-in' onClick={logInButton}>Log In</button>
                                        <button id='register' onClick={registerButton}>Register</button>
                                    </section>)
                    }
                </article>
            </section>
        </>
    );
};

export default Login;
