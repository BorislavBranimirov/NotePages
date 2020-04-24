import React from 'react';
import { useHistory } from "react-router-dom";
import { logout } from '../../utils/authUtils';

const Logout = (props) => {
    let history = useHistory();

    const handleClick = (event) => {
        logout();
        return history.push('/');
    };

    return (
        <button onClick={handleClick}>
            Logout
        </button>
    );
};

export default Logout;