import React, { useState, useRef } from 'react'
import { connect } from 'react-redux';
import { Nav, Overlay, Tooltip } from 'react-bootstrap';
import { ChatFill, PeopleFill, GearFill, PersonLinesFill, BookFill, BarChartFill, CameraVideoFill, PersonCircle } from 'react-bootstrap-icons';
import './Sidebar.scss';

function Sidebar(props) {

    const [myAvatarTooltipShow, setMyAvatarTooltipShow] = useState(false);
    const myAvatar = useRef();
    const menus = [
        {
            name: 'Groups',
            route: '/groups',
            icon: <PeopleFill size={'1.5rem'} />
        }, {
            name: 'Settings',
            route: '/settings',
            icon: <GearFill size={'1.5rem'} />
        }, {
            name: 'Unread',
            route: '/unread',
            icon: <PersonLinesFill size={'1.5rem'} />
        }, {
            name: 'Contacts',
            route: '/contacts',
            icon: <BookFill size={'1.5rem'} />
        }, {
            name: 'Usage',
            route: '/usage',
            icon: <BarChartFill size={'1.5rem'} />
        }, {
            name: 'Video Call',
            route: '/video',
            icon: <CameraVideoFill size={'1.5rem'} />
        }
    ];

    return (
        <div className="sidebar">
            <div className="logo">
                <ChatFill size={'2rem'} />
            </div>
            <Nav activeKey="/unread" onSelect={(selectedKey) => console.log(`selected ${selectedKey}`)}>
                {menus.map((i, key) => 
                    <Nav.Item key={key}>
                        <Nav.Link  href={i.route} alt={i.name} title={i.name}>
                            {i.icon}   
                        </Nav.Link>
                    </Nav.Item>
                )}
            </Nav>
            <div className="profile" ref={myAvatar} onMouseEnter={() => setMyAvatarTooltipShow(true)} onMouseLeave={() => setMyAvatarTooltipShow(false)}>
                    {props.user.avatar ? <img alt={props.user.name} src={props.user.avatar} /> : <PersonCircle className="avatar-icon" size={'1.8rem'}  />}
            </div>
            <Overlay target={myAvatar.current} show={myAvatarTooltipShow} placement="right">
                <Tooltip id="my-avatar-overlay"  >
                    {props.user.name}
                </Tooltip>
            </Overlay>
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
export default connect(mapStateToProps)(Sidebar);  
