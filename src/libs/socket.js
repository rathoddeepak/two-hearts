import io from 'socket.io-client';

export default socket = io("http://192.168.43.250:2021/", {
  transports: ['websocket'],
});