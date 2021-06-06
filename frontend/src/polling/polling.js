import React from 'react';
import socket from "./socketConfig";
import { connect } from 'react-redux';

function Polling(props) {
    socket.on('NEW_CHAT', (chatItem) => {
        if (!chatItem.isGroupChat) {
            if (chatItem.recipient._id === props.user._id) {
                if (props.thread._id === chatItem.author._id) {
                    props.sendNewThreadChat(chatItem);
                }
                props.updatePersonalChats(chatItem);
            }
        } else {
            if (props.thread._id === chatItem.recipient._id) {
                props.sendNewThreadChat(chatItem);
            }
            props.updateGroupChats(chatItem);
        }
    });
    socket.on('WELCOME', (msg) => {
       console.log(msg);
    });

    return (
        <div />
    )
}

function mapStateToProps(state) {
    return {
        user: state.loginReducer.user,
        jwt: state.loginReducer.jwt,
        thread: state.threadReducer
    };
}
function mapDispatchToProps(dispatch) {
    return {
        sendNewThreadChat: (chat) => dispatch({type: 'THREAD_NEW_CHAT', data: {chat} }),
        updatePersonalChats: (chat) => dispatch({type: 'PERSONAL_NEW_CHAT', data: {chat} }),
        updateGroupChats: (chat) => dispatch({type: 'GROUP_NEW_CHAT', data: {chat} })
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Polling);  