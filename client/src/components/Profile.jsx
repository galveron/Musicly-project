import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import AudioPlayer from './AudioPlayer';

function Profile() {

    const [cookieUsername, setCookieUsername] = useState(Cookies.get('username'))
    const [user, setUser] = useState(null)
    const [edit, setEdit] = useState(null)
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [mostListenedSong, setMostListenedSong] = useState("You haven't listened to any songs yet")
    const [mostListenedArtist, setMostListenedArtist] = useState("You haven't listened to any artists yet")
    const [history, setHistory] = useState([])
    const [checkHistory, setCheckHistory] = useState(null)
    const [loggedIn, setLoggedIn] = useState(Cookies.get("authenticated"))
    const [historyDeleted, setHistoryDeleted] = useState(null)

    //fetching user and set details
    useEffect(() => {
        async function fetchData() {
            const response = await fetch(`http://localhost:3000/profile/${cookieUsername}`)
            const result = await response.json()
            setUser(result)
        }
        fetchData()
        setHistoryDeleted(null)
    }, [cookieUsername, historyDeleted])

    useEffect(() => {
        if (user) {
            setUsername(user.username)
            setEmail(user.email)
            setHistory(user.history)
        }
    }, [user])

    useEffect(() => {
        mostListenedInfo();
    }, [historyDeleted])

    //calculating info based on history
    async function mostListenedInfo() {
        const response = await fetch(`http://localhost:3000/history/${cookieUsername}`);
        const returnedUser = await response.json();

        const { albums, artists, songs } = returnedUser.history;

        if (songs.length > 0) {
            setMostListenedSong(sortByListenCount(songs).val);
        } else if (songs.length === 0) {
            setMostListenedSong("You haven't listened to any songs yet")
        }

        if (artists.length > 0) {
            setMostListenedArtist(sortByListenCount(artists).val);
        } else if (artists.length === 0) {
            setMostListenedArtist("You haven't listened to any artists yet")
        }
    }

    function sortByListenCount(array) {
        const uniqueVals = [... new Set(array)];
        const numberArray = uniqueVals.map((val) => {
            let valCount = 0;
            for (let item of array) {
                if (item === val) {
                    valCount++;
                }
            }
            return { val: val, count: valCount };
        })
        numberArray.sort((item1, item2) => item2.count - item1.count);
        return numberArray[0];
    }

    //button event functions
    function editButton(e) {
        e.preventDefault();
        setEdit(true)
    }

    function cancelButton(e) {
        e.preventDefault();
        setEdit(null)
        setCheckHistory(null)
    }

    function logOutButton(e) {
        e.preventDefault();
        Cookies.remove('username')
        Cookies.remove('authenticated')
        setLoggedIn(false)
    }

    function historyButton(e) {
        e.preventDefault();
        setCheckHistory(true)
    }

    async function deleteHistoryButton(e) {
        e.preventDefault();
        const response = await fetch(`http://localhost:3000/history/${cookieUsername}`, {
            method: "DELETE",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                "Accept": "application/json"
            }
        })
        const result = await response.json()
        if (result.msg === "history deleted") {
            setHistoryDeleted(true)
        }
        console.log(result.msg);
    }

    //handling submits
    async function handleEdit(e) {
        e.preventDefault();
        const response = await fetch(`http://localhost:3000/profile/edit/${cookieUsername}`, {
            method: "POST",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                "Accept": "application/json"
            },
            body: JSON.stringify({ password: oldPassword })
        })
        const check = await response.json()
        if (check.msg === "matched") {
            const updatedUser = {
                username: username,
                email: email,
                password: newPassword ? newPassword : oldPassword
            }
            const update = await fetch(`http://localhost:3000/profile/edit/${cookieUsername}`, {
                method: "PATCH",
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    "Accept": "application/json"
                },
                body: JSON.stringify(updatedUser)
            })
            const result = await update.json()
            console.log(result);
            Cookies.set('username', username, { expires: 1 })
            setCookieUsername(username)
            setEdit(null)
            setOldPassword("")
            setNewPassword("")
        } else {
            window.alert(check.msg);
        }
    }
    function reloadFunction() {
        window.location.reload(false)
        window.location.replace('http://localhost:5173/login')
    }

    return (
        <>
            <section id='section' className='col profile'>
                {
                    user && !edit && loggedIn && !checkHistory ? (
                        <>
                            <section className='profileDetails'>
                                <div id='details' >
                                    <h3>User details</h3>
                                    <div>Username: {user.username}</div>
                                    <div>Email: {user.email}</div>
                                    <div>Your most listened song: {mostListenedSong}</div>
                                    <div>Your most listened artist: {mostListenedArtist}</div>
                                    {/* <div>Your most listened album: {mostListenedAlbum}</div> */}
                                </div>
                                <div className='buttonContainer'>
                                    <button id='check-history' type='button' onClick={historyButton}>Check history</button>
                                    <button is='edit-user' type='button' onClick={editButton}>Edit user</button>
                                    <button id='log-out' type='button' onClick={logOutButton}>Log Out</button>
                                </div>
                            </section>
                        </>
                    ) : user && edit && !checkHistory ? (
                        <section className='profileDetails'>
                            <form onSubmit={handleEdit}>
                                <label><h5>Username: </h5>
                                    <input type='text' value={username} onChange={e => setUsername(e.target.value)}></input>
                                </label><br />
                                <label><h5>Email: </h5>
                                    <input type='email' value={email} onChange={e => setEmail(e.target.value)}></input>
                                </label><br />
                                <label><h5>Old password: </h5>
                                    <input type='password' onChange={e => setOldPassword(e.target.value)}></input>
                                </label><br />
                                <label><h5>New password: </h5>
                                    <input type='password' onChange={e => setNewPassword(e.target.value)}></input>
                                </label><br />
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
                                <button id='logged-in-button' onClick={reloadFunction}>Log in/Sign up</button>
                            </>
                        )
                            : (
                                <h3 className='profileDetails'>
                                    Loading, please wait...
                                </h3>
                            )
                }
            </section>
            <section id="audioplayer" className='row'>
                <AudioPlayer />
            </section>
        </>
    )

}

export default Profile
