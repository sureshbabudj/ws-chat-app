import React, {useState, useRef} from 'react';
import { XCircleFill } from 'react-bootstrap-icons';
import {Button, ListGroup, InputGroup, DropdownButton, Dropdown, FormControl} from 'react-bootstrap';
import axios from 'axios';
import { connect } from 'react-redux';

function SearchBar(props) {
    let [autoCompleteItems, setAutoCompleteItems] = useState([]);
    let [resource, setResource] = useState('User');
    let searchRef = useRef();

    const resources = ['User', 'Group'];

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
            console.log(err);
        });
    }

    function changeResource(value) {
        searchRef.current.value = '';
        setAutoCompleteItems([]);
        setResource(value);
    }

    function changeThread(result) {
        let isGroupChat = false;
        if (result.members && result.members.length) {
            isGroupChat = true;
            if (!result.members.includes(props.user._id)) {
                console.log('user is not part of group');
                return;
            }
        }
        const thread = {_id: result._id, isGroupChat};
        searchRef.current.value = '';
        setAutoCompleteItems([]);
        props.selectThread(thread); 
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
                                <img alt={result.name} src={result.avatar} />
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
        selectThread: (thread) => dispatch({type:'SET_THREAD', data: {thread}})
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);