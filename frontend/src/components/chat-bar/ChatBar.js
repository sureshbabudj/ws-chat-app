import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { Tab, Tabs } from 'react-bootstrap';
import ChatItem from '../chat-item/ChatItem';
import './ChatBar.scss';
import Search from '../search/Search';

function ChatBar(props) {

    let [chats, setChats] = useState([]);;
    let [groups, setGroups] = useState([]);
    
    useEffect(() => {
        axios.get(`http://localhost:3001/api/threads/direct`)
        .then(res => {
            setChats(res.data);
            const threads = Object.keys(res.data);
            if (threads.length) {
                const thread = {isGroupChat: false, _id: null};
                const authorId = res.data[threads[0]].length && res.data[threads[0]][0].recipient ? res.data[threads[0]][0].recipient._id : '';
                const recipientId = res.data[threads[0]].length && res.data[threads[0]][0].recipient ? res.data[threads[0]][0].recipient._id : '';
                thread._id = authorId === props.user._id ? recipientId : authorId;
                props.selectThread(thread);
            }
        })
        .catch(err => {
            console.log(err);
        });
        axios.get(`http://localhost:3001/api/threads/group`)
        .then(res => {
            setGroups(res.data);
        })
        .catch(err => {
            console.log(err);
        });
    }, []);

    useEffect(() => {
        if (props.groupChat && props.groupChat.isGroupChat) {
            const temp = [...groups];
            const groupChatIndex = temp.findIndex(chat => chat.recipient._id === props.groupChat.recipient._id);
            if (groupChatIndex !== -1) {
                const tempChat = {...props.groupChat};
                tempChat.count = temp[groupChatIndex].count || 0;
                tempChat.count = temp[groupChatIndex].count + 1;
                temp.splice(groupChatIndex, 1, tempChat);
                setGroups([...temp]);
            }
        }
    }, [props.groupChat]);

    useEffect(() => {
        if (props.personalChat && !props.personalChat.isGroupChat) {
            const temp = {...chats};
            const threadId = props.user._id === props.personalChat.author._id ? props.personalChat.recipient._id : props.personalChat.author._id;
            const personalChat = temp[threadId];
            if (personalChat) {
                const tempChat = {...props.personalChat};
                tempChat.count = personalChat.count || 0;
                tempChat.count = personalChat.count + 1;
                temp[threadId] = tempChat;
                setChats({...temp});
            }
        }
        console.log(props.personalChat);
    }, [props.personalChat]);

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
                            {Object.keys(chats).map((thread, key) => <ChatItem key={key} chat={chats[thread][0]}/>)}
                        </Tab>
                        <Tab eventKey="archived" title="Archived">
                            {/* {Object.keys(chats).sort(() => Math.random() - 0.5).map((chat, key) => <ChatItem key={key} chat={chats[chat]}/>)} */}
                        </Tab>
                        <Tab eventKey="starred" title="Starred">
                            {/* {Object.keys(chats).sort(() => Math.random() - 0.5).map((chat, key) => <ChatItem key={key} chat={chats[chat]}/>)} */}
                        </Tab>
                    </Tabs>
                </div>
                <div className="groups-chat">
                    <h6>Groups</h6>
                    <div className="groups-chat-inner">
                        {Object.keys(groups).map((thread, key) => <ChatItem key={key} chat={groups[thread][0]}/>)}
                    </div>
                </div>
            </div>
        </div>
    )
}

function mapStateToProps(state) {
    return {
        user: state.loginReducer.user,
        groupChat: state.groupChatReducer,
        personalChat: state.personalChatReducer
    };
}
function mapDispatchToProps(dispatch) {
    return {
        selectThread: (thread) => dispatch({type:'SET_THREAD', data: {thread}})
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ChatBar);  
