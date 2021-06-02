const iniState = {
    isGroupChat: null,
    _id: ''
};
export function threadReducer(state = iniState, {type, data}) {
    if (type === 'SET_THREAD') {
        return { _id: data.thread._id, isGroupChat: data.thread.isGroupChat };
    } else {
        return state;
    }
}