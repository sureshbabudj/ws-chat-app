import React, { useState } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';
import * as yup from 'yup';
import { Formik } from 'formik';
import axios from 'axios';

export default function Register() {

    const [notify, setNotify] = useState({ state: '', text: ''});
    
    const schema = yup.object().shape({
        name: yup.string()
            .min(3, 'Name should contain at least 3 letters')
            .max(255, 'Name should not exceed more than 255 letters')
            .required('Please enter a valid name'),
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

    function register(values, form) {
        axios.post('http://localhost:3001/api/auth/register', values).then(res => {
            console.log(res);
            form.resetForm();
            setNotify({state:'success', text:'Welcome to Chat!',  show: true});
        }).catch(err => {
            console.log(err);
            setNotify({state:'danger', text:err.response.data.message, show: true});
        })
    }
  return (
    <Formik
      validationSchema={schema}
      onSubmit={register}
      initialValues={{
        name: '',
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
            <Form.Group controlId="validationFormikName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Name"
                value={values.name}
                onChange={handleChange}
                isInvalid={touched && !!errors.name}
              />
              <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
            </Form.Group>
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
          <Button type="submit">Register</Button>
        </Form>
      )}
    </Formik>
  );
}