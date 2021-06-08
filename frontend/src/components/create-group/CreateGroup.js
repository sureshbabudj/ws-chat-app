import React, {useState} from 'react';
import { connect } from 'react-redux';
import {Formik} from 'formik';
import * as yup from 'yup';
import { Alert, Button, Form, Modal } from 'react-bootstrap';
import './CreateGroup.scss';
import axios from 'axios';

function CreateGroup(props) {
    const [notify, setNotify] = useState({ state: '', text: ''});
    const schema = yup.object().shape({
      name: yup.string().min(3).max(254).required('Please enter a valid group name')
    });

    function handleGroupCreate(values, form) {
      axios.post('http://localhost:3001/api/groups', values).then(({data}) => {
          setNotify({state:'success', text:'Group has been created successfully!',  show: true});
          props.newGroup(data);
          props.handleClose(false);
      }).catch(err => {
          setNotify({state:'danger', text:err.response.data.message, show: true});
      })
    }

    return (
      <>
        <Modal show={props.show} onHide={() => props.handleClose(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Create Group</Modal.Title>
          </Modal.Header>
          <Formik
                validationSchema={schema}
                onSubmit={handleGroupCreate}
                initialValues={{
                   name: ''
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
            <>
              <Form noValidate onSubmit={handleSubmit}>
                <Modal.Body>
                  <Alert onClose={() => setNotify({})} dismissible variant={notify.state} hidden={!notify.show}>
                    {notify.text}
                    </Alert>
                  <Form.Group controlId="validationFormikGroupName">
                      <Form.Label>Group Name</Form.Label>
                      <Form.Control name="name" type="text" placeholder="Enter Group Name" onChange={handleChange} isInvalid={touched && !!errors.name} />
                      <Form.Control.Feedback type="invalid">Please provide a valid Group Name.</Form.Control.Feedback>
                  </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={() => props.handleClose(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit">
                    Create
                  </Button>
                </Modal.Footer>
              </Form>
          </>
          )}
          </Formik>
        </Modal>
      </>
    );
}


function mapDispatchToProps(dispatch) {
  return {
      newGroup: (group) => dispatch({type:'NEW_GROUP', data: {group}})
  }
}
export default connect(null, mapDispatchToProps)(CreateGroup);  