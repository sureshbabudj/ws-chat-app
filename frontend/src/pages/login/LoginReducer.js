import axios from "axios";
import jwt from 'jwt-decode';

const token = sessionStorage.getItem('jwt');
const user = token ? jwt(token) : null;
const iniState = {jwt: token, user};

export function loginReducer(state = iniState, action) {
    if (action.type === 'USER_LOGGED_IN') {
        sessionStorage.setItem('jwt', action.data.jwt);
        axios.defaults.headers.common['Authorization'] = `Bearer ${action.data.jwt}`;
        return { jwt: action.data.jwt, user: action.data.user };
    } else if (action.type === 'USER_LOGGED_OUT') {
        delete axios.defaults.headers.common['Authorization'];
        sessionStorage.removeItem('jwt');
        return { jwt: null, user: null };
    } else {
        axios.defaults.headers.common['Authorization'] = `Bearer ${iniState.jwt}`;
        return state;
    }
}