import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useGlobalContext } from '../Views/Layout';
import { Link } from 'react-router-dom';

function Profile() {

    const [cookieUsername, setCookieUsername] = useState(Cookies.get('username'));
    const [user, setUser] = useState(null);
    const [edit, setEdit] = useState(null);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [mostListenedSong, setMostListenedSong] = useState("You haven't listened to any songs yet");
    const [mostListenedArtist, setMostListenedArtist] = useState("You haven't listened to any artists yet");
    const [history, setHistory] = useState([]);
    const [checkHistory, setCheckHistory] = useState(null);
    const [loggedIn, setLoggedIn] = useState(Cookies.get("authenticated"));
    const [historyDeleted, setHistoryDeleted] = useState(null);
    const { logged, setLogged } = useGlobalContext();

    //fetching user and set details
    useEffect(() => {
        if (loggedIn) {
            async function fetchData() {
                const response = await fetch(`http://localhost:3000/profile/${cookieUsername}`);
                const result = await response.json();
                setUser(result);
            };
            fetchData();
            setHistoryDeleted(null);
        };
    }, [cookieUsername, historyDeleted, loggedIn]);

    useEffect(() => {
        if (user) {
            setUsername(user.username);
            setEmail(user.email);
            setHistory(user.history);
        };
    }, [user]);

    useEffect(() => {
        mostListenedInfo();
    }, [historyDeleted]);

    //calculating info based on history
    async function mostListenedInfo() {
        const response = await fetch(`http://localhost:3000/history/${cookieUsername}`);
        const returnedUser = await response.json();

        const { artists, songs } = returnedUser.history;

        if (songs.length > 0) {
            setMostListenedSong(sortByListenCount(songs).val);
        } else if (songs.length === 0) {
            setMostListenedSong("You haven't listened to any songs yet");
        };

        if (artists.length > 0) {
            setMostListenedArtist(sortByListenCount(artists).val);
        } else if (artists.length === 0) {
            setMostListenedArtist("You haven't listened to any artists yet");
        };
    };

    function sortByListenCount(array) {
        const uniqueVals = [... new Set(array)];
        const numberArray = uniqueVals.map((val) => {
            let valCount = 0;
            for (let item of array) {
                if (item === val) {
                    valCount++;
                };
            };
            return { val: val, count: valCount };
        });
        numberArray.sort((item1, item2) => item2.count - item1.count);
        return numberArray[0];
    };

    //button event functions
    function editButton(e) {
        e.preventDefault();
        setEdit(true);
    };

    function cancelButton(e) {
        e.preventDefault();
        setEdit(null);
        setCheckHistory(null);
    };

    function logOutButton(e) {
        e.preventDefault();
        Cookies.remove('username');
        Cookies.remove('authenticated');
        setLoggedIn(false);
        setLogged(false);
    };

    function historyButton(e) {
        e.preventDefault();
        setCheckHistory(true);
    };

    async function deleteHistoryButton(e) {
        e.preventDefault();
        const response = await fetch(`http://localhost:3000/history/${cookieUsername}`, {
            method: "DELETE",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                "Accept": "application/json",
            },
        });
        const result = await response.json();
        if (result.msg === "history deleted") {
            setHistoryDeleted(true);
        };
        console.log(result.msg);
    };

    //handling submits
    async function handleEdit(e) {
        e.preventDefault();
        const updatedUser = {
            username: username,
            email: email,
            password: oldPassword,
            newPassword: newPassword,
        };
        const response = await fetch(`http://localhost:3000/profile/edit/${cookieUsername}`, {
            method: "POST",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                "Accept": "application/json",
            },
            body: JSON.stringify(updatedUser),
        });
        const result = await response.json();
        if (result.msg === "DONE") {
            Cookies.set('username', username, { expires: 1 });
            setCookieUsername(username);
            setEdit(null);
            setOldPassword("");
            setNewPassword("");
        } else {
            window.alert(result.msg);
        };
    };

    return (
        <section id='section' className='col profile'>
            {
                user && !edit && loggedIn && !checkHistory ? (
                    <>
                        <section className='row' id='profileDetails'>
                            <div className="col" id='details' >
                                <h3 className="row">User details</h3>
                                <div className="row" id="data-row"><div id="data-type">Username: </div><div id="data">{user.username}</div></div>
                                <div className="row" id="data-row"><div id="data-type">Email: </div><div id="data">{user.email}</div></div>
                                <div className="row" id="data-row"><div id="data-type">Your most listened song: </div><div id="data">{mostListenedSong}</div></div>
                                <div className="row" id="data-row"><div id="data-type">Your most listened artist: </div><div id="data">{mostListenedArtist}</div></div>

                                <div className='buttonContainer'>
                                    <button id='check-history' type='button' onClick={historyButton}>Check history</button>
                                    <button is='edit-user' type='button' onClick={editButton}>Edit user</button>
                                    <button id='log-out' type='button' onClick={logOutButton}>Log Out</button>
                                </div>
                            </div>
                        </section>
                    </>
                ) : user && edit && !checkHistory ? (
                    <section className='row' id='profileDetails'>
                        <form className="col" id='details' onSubmit={handleEdit}>
                            <h3 className="row">Edit user</h3>
                            <label className="row"><div id="data-type">Username: </div>
                                <input id="data" type='text' value={username} onChange={e => setUsername(e.target.value)}></input>
                            </label>
                            <label className="row"><div id="data-type">Email: </div>
                                <input id="data" type='email' value={email} onChange={e => setEmail(e.target.value)}></input>
                            </label>
                            <label className="row"><div id="data-type">Old password: </div>
                                <input id="data" type='password' onChange={e => setOldPassword(e.target.value)}></input>
                            </label>
                            <label className="row"><div id="data-type">New password: </div>
                                <input id="data" type='password' onChange={e => setNewPassword(e.target.value)}></input>
                            </label>
                            <button id='save-changes' type='submit'>Save changes</button>
                            <button id='cancel' type='button' onClick={cancelButton}>Cancel</button>
                        </form>

                    </section>
                ) : checkHistory ? (
                    <section className='history'>
                        {history.songs.map(song => <h4>{song}</h4>)}
                        <button id='delete-history-button' type='button' onClick={deleteHistoryButton}>Delete history</button>
                        <button id='cancel' type='button' onClick={cancelButton}>Cancel</button>
                    </section>
                )
                    : !loggedIn ? (
                        <>
                            <h3 id='not-logged-in'>
                                You are not logged in. Please log in or regist to the site.
                            </h3>
                            <Link to="/login"><button id='logged-in-button' >Log in/Sign up</button></Link>
                        </>
                    )
                        : (
                            <h3 className='profileDetails'>
                                Loading, please wait...
                            </h3>
                        )
            }
        </section>
    );
};

export default Profile;
