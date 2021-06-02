import React, { useState } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';
import * as yup from 'yup';
import axios from 'axios';
import { Formik } from 'formik';
import { connect } from 'react-redux';
import {useHistory} from 'react-router-dom';

function LoginForm(props) {
    const history = useHistory();
    const [notify, setNotify] = useState({ state: '', text: ''});

    const schema = yup.object().shape({
        email: yup.string()
            .email('Entered Email is invalid')
            .required('Please enter a valid email'),
        password: yup.string()
            .required().min(8, 'Password should contain at least 8 letters')
            .max(16, 'Password should not exceed more than 16 letters')
            .matches(
                /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/,
                'Password should contain at least an upper case letter and a Number'
            )
    });

    function login(values, form) {
        axios.post('http://localhost:3001/api/auth/login', values).then(res => {
            console.log(res);
            form.resetForm();
            setNotify({state:'success', text:'User has logged In!',  show: true});
            props.loggedIn({user: res.data, jwt: res.headers['authorization']});
            history.push('./');
        }).catch(err => {
            console.log(err);
            setNotify({state:'danger', text:err.response.data.message, show: true});
        })
    }
    return (
        <Formik
          validationSchema={schema}
          onSubmit={login}
          initialValues={{
            email: '',
            password: ''
          }}
        >
          {({
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            touched,
            isValid,
            errors,
          }) => (
            
            <Form noValidate onSubmit={handleSubmit}>
                <Alert onClose={() => setNotify({})} dismissible variant={notify.state} hidden={!notify.show}>
                   {notify.text}
                </Alert>
                <Form.Group  controlId="validationFormikEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={values.email}
                    onChange={handleChange}
                    isInvalid={touched && !!errors.email}
                  />
                  <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                    </Form.Text>
                  <Form.Control.Feedback type="invalid">Please provide a valid Email.</Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="validationFormikPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    isInvalid={touched && !!errors.password}
                  />
                  <Form.Control.Feedback type="invalid">Please provide a valid password.</Form.Control.Feedback>
                </Form.Group>
              <Button type="submit">Login</Button>
            </Form>
          )}
        </Formik>
      );
}

function mapStateToProps(state) {
    return {
        user: state.loginReducer.user,
        thread: state.threadReducer
    };
}
function mapDispatchToProps(dispatch) {
    return {
        loggedIn: (data) => dispatch({type: 'USER_LOGGED_IN', data})
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);  
