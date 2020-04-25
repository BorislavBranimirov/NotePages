import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Logout from './Logout';
import UserContext from '../../utils/userContext';

const NavBar = (props) => {
    const { loggedUser } = useContext(UserContext);

    return (
        <nav className="navbar">
            <div>
                <Link to={'/'} className="nav-item">Home</Link>
                {loggedUser && (
                    <Link to={'/notes'} className="nav-item">Notes</Link>
                )}
            </div>
            <div>
                {loggedUser ? (
                    <React.Fragment>
                        <span className="nav-item nav-username">{loggedUser}</span>
                        <Logout className="nav-item logout-btn" />
                    </React.Fragment>
                ) : (
                        <React.Fragment>
                            <Link to={'/login'} className="nav-item">Login</Link>
                            <Link to={'/signup'} className="nav-item">Sign up</Link>
                        </React.Fragment>
                    )}
            </div>

        </nav>
    );
};

export default NavBar;