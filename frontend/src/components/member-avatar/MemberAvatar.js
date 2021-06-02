import './MemberAvatar.scss';
import {connect} from 'react-redux';
import React, {useEffect, useState} from 'react';
import axios from 'axios';

function MemberAvatar(props) {
    let [member, setMember] = useState({});
    useEffect(() => {
        const url = `http://localhost:3001/api/users/${props.memberId}`;
        axios.get(url).then(res => setMember(res.data)).catch(err => console.log(err));
    }, [])
    return (
        <span className="img-wrap" onClick={() => props.selectThread({_id: member._id, isGroupChat: false}) }>
            {member && <img alt={member.name} src={member.avatar} />}
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