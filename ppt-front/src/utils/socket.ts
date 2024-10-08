import { io } from 'socket.io-client';

const socket = io("http://localhost:3005", {
  reconnection: true, // Reconectar automaticamente se a conexão for perdida
  reconnectionAttempts: 10, // Quantas tentativas de reconexão
  reconnectionDelay: 1000, // Tempo de espera entre tentativas
});

export default socket;