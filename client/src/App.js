import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Link, Switch } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './components/Home';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import NotesPage from './components/NotesPage';
import NotePage from './components/NotePage';
import CreateNotePage from './components/CreateNotePage';
import EditNotePage from './components/EditNotePage';
import NotFound from './components/NotFound';

import './style.css';

import UserContext from '../utils/userContext';

const App = () => {
    const [loggedUser, setLoggedUser] = useState(null);

    useEffect(()=>{
        const token = localStorage.getItem('accessToken');
        if(token) {
            const username = JSON.parse(window.atob(token.split('.')[1])).username;
            setLoggedUser(username);
        }
    }, []);

    return (
        <UserContext.Provider value={{ loggedUser, setLoggedUser }}>
            <BrowserRouter>
                <div>
                    <NavBar />
                    <Switch>
                        <Route exact path='/' component={Home} />
                        <Route exact path='/notes' component={NotesPage} />
                        <Route exact path='/notes/:id' component={NotePage} />
                        <Route exact path='/notes/:id/edit' component={EditNotePage} />
                        <Route exact path='/create-note' component={CreateNotePage} />
                        <Route exact path='/login' component={LoginForm} />
                        <Route exact path='/signup' component={SignUpForm} />
                        <Route component={NotFound} />
                    </Switch>
                </div>
            </BrowserRouter>
        </UserContext.Provider>
    );
}

export default App;