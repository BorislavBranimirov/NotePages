import React, { useState } from 'react';

const LoginForm = (props) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (event) => {
        switch (event.target.name) {
            case 'username':
                setUsername(event.target.value);
                break;
            case 'password':
                setPassword(event.target.value);
                break;
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const res = await fetch('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({
                username,
                password
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        });

        const resJSON = await res.json();
        // check if an error was returned
        if (resJSON.err) {
            return setErrorMessage(resJSON.err);
        }

        //? remove log after configuring refresh token properly
        console.log(resJSON);
        localStorage.setItem('accessToken', resJSON.accessToken);
    };

    return (
        <div className="login-form">
            <div className="error">{errorMessage}</div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username:</label>
                <input type="text" name="username" value={username} onChange={handleChange} />
                <label htmlFor="password">Password:</label>
                <input type="password" name="password" value={password} onChange={handleChange} />
                <input type="submit" value="Submit" />
            </form>
        </div>
    );
};

export default LoginForm;