import React from 'react';
import { BrowserRouter, Route, Link, Switch } from 'react-router-dom';
import Home from './components/Home';

const App = () => {
    return (
        <BrowserRouter>
            <div>
                <Link to={'/'}>Home</Link>
                <Switch>
                    <Route exact path='/' component={Home}/>
                </Switch>
            </div>
        </BrowserRouter>
    );
}

export default App;