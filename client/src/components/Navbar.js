import React, {useContext} from "react";
import {NavLink, useHistory} from 'react-router-dom'
import {AuthContext} from '../context/AuthContext'

export const Navbar = () => {
    const auth = useContext(AuthContext)
    const history = useHistory()

    const logoutHandler = event => {
       event.preventDefault()
       auth.logout()
       history.push('/')
    }
    return (
        <nav>
            <div class="nav-wrapper blue-grey darken-3" 
                    style={{
                        padding: '0 10%'
                    }}>
                <a 
                    href="/" 
                    class="brand-logo"
                    >
                        Redis PRIVATE CHAT
                    </a>
                <ul id="nav-mobile" class="right hide-on-med-and-down">
                    <li><a href="/" onClick={logoutHandler}>Выйти</a></li>
                </ul>
            </div>
        </nav>

    )
}