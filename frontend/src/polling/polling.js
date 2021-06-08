import React from 'react';
import socket from "./socketConfig";
import store from '../store';

store.subscribe(listener)

let thread, user, newGroup;

function selectNewGroup(state) {
    return state.newEntityReducer.group
}
function selectUser(state) {
    return state.loginReducer.user;
}
function selectThread(state) {
    return state.threadReducer;
}
function listener() {
    user = selectUser(store.getState());
    thread = selectThread(store.getState());
    newGroup = selectNewGroup(store.getState());
    if (newGroup && newGroup._id) {
        joinGroup(newGroup._id)
    }
}

socket.on('NEW_CHAT', (chatItem) => {
    if (!chatItem.hasOwnProperty('group')) {
        if (chatItem.recipient._id === user._id) {
            if (thread._id === chatItem.author._id) {
                const action = { 
                    type: 'THREAD_NEW_CHAT',
                    data: { chat: chatItem } 
                };
                store.dispatch(action);
            }
            const action = { 
                type: 'PERSONAL_NEW_CHAT',
                data: { chat: chatItem } 
            };
            store.dispatch(action);
        }
    } else {
        if (thread._id === chatItem.group._id) {
            const action = { 
                type: 'THREAD_NEW_CHAT',
                data: { chat: chatItem } 
            };
            store.dispatch(action);
        }
        const action = { 
            type: 'GROUP_NEW_CHAT',
            data: { chat: chatItem } 
        };
        store.dispatch(action);
    }
});

socket.on('WELCOME', (msg) => {
    store.dispatch({type: 'NEW_TOAST', data: {toast: {msg, autohide: true, type: 'info'} }})
});

function joinGroup(groupId) {
    socket.emit('JOIN_GROUP', groupId, (data) => {
        store.dispatch({type: 'NEW_TOAST', data: {toast: {msg: 'You can start messaging in the group', autohide: true, type: 'info'} }})
        const action = { 
            type: 'NEW_GROUP',
            data: { group: null } 
        };
        store.dispatch(action);
    });
}


function Polling() {
    return (
        <div />
    )
}

export default Polling;
