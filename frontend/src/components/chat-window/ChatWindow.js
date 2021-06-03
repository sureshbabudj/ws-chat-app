import React, { useRef, useEffect, useState } from 'react';
import { ThreeDotsVertical, ArrowRightCircleFill, CheckAll, Check2 } from 'react-bootstrap-icons';
import { connect } from 'react-redux';
import './ChatWindow.scss';
import axios from 'axios';
import timeSince from '../../util/timeSince';
import socket from "../../polling/socketConfig";

function ChatWindow(props) {
    let scrollFocusRef = useRef();
    let inputFocusRef = useRef();

    let [chats, setChats] = useState([]);
    useEffect(() => {
        getThread();
    }, [props.thread]);

    useEffect(() => {
        focus()
    }, [chats])

    useEffect(() => {
        if (props.newThreadChat) {
            setChats([...chats, props.newThreadChat]);
        }
    }, [props.newThreadChat])

    function getThread() {
        let url = `http://localhost:3001/api/threads/${props.thread._id}`;
        if (props.thread.isGroupChat) {
            url = `http://localhost:3001/api/groups/${props.thread._id}`;
        }
        axios.get(url).then(res => {
            const temp = props.thread.isGroupChat ? res.data.chats : res.data;
            setChats(temp);
        }).catch(err => {
            console.log(err);
        });
    }

    function focus() {
        scrollFocusRef.current.scrollIntoView();
        inputFocusRef.current.focus();
    }

    function getAvatar() {
        if (!chats[0]) {
            return '';
        }
        if (props.thread.isGroupChat) {
            return chats[0].recipient.avatar;
        } else {
            return chats[0].author._id === props.user._id ? chats[0].recipient.avatar : chats[0].author.avatar;
        }
    }
    function getThreadName() {
        if (!chats[0]) {
            return '';
        }
        if (props.thread.isGroupChat) {
            return chats[0].recipient.name;
        } else {
            return chats[0].author._id === props.user._id ? chats[0].recipient.name : chats[0].author.name;
        }
    }
    function submitMessage() {
        if (!inputFocusRef.current.value) {
            console.log('Enter Message!');
            return;
        }
        const payload = {
            "sentAt": Date.now(),
            "author": props.user._id,
            "message": inputFocusRef.current.value,
            "tag": "",
            "recipient": props.thread._id,
            "isGroupChat": props.thread.isGroupChat
        };
        socket.emit("POST_CHAT", payload, (res) => {
            if (!res || res.error || !res.data) {
                return;
            }
            setChats([...chats, res.data]);
            inputFocusRef.current.value = '';
        });
        // axios.post('http://localhost:3001/api/chats', payload).then(res => {
        //     console.log(res.data);
        //     inputFocusRef.current.value = '';
        //     getThread();
        // }).catch(err => {
        //     console.error(err);
        // });
    }
    return (
            <main className="chat-window">
                <header>
                    <div className="avatar">
                        <img alt="profile-img" src={getAvatar()} />
                    </div>
                    <h6>{getThreadName()}</h6>
                    <div className="actions">
                        <ThreeDotsVertical />
                    </div>
                </header>
                <ul id="chat">
                    {chats.map(chat => <li key={chat._id} className={chat.author._id === props.user._id ? 'me' : 'you'}>
                        <div className="entete">
                            <span className="status green"></span>
                            <h2>{chat.author.name}</h2>
                            <h3 className={chat.status === 'unread' ? 'unread' : ''}>
                                {timeSince(chat.sentAt)} ago, {chat.status === 'unread' ? <Check2 size={'1.2rem'} /> : <CheckAll size={'1.2rem'} /> }
                            </h3>
                        </div>
                        <div className="triangle"></div>
                        <div className="message">
                            {chat.message}
                        </div>
                    </li>)}
                    <li className="scroll-ref" ref={scrollFocusRef} />
                </ul>
                <footer>
                    <textarea placeholder="Type your message"  ref={inputFocusRef}></textarea>
                    <button type="submit"><ArrowRightCircleFill size="2rem" onClick={submitMessage} /></button>
                </footer>
          </main>
    )
}

function mapStateToProps(state) {
    return {
        user: state.loginReducer.user,
        jwt: state.loginReducer.jwt,
        thread: state.threadReducer,
        newThreadChat: state.updateChatsReducer
    };
}
function mapDispatchToProps(dispatch) {
    return {}
}
export default connect(mapStateToProps)(ChatWindow);  