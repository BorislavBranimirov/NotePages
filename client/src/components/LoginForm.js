import React, { useState, useEffect, useContext } from 'react';
import UserContext from '../../utils/userContext';
import styles from './Form.module.scss';

const LoginForm = (props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { loggedUser, setLoggedUser } = useContext(UserContext);

  useEffect(() => {
    // if user doesn't have an access token and was sent to login page
    // but user context still hasn't updated, update it
    if (loggedUser !== null && !localStorage.getItem('accessToken')) {
      setLoggedUser(null);
    }

    // if user is logged in, redirect to home page
    if (localStorage.getItem('accessToken')) {
      props.history.push('/');
    }
  }, [props.history, loggedUser, setLoggedUser]);

  const handleChange = (event) => {
    switch (event.target.name) {
      case 'username':
        setUsername(event.target.value);
        break;
      case 'password':
        setPassword(event.target.value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          username,
          password,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });

      const resJSON = await res.json();
      if (resJSON.err) {
        return setErrorMessage(resJSON.err);
      }

      // save the access token in local storage
      localStorage.setItem('accessToken', resJSON.accessToken);
      setLoggedUser(username);
      props.history.push('/');
    } catch (err) {
      setErrorMessage('Error occured while trying to log in');
    }
  };

  return (
    <div className={styles.formWrapper}>
      <h2 className={styles.formHeading}>Login</h2>
      {errorMessage && <div className={styles.error}>{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          name="username"
          pattern="[a-zA-Z0-9]{6,25}"
          title="Minimum of 6 characters, no spaces or special symbols"
          value={username}
          onChange={handleChange}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          name="password"
          pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,72}"
          title="Minimum of 8 characters, one lowercase letter, one uppercase letter and a digit"
          value={password}
          onChange={handleChange}
          required
        />
        <input type="submit" value="Login" />
      </form>
    </div>
  );
};

export default LoginForm;
