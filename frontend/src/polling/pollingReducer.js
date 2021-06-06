function threadChatReducer(state = null, action) {
    if (action.type === 'THREAD_NEW_CHAT') {
        console.log(action.data.chat);
        return action.data.chat;
    } else {
        return state;
    }
}

function personalChatReducer(state = null, action) {
    if (action.type === 'PERSONAL_NEW_CHAT') {
        console.log(action.data.chat);
        return action.data.chat;
    } else {
        return state;
    }
}

function groupChatReducer(state = null, action) {
    if (action.type === 'GROUP_NEW_CHAT') {
        console.log(action.data.chat);
        return action.data.chat;
    } else {
        return state;
    }
}

const polling = {threadChatReducer, personalChatReducer, groupChatReducer};
export default polling;

