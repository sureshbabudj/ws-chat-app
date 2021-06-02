function groupsReducer(state = [], {type, data}) {
    if (type === 'SET_GROUPS') {
        return data;
    } else {
        return state;
    }
}

function personsReducer(state = [], {type, data}) {
    if (type === 'SET_PERSONS') {
        return data;
    } else {
        return state;
    }
}

function groupsChatReducer(state = [], {type, data}) {
    if (type === 'SET_GROUP_CHATS') {
        return data;
    } else {
        return state;
    }
}

function personsChatReducer(state = [], {type, data}) {
    if (type === 'SET_PERSONAL_CHATS') {
        return data;
    } else {
        return state;
    }
}


function threadStoreReducer(state = {groups: [], personal: []}, {type, data}) {
    if (type === 'SET_THREADS') {
        console.log(`threads: ${JSON.stringify(data)}`);
        return data;
    } else {
        return state;
    }
}

const polling = {groupsReducer, personsReducer, groupsChatReducer, personsChatReducer, threadStoreReducer};
export default polling;

