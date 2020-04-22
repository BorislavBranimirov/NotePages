import React from 'react';
import { BrowserRouter, Route, Link, Switch } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './components/Home';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import NotesPage from './components/NotesPage';

const App = () => {
    return (
        <BrowserRouter>
            <div>
                <NavBar />
                <Switch>
                    <Route exact path='/' component={Home} />
                    <Route path='/notes' component={NotesPage} />
                    <Route path='/login' component={LoginForm} />
                    <Route path='/signup' component={SignUpForm} />
                </Switch>
            </div>
        </BrowserRouter>
    );
}

export default App;