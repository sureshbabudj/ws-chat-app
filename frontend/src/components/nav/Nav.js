import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import './Nav.scss';
import Home from '../../pages/home/Home';
import Login from '../../pages/login/Login';


function Nav() {
    return (
        <Router>
            <Route path="/" component={Home} exact />
            <Route path="/login" component={Login} />
        </Router>
    )
}

export default Nav
