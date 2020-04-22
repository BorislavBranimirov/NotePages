import React from 'react';
import { BrowserRouter, Route, Link, Switch } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './components/Home';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import NotesPage from './components/NotesPage';
import NotePage from './components/NotePage';

const App = () => {
    return (
        <BrowserRouter>
            <div>
                <NavBar />
                <Switch>
                    <Route exact path='/' component={Home} />
                    <Route exact path='/notes' component={NotesPage} />
                    <Route exact path='/notes/:id' component={NotePage} />
                    <Route exact path='/login' component={LoginForm} />
                    <Route exact path='/signup' component={SignUpForm} />
                </Switch>
            </div>
        </BrowserRouter>
    );
}

export default App;