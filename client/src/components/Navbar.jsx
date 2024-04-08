import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useGlobalContext } from '../Views/Layout';

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { logged } = useGlobalContext();

    useEffect(() => {
        const status = Cookies.get('authenticated');
        status ? setIsLoggedIn(true) : setIsLoggedIn(false);
    }, [logged]);

    return (
        <div className='row fixed-top' id='topbar-background'>
            <nav className='navbar fixed-top align-items' id='topbar'>
                <ul className='navbar-ul'>
                    {isLoggedIn ?
                        <>
                            <Link to='/'><img src='/logo.png' className='logo' /></Link>
                            <Link className='login-profile' to='/profile'>{Cookies.get("username")}</Link>
                        </>
                        :
                        <>
                            <Link to='/'><img src='/logo.png' className='logo' /></Link>
                            <Link className='login-profile' to='/login'>Log in/Sign up</Link>
                        </>
                    }
                </ul>
            </nav>
        </div>
    );
};
