import React, { useRef, useEffect, useState } from 'react';
import { ThreeDotsVertical, ArrowRightCircleFill, CheckAll, Check2, PersonFill } from 'react-bootstrap-icons';
import { connect } from 'react-redux';
import './ChatWindow.scss';
import axios from 'axios';
import timeSince from '../../util/timeSince';
import socket from "../../polling/socketConfig";

function ChatWindow(props) {
    let scrollFocusRef = useRef();
    let inputFocusRef = useRef();

    let [chats, setChats] = useState([]);
    let [headers, setHeaders] = useState({title: '', avatar: ''});

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
        if (!props.thread || !props.thread._id) {
            return;
        }
        let url = `http://localhost:3001/api/threads/direct/${props.thread._id}`;
        if (props.thread.isGroupChat) {
            url = `http://localhost:3001/api/threads/group/${props.thread._id}`;
        }
        axios.get(url).then(res => {
            setChats(res.data);
            if (!res.data.length) {
                let threadUrl = `http://localhost:3001/api/users/${props.thread._id}`;
                if (props.thread.isGroupChat) {
                    threadUrl = `http://localhost:3001/api/groups/${props.thread._id}`;
                }
                axios.get(threadUrl).then(({data}) => {
                    setHeaders({...headers, title: data.name, avatar: data.avatar});
                }).catch(err => {
                    console.log(err);
                });
            } else {
                getHeaders(res.data);
            }
        }).catch(err => {
            console.log(err);
        });
    }

    function focus() {
        scrollFocusRef.current.scrollIntoView();
        inputFocusRef.current.focus();
    }

    function getHeaders(data) {
        const temp = {title: '', avatar: ''};
        if (data[0].hasOwnProperty('group')) {
            temp.avatar = data[0].group.avatar;
            temp.title = data[0].group.name;
        } else {
            temp.avatar = data[0].author._id === props.user._id ? data[0].recipient.avatar : data[0].author.avatar;
            temp.title = data[0].author._id === props.user._id ? data[0].recipient.name : data[0].author.name;
        }
        setHeaders({...temp});
    }

    function submitMessage() {
        if (!inputFocusRef.current.value) {
            console.log('Enter Message!');
            return;
        }
        const payload = {
            "message": inputFocusRef.current.value,
        };
        if (props.thread.isGroupChat) {
            payload.group = props.thread._id
        } else {
            payload.recipient = props.thread._id
        }
        // socket.emit("POST_CHAT", payload, (res) => {
        //     if (!res || res.error || !res.data) {
        //         return;
        //     }
        //     setChats([...chats, res.data]);
        //     inputFocusRef.current.value = '';
        // });
        axios.post('http://localhost:3001/api/chats', payload).then(res => {
            console.log(res.data);
            inputFocusRef.current.value = '';
            getThread();
        }).catch(err => {
            console.error(err);
        });
    }
    return (
            <main className="chat-window">
                <header>
                    <div className="avatar">
                        {headers.avatar ? <img alt="profile-img" src={headers.avatar} /> : <PersonFill className="avatar-icon" size={'1.8rem'} />}
                    </div>
                    <h6>{headers.title}</h6>
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
        newThreadChat: state.threadChatReducer
    };
}
function mapDispatchToProps(dispatch) {
    return {}
}
export default connect(mapStateToProps)(ChatWindow);  