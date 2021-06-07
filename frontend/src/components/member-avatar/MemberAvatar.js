import './MemberAvatar.scss';
import {connect} from 'react-redux';
import { PersonFill } from 'react-bootstrap-icons';
import React, {useEffect, useState} from 'react';
import axios from 'axios';

function MemberAvatar(props) {
    let [member, setMember] = useState({});
    useEffect(() => {
        const url = `http://localhost:3001/api/users/${props.member._id}`;
        axios.get(url).then(res => setMember(res.data)).catch(err => console.log(err));
    }, [])
    return (
        <span className="member-avatar img-wrap" onClick={() => props.selectThread({_id: member._id, isGroupChat: false}) }>
            {member.avatar ? <img alt={member.name} src={member.avatar} /> : <PersonFill className="avatar-icon" size={'1.8rem'} /> }
        </span>
    )
}

function mapStateToProps(state) {
    return {
        user: state.loginReducer.user,
        thread: state.threadReducer
    };
}
function mapDispatchToProps(dispatch) {
    return {
        selectThread: (thread) => dispatch({type:'SET_THREAD', data: {thread}})
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(MemberAvatar);  