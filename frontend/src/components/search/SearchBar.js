import React, {useState, useRef} from 'react';
import { XCircleFill, PersonFill } from 'react-bootstrap-icons';
import {Button, ListGroup, InputGroup, DropdownButton, Dropdown, FormControl} from 'react-bootstrap';
import axios from 'axios';
import { connect } from 'react-redux';

function SearchBar(props) {
    let [autoCompleteItems, setAutoCompleteItems] = useState([]);
    let [resource, setResource] = useState('All');
    let searchRef = useRef();

    const resources = ['User', 'Group', 'All'];

    function fetchResults(e) {
        const value = e.target.value;
        setAutoCompleteItems([]);
        if (!value) {
            return;
        }
        let url = `http://localhost:3001/api/search?keyword=${value}`;
        if(resource) {
            url = url + `&resource=${resource}`;
        }
        axios.get(url).then(({data}) => {
            setAutoCompleteItems(data)
        }).catch(err => {
            setAutoCompleteItems([]);
            props.sendToast({msg: err, autohide: false, type: 'error'});
        });
    }

    function changeResource(value) {
        searchRef.current.value = '';
        setAutoCompleteItems([]);
        setResource(value);
    }

    function changeThread(result) {
        if (result.members && result.members.length) {
            if (!result.members.includes(props.user._id)) {
                axios.post(`http://localhost:3001/api/groups/${result._id}/join`).then(({data}) => {
                    props.sendToast({msg: `You have joined to the group ${result.name || result._id}`, autohide: true, type: 'info'});
                    props.newGroup(data); // will take care of changing thread
                    clearSearch();
                }).catch(err => {
                    props.sendToast({msg: err, autohide: false, type: 'error'});
                });
            }
        } else {
            // add new contact in thread
            props.sendToast({msg: `You are chatting to ${result.name || result._id} for the first time!` , autohide: true, type: 'info'});
            props.newContact(result); // will take care of changing thread
            clearSearch();
        }
    }

    function clearSearch() {
        searchRef.current.value = '';
        setAutoCompleteItems([]);
    }

    return (
        <div className="search-bar">
            <InputGroup className="mb-3">
                <DropdownButton
                    as={InputGroup.Prepend}
                    variant="outline-secondary"
                    title={resource}
                    id="input-group-dropdown-1"
                >
                    {resources.map((res,key) => <Dropdown.Item key={key} href="#" onClick={(e) => changeResource(res)}>{res}</Dropdown.Item>)}
                </DropdownButton>
                <FormControl aria-describedby="search-resource" onChange={(e) => fetchResults(e)} ref={searchRef} />
                <XCircleFill className="close-icon" size={'1.5rem'} onClick={() => props.toggle(false)} />
            </InputGroup>

            {autoCompleteItems && !!autoCompleteItems.length  &&
                <ListGroup>
                    {autoCompleteItems.map((result, key) =>  (
                        <ListGroup.Item key={key} onClick={() => changeThread(result)}>
                            <div>
                                {result.avatar ? <img alt={result.name} src={result.avatar} /> : <PersonFill className="avatar-icon" /> }
                                <span className="result-name">{result.name}</span>
                                {result.members && result.members.length > 0 && !result.members.includes(props.user._id) && <Button type="button">Join</Button>}
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            }
        </div>
    )
}

function mapStateToProps(state) {
    return {user: state.loginReducer.user};
}
function mapDispatchToProps(dispatch) {
    return {
        selectThread: (thread) => dispatch({type:'SET_THREAD', data: {thread}}),
        newGroup: (group) => dispatch({type:'NEW_GROUP', data: {group}}),
        newContact: (contact) => dispatch({type: 'NEW_CONTACT', data: {contact}}),
        sendToast: (toast) => dispatch({type: 'NEW_TOAST', data: {toast}})
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);