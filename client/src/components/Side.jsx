import React from 'react'
import { NavLink } from 'react-router-dom'

function Side() {
    return (
        <nav id='sidebar' className='col-2' >
            <ul className='nav nav-tabs' id='nav-item'>
                <li className='nav-item'>
                    <NavLink className='nav-link' to='/'><i className="fa-solid fa-house"></i></NavLink>
                </li>
                <li className='nav-item'>
                    <NavLink className='nav-link' to='/search'><i className="fa-solid fa-magnifying-glass"></i></NavLink>
                </li>
                <li className='nav-item'>
                    <NavLink className='nav-link' to='/favorites'><i className="fa-solid fa-heart"></i></NavLink>
                </li>
            </ul>
        </nav>
    )
}

export default Side