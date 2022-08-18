import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { logout } from '../../utils/authUtils';
import UserContext from '../../utils/userContext';

const Logout = (props) => {
  let history = useHistory();
  const { setLoggedUser } = useContext(UserContext);

  const handleClick = async () => {
    await logout();
    setLoggedUser(null);
    return history.push('/');
  };

  return (
    <button onClick={handleClick} className={props.className}>
      Log out
    </button>
  );
};

export default Logout;
