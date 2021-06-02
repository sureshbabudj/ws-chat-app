import React, { useState } from 'react'
import { connect } from 'react-redux';
import { Nav } from 'react-bootstrap';
import { ChatFill, PeopleFill, GearFill, PersonLinesFill, BookFill, BarChartFill, CameraVideoFill } from 'react-bootstrap-icons';
import './Sidebar.scss';

function Sidebar(props) {
    const [menus, setMenus] = useState([
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
    ]);

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
            <div className="profile">
                    <img alt={props.user.name} src={props.user.avatar} />
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
export default connect(mapStateToProps)(Sidebar);  
