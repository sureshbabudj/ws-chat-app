import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { Tab, Tabs } from 'react-bootstrap';
import ChatItem from '../chat-item/ChatItem';
import './ChatBar.scss';
import Search from '../search/Search';

function ChatBar(props) {

    let [chats, setChats] = useState({});;
    let [groups, setGroups] = useState({});
    let [directReady, setDirectReady] = useState(false);
    let [groupReady, setGroupReady] = useState(false);
    
    useEffect(() => {
        axios.get(`http://localhost:3001/api/threads/direct`)
        .then(res => {
            const data = res.data;
            const threads = Object.keys(data);
            if (threads.length) {
                const thread = {isGroupChat: false, _id: null};
                const authorId = data[threads[0]].length && data[threads[0]][0].recipient ? data[threads[0]][0].recipient._id : '';
                const recipientId = data[threads[0]].length && data[threads[0]][0].recipient ? data[threads[0]][0].recipient._id : '';
                thread._id = authorId === props.user._id ? recipientId : authorId;
                props.selectThread(thread);
            }
            setChats(data);
            setDirectReady(true);
        })
        .catch(err => {
            console.log(err);
        });
        
        axios.get(`http://localhost:3001/api/threads/group`)
            .then(res => {
                initializeData(res.data).then(data => {
                    setGroups(data);
                    setGroupReady(true);
                }, err => {
                    console.log(err);
                });
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    function initializeData(data) {
        return new Promise((resolve, reject) => {
            const threads = Object.keys(data);
            const promises = [];
            threads.forEach(thread => {
                if (!data[thread].length) {
                    promises.push(axios.get(`http://localhost:3001/api/groups/${thread}`));
                }
            });

            Promise.all(promises).then((values) => {
                values.forEach(val => {
                    if (val.status === 200) {
                        data[val.data._id].push( {
                            author: {
                                _id : props.user._id,
                                name: props.user.name
                            },
                            group: {
                                _id: val.data._id,
                                name: val.data.name
                            }
                        });
                    }
                });
                resolve(data);
            });
        });
    }

    useEffect(() => {
        if (props.groupChat && props.groupChat.hasOwnProperty('group')) {
            const temp = {...groups};
            const groupId = props.groupChat.group._id;
            if (temp.hasOwnProperty(groupId)) {
                const tempChat = {...props.groupChat};
                tempChat.count = 0;
                const length = temp[groupId].length;
                if (length) {
                    tempChat.count = temp[groupId][length-1].count || 0;
                    tempChat.count = tempChat.count + 1;
                }
                temp[groupId].push(tempChat);
                setGroups({...temp});
            }
        }
    }, [props.groupChat]);

    useEffect(() => {
        if (props.personalChat && !props.personalChat.hasOwnProperty('group')) {
            const temp = {...chats};
            const threadId = props.user._id === props.personalChat.author._id ? props.personalChat.recipient._id : props.personalChat.author._id;
            if (temp.hasOwnProperty(threadId)) {
                const tempChat = {...props.personalChat};
                tempChat.count = 0;
                const length = temp[threadId].length;
                if (length) {
                    tempChat.count = temp[threadId][length-1].count || 0;
                    tempChat.count = tempChat.count + 1;
                }
                temp[threadId].push(tempChat);
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
                {directReady && <div className="personal-chat">
                    <Tabs defaultActiveKey="all" id="uncontrolled-tab-example">
                        <Tab eventKey="all" title="Recent">
                            {Object.keys(chats).map((thread, key) => <ChatItem key={key} chat={chats[thread][chats[thread].length-1]}/>)}
                        </Tab>
                        <Tab eventKey="archived" title="Archived">
                            {/* {Object.keys(chats).sort(() => Math.random() - 0.5).map((chat, key) => <ChatItem key={key} chat={chats[chat]}/>)} */}
                        </Tab>
                        <Tab eventKey="starred" title="Starred">
                            {/* {Object.keys(chats).sort(() => Math.random() - 0.5).map((chat, key) => <ChatItem key={key} chat={chats[chat]}/>)} */}
                        </Tab>
                    </Tabs>
                </div>}
                {groupReady && <div className="groups-chat">
                    <h6>Groups</h6>
                    <div className="groups-chat-inner">
                        {Object.keys(groups).map((thread, key) => <ChatItem key={key} chat={groups[thread][groups[thread].length-1]}/>)}
                    </div>
                </div>}
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
