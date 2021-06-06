import React, { useEffect, useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import { BellFill, GearFill, PeopleFill, PinAngleFill, PersonFill } from 'react-bootstrap-icons';
import MemberAvatar from '../member-avatar/MemberAvatar';
import './ChatAside.scss';
import axios from 'axios';

function ChatAside(props) {
    const photos = [];
    for (let i = 0; i < 6; i++) {
        photos.push('https://picsum.photos/80/80?random=' + Math.floor(Math.random() * 1000))
    }

    let [recipient, setRecipient] = useState({});

    useEffect(() => {
        let url = `http://localhost:3001/api/users/${props.thread._id}`;
        if (props.thread.isGroupChat) {
            url = `http://localhost:3001/api/groups/${props.thread._id}`;
        }
        axios.get(url).then(res => setRecipient(res.data)).catch(err => console.log(err));
    }, [props.thread]);

    return (
        <div className="chat-aside">
            <h5> 
                <span className="aside-title">More Information </span>
                <span className="bell-icon"><BellFill size="1.5rem" /></span>
            </h5>
           
            <div className="chat-info-inner">
                <div className="chat-avatar-wrap">
                    <span className="bg"></span>
                    {recipient.avatar ? <img alt={recipient.name} src={recipient.avatar} /> : <PersonFill className="avatar-icon" size={'1.8rem'} />}
                    <div className="chat-info-content">
                        <h5>{recipient.name}</h5>
                        <p>{recipient.name} is an accountant at the Acme Inc company. {recipient.name} works very hard.</p>
                        <ul className="chat-info-actions">
                            <li><PeopleFill size="1.2rem" /></li>
                            <li><GearFill size="1.2rem" /></li>
                            <li><PinAngleFill size="1.2rem" /></li>
                        </ul>
                    </div>
                </div>

                <div className="chat-photos-wrap chat-info-widget">
                    {props.thread.isGroupChat ? 
                        (<span>
                            <h5>Members</h5> 
                            { recipient && recipient.members && recipient.members.map((member, key) => <MemberAvatar key={key} member={member.member} />)}
                        </span>)
                        :  
                        (<span>
                            <h5>Photos &amp; Multimedia</h5>
                            {photos.map((i, key) => <span className="img-wrap" key={key}><img alt="img" src={i} /></span>)}
                        </span>)
                    }
                    {!props.thread.isGroupChat && <div className="view-all-link-wrap"><span className="view-all-link">View All</span></div>}
                    
                </div>
                <div className="files-wrap chat-info-widget">
                    <h5>Files &amp; Attachments</h5>
                    <ListGroup>
                        <ListGroup.Item>Cras justo odio</ListGroup.Item>
                        <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
                        <ListGroup.Item>Morbi leo risus</ListGroup.Item>
                        <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
                    </ListGroup>
                    <div className="view-all-link-wrap"><span className="view-all-link">View All</span></div>
                </div>
            </div>
           

            
        </div>
    )
}

function mapStateToProps(state) {
    return {
        user: state.loginReducer.user,
        thread: state.threadReducer
    };
}
function mapDispatchToProps(dispatch) {
    return {}
}
export default connect(mapStateToProps)(ChatAside);  

