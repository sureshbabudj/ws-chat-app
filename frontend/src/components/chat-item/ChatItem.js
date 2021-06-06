import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import timeSince from '../../util/timeSince';
import { PersonFill } from 'react-bootstrap-icons';
import './ChatItem.scss';

function ChatItem({chat, user, selectThread, groups, persons}) {
    let [chatData, setChatData] = useState({});
    useEffect(() => {
        let temp = chat.author._id;
        if (!chat.hasOwnProperty('group')) {
            temp = user._id === chat.author._id ? chat.recipient : chat.author;
        } else {
            temp = chat.group
        }
        setChatData(temp);
    }, [])
    return (
        <div className="chat-item" onClick={() => selectThread({_id: chatData._id ? chatData._id : '', isGroupChat: chat.hasOwnProperty('group')}) }>   
            <div className="chat-item-avatar">
                {chatData.avatar ? <img alt={chatData.name || ''} src={chatData.avatar} /> : <PersonFill className="avatar-icon" size={'1.8rem'} />}
             </div>
            <div className="chat-item-content">
                <div className="chat-item-extras">
                    {chatData.name && <span className="chat-item-author">{chatData._id === user._id ? `me (${chatData.name})` : chatData.name}</span>}
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
        user: state.loginReducer.user
    };
}
function mapDispatchToProps(dispatch) {
    return {
        selectThread: (thread) => dispatch({type:'SET_THREAD', data: {thread}})
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ChatItem);  
