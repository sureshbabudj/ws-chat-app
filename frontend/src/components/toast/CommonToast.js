import React, { useState, useEffect } from 'react';
import {connect} from 'react-redux';
import { Toast } from 'react-bootstrap';
import { BellFill } from 'react-bootstrap-icons';
import './CommonToast.scss';

function CommonToast(props) {
    const [toasts, setToasts] = useState([]);

    function getMessage(val) {
        let msg = 'Oops! Something went wrong!';
        if (typeof val === 'string') {
            msg = val;
        } else if (val.message && typeof val.message === 'string') {
            msg = val.message;
        }
        return msg;
    }

    useEffect(() => {
        if (!props.toast) {
            return;   
        }
        const temp = {
            id: Date.now() + (Math.random() * 10000),
            show: true,
            date: new Date().toString().split('GMT')[0],
            from: 'ChatBot',
            msg: getMessage(props.toast.msg),
            autohide: !!props.toast.autohide,
            type: props.toast.type || 'info'
        };
        setToasts([...toasts, temp]);
        props.clearToast();
    }, [props.toast])

    function hideToast(toast) {
        const index = toasts.findIndex(i => toast.id === i.id);
        if (index > -1) {
            const temp = [...toasts];
            temp.splice(index, 1);
            setToasts(temp);
        }
    }

    return (
        <div className="toast-container">
            {toasts.map((toast, key) => 
                <Toast key={key} show={toast.show} onClose={(key) => hideToast(toast)} autohide={toast.autohide}>
                    <Toast.Header>
                        <BellFill size="1rem" />
                        <strong className="me-auto">{toast.from}</strong>
                        <small>{toast.date}</small>
                    </Toast.Header>
                    <Toast.Body>{toast.msg}</Toast.Body>
                </Toast>
            )}
        </div>
    )
}
function mapStateToProps(state) {
    return {
        user: state.loginReducer.user,
        toast: state.toastReducer
    };
}
function mapDispatchToProps(dispatch) {
    return {
        clearToast: () => dispatch({type: 'NEW_TOAST', data: {toast: null}})
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(CommonToast);
