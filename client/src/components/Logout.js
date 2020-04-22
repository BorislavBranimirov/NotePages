import React from 'react';

const Logout = (props) => {
    const handleClick = (event) => {
        localStorage.removeItem('accessToken');
        fetch('/api/auth/logout', {
            method: 'POST'
        });
    };

    return (
        <button onClick={handleClick}>
            Logout
        </button>
    );
};

export default Logout;