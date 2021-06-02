import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import timeSince from '../../util/timeSince';
import './ChatItem.scss';

function ChatItem({chat, user, selectThread, groups, persons}) {
    let [chatData, setChatData] = useState({});
    useEffect(() => {
        let temp = chat.author, data = {};
        if (!chat.isGroupChat) {
            temp = user._id === chat.author ? chat.recipient : chat.author;
            data = persons.find(person => person._id === temp);
        } else {
            temp = chat.recipient;
            data = groups.find(group => group._id === temp);
        }
        setChatData(data);
    }, [])
    return (
        <div className="chat-item" onClick={() => selectThread({_id: chatData._id ? chatData._id : '', isGroupChat: chat.isGroupChat}) }>   
            {chatData && chatData.name && chatData.avatar && <div className="chat-item-avatar">
                <img alt={chatData.name} src={chatData.avatar} />
            </div>}
            <div className="chat-item-content">
                <div className="chat-item-extras">
                    {chatData && chatData.name && chatData.avatar && <span className="chat-item-author">{chatData.name}</span>}
                    <span className="chat-item-time">{timeSince(new Date(chat.sentAt))} ago</span>
                </div>
                <div className="chat-item-msg">
                    <div className="chat-item-msg-inner">
                        <span className="msg">{chat.message}</span>
                        <span className="badge bg-primary chat-item-count" hidden={!chat.count}>{chat.count}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

function mapStateToProps(state) {
    return {
        user: state.loginReducer.user,
        groups: state.groupsReducer,
        persons: state.personsReducer
    };
}
function mapDispatchToProps(dispatch) {
    return {
        selectThread: (thread) => dispatch({type:'SET_THREAD', data: {thread}})
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ChatItem);  