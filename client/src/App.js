import React, { useEffect, useState, Suspense } from 'react';
import { BrowserRouter, Route, Link, Switch } from 'react-router-dom';
import NavBar from './components/NavBar';
const Home = React.lazy(() => import(/*webpackChunkName: 'home'*/ './components/Home'));
const LoginForm = React.lazy(() => import(/*webpackChunkName: 'loginform'*/ './components/LoginForm'));
const SignUpForm = React.lazy(() => import(/*webpackChunkName: 'signupform'*/ './components/SignUpForm'));
const NotesPage = React.lazy(() => import(/*webpackChunkName: 'notespage'*/ './components/NotesPage'));
const NotePage = React.lazy(() => import(/*webpackChunkName: 'notepage'*/ './components/NotePage'));
const CreateNotePage = React.lazy(() => import(/*webpackChunkName: 'createnotepage'*/ './components/CreateNotePage'));
const EditNotePage = React.lazy(() => import(/*webpackChunkName: 'editnotepage'*/ './components/EditNotePage'));
const NotFound = React.lazy(() => import(/*webpackChunkName: 'notfound'*/ './components/NotFound'));

import './style.scss';

import UserContext from '../utils/userContext';

const App = () => {
    const [loggedUser, setLoggedUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            const username = JSON.parse(window.atob(token.split('.')[1])).username;
            setLoggedUser(username);
        }
    }, []);

    return (
        <UserContext.Provider value={{ loggedUser, setLoggedUser }}>
            <BrowserRouter>
                <div>
                    <NavBar />
                    <Suspense fallback={
                        <div className="suspense-fallback">
                            <i class="fas fa-spinner fa-pulse fa-4x"></i>
                        </div>
                    }>
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
                    </Suspense>
                </div>
            </BrowserRouter>
        </UserContext.Provider>
    );
}

export default App;