import io from 'socket.io-client';
let socket = io.connect('http://localhost:8181');
socket.emit('client-auth', 'ui-client');

export default socket;
