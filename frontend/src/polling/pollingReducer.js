function threadChatReducer(state = null, action) {
    if (action.type === 'THREAD_NEW_CHAT') {
        return action.data.chat;
    } else {
        return state;
    }
}

function personalChatReducer(state = null, action) {
    if (action.type === 'PERSONAL_NEW_CHAT') {
        return action.data.chat;
    } else {
        return state;
    }
}

function groupChatReducer(state = null, action) {
    if (action.type === 'GROUP_NEW_CHAT') {
        return action.data.chat;
    } else {
        return state;
    }
}

function newEntityReducer(state = {group: null, contact: null}, {type, data}) {
    if (type === 'NEW_GROUP') {
        return {...state, group: data.group};
    } else if (type === 'NEW_CONTACT') {
        return {...state, contact: data.contact};
    } else {
        return state;
    }
}

function toastReducer(state = null, action) {
    if (action.type === 'NEW_TOAST') {
        return action.data.toast;
    } else {
        return state;
    }
}

const polling = {threadChatReducer, personalChatReducer, groupChatReducer, newEntityReducer, toastReducer};
export default polling;

