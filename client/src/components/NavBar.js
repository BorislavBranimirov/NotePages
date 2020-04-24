import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Logout from './Logout';
import UserContext from '../../utils/userContext';

const NavBar = (props) => {
    const { loggedUser } = useContext(UserContext);

    return (
        <nav className="navbar">
            <Link to={'/'}>Home</Link>
            {loggedUser ? (
                <React.Fragment>
                    <Link to={'/notes'}>Notes</Link>
                    <span>{loggedUser}</span>
                    <Logout />
                </React.Fragment>
            ) : (
                    <React.Fragment>
                        <Link to={'/login'}>Login</Link>
                        <Link to={'/signup'}>Sign up</Link>
                    </React.Fragment>
                )}
        </nav>
    );
};

export default NavBar;