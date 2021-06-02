import io from 'socket.io-client';

const ENDPOINT = 'http://localhost:3001';
const socket  = io(ENDPOINT, { 
    transport : ['websocket'],
    query: {jwt: sessionStorage.getItem('jwt')}
});
socket.on("connect", () => {
    console.log('connected to socket');
});

export default socket;