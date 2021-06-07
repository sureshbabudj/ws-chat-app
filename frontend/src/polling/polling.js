import React from 'react';
import socket from "./socketConfig";
import store from '../store';

store.subscribe(listener)

let thread, user;

function selectUser(state) {
    return state.loginReducer.user;
}
function selectThread(state) {
    return state.threadReducer;
}
function listener() {
    user = selectUser(store.getState());
    thread = selectThread(store.getState());
    console.log(user);
    console.log(thread);
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

function Polling(props) {
    socket.on('WELCOME', (msg) => {
        console.log(msg);
    });

    return (
        <div />
    )
}


export default Polling;