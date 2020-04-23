import React from 'react';
import { logout } from '../../utils/authUtils';

const Logout = (props) => {
    const handleClick = (event) => {
        logout();
    };

    return (
        <button onClick={handleClick}>
            Logout
        </button>
    );
};

export default Logout;