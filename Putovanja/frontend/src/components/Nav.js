import React from 'react';
import { Link } from 'react-router-dom';
import useLocalStorage from 'use-local-storage';
import '../App.css';

const Nav = () => {
    const [theme, setTheme] = useLocalStorage('theme' ? 'dark' : 'light')
    return (
        <div className="navbar">
            <div className='naslov'>
                <h1>TRAVEL</h1>
            </div>          
        </div>
    )
}

export default Nav