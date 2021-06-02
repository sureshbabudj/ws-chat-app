import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { Tab, Tabs } from 'react-bootstrap';
import ChatItem from '../chat-item/ChatItem';
import './ChatBar.scss';
import Search from '../search/Search';

function ChatBar(props) {

    // let [chats, setChats] = useState([]);;
    // let [groups, setGroups] = useState([]);
    
    // useEffect(() => {
    //     axios.get(`http://localhost:3001/api/threads`)
    //     .then(res => {
    //         setChats(res.data);
    //         const author = props.user._id === res.data[0].author._id ? res.data[0].recipient : res.data[0].author;
    //         const thread = {_id: author._id, isGroupChat: false};
    //         props.selectThread(thread);
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     });
    //     axios.get(`http://localhost:3001/api/groups/user/${props.user._id}`)
    //     .then(res => {
    //         const groupChats = res.data.map(group => group.chats && group.chats.length ? group.chats[0] : -1);
    //         setGroups(groupChats);
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     });
    // }, []);

    return (
        <div className='chat-bar'>
            <h5>
                <span className="title">Conversations</span> 
                <span className="badge bg-primary">5</span>
                <Search />
            </h5>
            <div className="chat-bar-inner">
                <div className="personal-chat">
                    <Tabs defaultActiveKey="all" id="uncontrolled-tab-example">
                        <Tab eventKey="all" title="Recent">
                            {props.chats.map((chat, key) => <ChatItem key={key} chat={chat}/>)}
                        </Tab>
                        <Tab eventKey="archived" title="Archived">
                            {props.chats.sort(() => Math.random() - 0.5).map((chat, key) => <ChatItem key={key} chat={chat}/>)}
                        </Tab>
                        <Tab eventKey="starred" title="Starred">
                            {props.chats.sort(() => Math.random() - 0.5).map((chat, key) => <ChatItem key={key} chat={chat}/>)}
                        </Tab>
                    </Tabs>
                </div>
                <div className="groups-chat">
                    <h6>Groups</h6>
                    <div className="groups-chat-inner">
                        {props.groups && props.groups.length && props.groups.map((chat, key) => <ChatItem key={key} chat={chat}/>)}
                    </div>
                </div>
            </div>
        </div>
    )
}

function mapStateToProps(state) {
    return {
        user: state.loginReducer.user,
        chats: state.personsChatReducer,
        groups: state.groupsChatReducer,
    };
}
function mapDispatchToProps(dispatch) {
    return {
        selectThread: (thread) => dispatch({type:'SET_THREAD', data: {thread}})
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ChatBar);  
