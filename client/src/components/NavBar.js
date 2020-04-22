import React from 'react';
import { Link } from 'react-router-dom';
import Logout from './Logout';

const NavBar = (props) => {
    return (
        <nav className="navbar">
            <Link to={'/'}>Home</Link>
            <Link to={'/notes'}>Notes</Link>
            <Link to={'/login'}>Login</Link>
            <Link to={'/signup'}>Sign up</Link>
            <Logout />
        </nav>
    );
};

export default NavBar;