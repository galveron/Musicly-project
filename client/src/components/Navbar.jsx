import { useState, useEffect } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import Cookies from 'js-cookie'

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        const status = Cookies.get('authenticated')
        status ? setIsLoggedIn(true) : setIsLoggedIn(false)
    }, [])
    return (
        <div className='col-12' id='outer-box'>
            <div className='row fixed-top' id="topbar-background">
                <nav className='navbar fixed-top align-items' id='topbar'>
                    <ul className='navbar-ul'>
                        {isLoggedIn ?
                            <>
                                <Link to='/'><img src='/logo.png' className='logo' /></Link>
                                <Link className='login-profile' to='/profile'>Profile</Link>
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
            <div className='row' id='main'>
                <nav id='sidebar' className='col-2' >
                    <lu className='nav nav-tabs' id='nav-item'>
                        <li className='nav-item'>
                            <NavLink className='nav-link' to='/'><i class="fa-solid fa-house"></i></NavLink>
                        </li>
                        <li className='nav-item'>
                            <NavLink className='nav-link' to='/search'><i class="fa-solid fa-magnifying-glass"></i></NavLink>
                        </li>
                        <li className='nav-item'>
                            <NavLink className='nav-link' to='/favorites'><i class="fa-solid fa-heart"></i></NavLink>
                        </li>
                    </lu>
                </nav>
                <Outlet />
            </div>
        </div>
    )
}
