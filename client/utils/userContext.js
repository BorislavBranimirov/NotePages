import React from 'react';

export const UserContext = React.createContext({
    loggedUser: null,
    setLoggedUser: ()=>{}
});

export default UserContext;