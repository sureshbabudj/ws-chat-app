import React, {useEffect} from 'react';
import {io} from "socket.io-client";
import { connect } from 'react-redux';

function Polling(props) {
    const ENDPOINT = 'http://localhost:3001';
    useEffect(() => {
        const socket  = io(ENDPOINT, { 
            transport : ['websocket'],
            query: {jwt: props.jwt}
        });
        socket.on("connect", data => {
            console.log(data);
        });
        socket.on("FromAPI", data => {
            setPersons(data.personal);
            setGroups(data.groups);
            setGroupChats(data.groups);
            setPersonalChats(data.personal);
            setThreads(data);
        });
        socket.on("Error", data => {
            console.log(data);
        });
        // CLEAN UP THE EFFECT
        return () => socket.disconnect();
        //
    }, []);

    function setPersons(persons) {
        const data = [];
        Object.keys(persons).forEach(id => {
            const person = {...persons[id]};
            delete person.chats;
            data.push(person);
        });
        props.setPersons(data);
    }

    function setGroups(groups) {
        const data = [];
        Object.keys(groups).forEach(id => {
            const group = {...groups[id]};
            delete group.chats;
            data.push(group);
        });
        props.setGroups(data);
    }

    function setGroupChats(data) {
        const groupChats = Object.keys(data).map(id => data[id].chats && data[id].chats.length ? data[id].chats[data[id].chats.length-1] : null);
        props.setGroupChats(groupChats);
    }

    function setPersonalChats(data) {
        const personalChats = Object.keys(data).map(id => data[id].chats && data[id].chats.length ? data[id].chats[data[id].chats.length-1] : null);
        props.setPersonalChats(personalChats);
    }

    function setThreads(data) {
        const groups = {};
        Object.keys(data.groups).forEach(id => {
            if (data.groups[id].chats && data.groups[id].chats.length) {
                groups[id] = [...data.groups[id].chats];
            } else {
                groups[id] = [];
            }
        });
        const personal = {};
        Object.keys(data.personal).forEach(id => {
            if (data.personal[id].chats && data.personal[id].chats.length) {
                personal[id] = [...data.personal[id].chats];
            } else {
                personal[id] = [];
            }
        });
        props.setThreads({groups, personal});
    }

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
        setGroupChats: (data) => dispatch({type: 'SET_GROUP_CHATS', data}),
        setPersonalChats: (data) => dispatch({type: 'SET_PERSONAL_CHATS', data}),
        setGroups: (data) => dispatch({type: 'SET_GROUPS', data}),
        setPersons: (data) => dispatch({type: 'SET_PERSONS', data}),
        setThreads: (data) => dispatch({type: 'SET_THREADS', data})
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Polling);  