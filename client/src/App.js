import React from 'react';
import { BrowserRouter, Route, Link, Switch } from 'react-router-dom';
import Home from './components/Home';
import LoginForm from './components/LoginForm';

const App = () => {
    return (
        <BrowserRouter>
            <div>
                <Link to={'/'}>Home</Link>
                <Link to={'/login'}>Login</Link>
                <Switch>
                    <Route exact path='/' component={Home} />
                    <Route path='/login' component={LoginForm} />
                </Switch>
            </div>
        </BrowserRouter>
    );
}

export default App;