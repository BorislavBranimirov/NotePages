import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';

const SignUpForm = (props) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (event) => {
        switch (event.target.name) {
            case 'username':
                setUsername(event.target.value);
                break;
            case 'password':
                setPassword(event.target.value);
                break;
            case 'confirmPassword':
                setConfirmPassword(event.target.value);
                break;
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if(password!==confirmPassword) {
            return setErrorMessage('Passwords must be the same');
        }

        const res = await fetch('/api/users', {
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

        props.history.push('/login');
    };

    return (
        <div className="sign-up-form">
            <div className="error">{errorMessage}</div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    name="username"
                    pattern="[a-zA-Z0-9]{6,25}"
                    title="Minimum of 6 characters, no spaces or special symbols"
                    value={username}
                    onChange={handleChange}
                    required
                />
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    name="password"
                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,72}"
                    title="Minimum of 8 characters, one lowercase letter, one uppercase letter and a digit"
                    value={password}
                    onChange={handleChange}
                    required
                />
                <label htmlFor="confirmPassword">Confirm password:</label>
                <input
                    type="password"
                    name="confirmPassword"
                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,72}"
                    title="Minimum of 8 characters, one lowercase letter, one uppercase letter and a digit"
                    value={confirmPassword}
                    onChange={handleChange}
                    required
                />
                <input type="submit" value="Submit" />
            </form>
        </div>
    );
};

export default SignUpForm;