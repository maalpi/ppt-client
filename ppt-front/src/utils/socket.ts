import { io } from 'socket.io-client';

const socket = io("http://localhost:3005", {
  reconnection: true, // Reconectar automaticamente se a conexão for perdida
});

export default socket;