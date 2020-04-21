import React from 'react';
import { BrowserRouter, Route, Link, Switch } from 'react-router-dom';
import Home from './components/Home';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';

const App = () => {
    return (
        <BrowserRouter>
            <div>
                <Link to={'/'}>Home</Link>
                <Link to={'/login'}>Login</Link>
                <Link to={'/signup'}>Sign up</Link>
                <Switch>
                    <Route exact path='/' component={Home} />
                    <Route path='/login' component={LoginForm} />
                    <Route path='/signup' component={SignUpForm} />
                </Switch>
            </div>
        </BrowserRouter>
    );
}

export default App;