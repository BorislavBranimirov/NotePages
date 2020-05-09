import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Logout from './Logout';
import UserContext from '../../utils/userContext';
import styles from './Navbar.module.scss';

const NavBar = (props) => {
    const { loggedUser } = useContext(UserContext);

    return (
        <nav className={styles.navbar}>
            <div>
                <Link to={'/'} className={styles.navItem}>Home</Link>
                {loggedUser && (
                    <Link to={'/notes'} className={styles.navItem}>Notes</Link>
                )}
            </div>
            <div>
                {loggedUser ? (
                    <React.Fragment>
                        <span className={`${styles.navItem} ${styles.navUsername}`}>{loggedUser}</span>
                        <Logout className={`${styles.navItem} ${styles.logoutBtn}`} />
                    </React.Fragment>
                ) : (
                        <React.Fragment>
                            <Link to={'/login'} className={styles.navItem}>Login</Link>
                            <Link to={'/signup'} className={styles.navItem}>Sign up</Link>
                        </React.Fragment>
                    )}
            </div>
        </nav>
    );
};

export default NavBar;