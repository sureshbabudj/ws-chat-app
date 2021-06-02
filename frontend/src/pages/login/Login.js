import React from 'react'
import { Tabs, Tab } from 'react-bootstrap';
import { Chat } from 'react-bootstrap-icons';
import LoginForm from '../../components/login-form/LoginForm';
import Register from '../../components/register-form/Register';
import './login.scss'

export default function Login() {
    return (
        <div className="login row">
            <div className="col-sm"><h3 className="logo">chat <Chat /></h3></div>
            <div className="col-sm login-box">
                <Tabs defaultActiveKey="login" id="uncontrolled-tab-example">
                    <Tab eventKey="login" title="Login">
                        <LoginForm />
                    </Tab>
                    <Tab eventKey="register" title="Register">
                        <Register />
                    </Tab>
                </Tabs>

            </div>
            <div className="col-sm"></div>
        </div>
    )
}




