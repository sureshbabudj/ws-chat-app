import React, {useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import './Home.scss';
import { connect } from 'react-redux';
import Sidebar from '../../components/sidebar/Sidebar';
import ChatBar from '../../components/chat-bar/ChatBar';
import ChatWindow from '../../components/chat-window/ChatWindow';
import ChatAside from '../../components/chat-aside/ChatAside';
import axios from 'axios';

function Home(props) {
    const history = useHistory();
    axios.defaults.headers.common['Authorization'] = `Bearer ${props.jwt}`;
    axios.interceptors.response.use(response => {
        return response;
    }, error => {
        console.log(error);
        if (error.response.status === 401) {
            history.push('./login')
        }
        return error;
    });
    useEffect(() => {
       if(!props.user) {
            console.log('login')
            history.push('./login')
       }
    }, [])
    return (
        <div className="home">
            {props.user && <div className="home-inner">
                <Sidebar />
                <ChatBar />
                <ChatWindow />
                <ChatAside />
            </div>}
        </div>
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
    return {}
}
export default connect(mapStateToProps)(Home);  
