const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const FormData = require('form-data');
const app = express();
const fs = require('fs');
const axios = require('axios');
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Permitir todas as origens. Em produção, restrinja conforme necessário.
    methods: ["GET", "POST"],
  }
});

let onlineUsers = {}; // Usado para armazenar usuários conectados
let images = {};

io.on("connection", (socket) => {
  console.log("CONNECTION - Um usuário conectou");
  console.log(onlineUsers)
  // Armazena o novo usuário
  socket.on("new-user", (username) => {
    onlineUsers[socket.id] = username;
    io.emit("online-users", onlineUsers);
  });

  // Inicia uma solicitação de chat
  socket.on("initiate-chat", (targetSocketId) => {
    const fromUser = onlineUsers[socket.id];
    if (fromUser) {
      io.to(targetSocketId).emit("chat-request", fromUser);
    } else {
      console.log(`Usuário não encontrado para o socket ID: ${socket.id}`);
    }
  });

  // Aceita o chat e inicia a sala
  socket.on("accept-chat", ({ fromUser, toUser }) => {
    const targetSocketId = Object.keys(onlineUsers).find(
      (id) => onlineUsers[id] === fromUser
    );
    
    if (targetSocketId) {
      const roomId = `${socket.id}-${targetSocketId}`; // ID de sala único
      io.to(targetSocketId).emit("chat-start", roomId);
      io.to(socket.id).emit("chat-start", roomId);
    }
  });

  // Entrada na sala de chat
  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    if (socket[roomId]){console.log(11111)}

    const [leftPart, rightPart] = roomId.split('-');
    const nomeDosJogadores = [onlineUsers[leftPart],onlineUsers[rightPart]];
    console.log(`Usuário entrou na sala: ${roomId}`);
    io.to(roomId).emit("room-users", nomeDosJogadores);

  });
  
let userGame = []; // Para armazenar os nomes dos jogadores

socket.on("image", ({ roomId, content, fileName }) => {
  const username = onlineUsers[socket.id]; // Pegue o nome do usuário usando socket.id

  if (username) {
    console.log(`[${username}]: imagem recebida`);
    userGame.push(username); // Adiciona o nome do jogador ao array

    // Salvar a imagem diretamente
    const filePath = `./${fileName}`;
    fs.writeFileSync(filePath, Buffer.from(content));

    // Armazenar o caminho da imagem do jogador
    images[username] = filePath;

    // Verificar se ambos os jogadores enviaram as imagens
    if (Object.keys(images).length === 2) {
      // Ambos os jogadores enviaram as imagens, enviar para a API Flask
      const player1 = userGame[0];
      const player2 = userGame[1];
      console.log(images);
      sendImagesToFlaskAPI(Object.keys(images), images[Object.keys(images)[0]], images[Object.keys(images)[1]], roomId);

      // Limpar o objeto de imagens e o array de jogadores para a próxima rodada
      images = {};
      userGame = []; // Reinicie o array de jogadores
    }
  }
});

const sendImagesToFlaskAPI = async (jogadores, player1ImagePath, player2ImagePath, roomId) => {
  try {
    console.log('player1 :', jogadores[0])
    console.log('player2 :', jogadores[1])
    const formData = new FormData();
    formData.append('images', fs.createReadStream(player1ImagePath), { filename: 'img1.jpg', contentType: 'image/jpeg' });
    formData.append('images', fs.createReadStream(player2ImagePath), { filename: 'img2.jpg', contentType: 'image/jpeg' });

    const response = await axios.post('https://d14b-34-19-101-237.ngrok-free.app/play', formData, {
      headers: formData.getHeaders( ),
    }); 

    console.log(`Resultado: ${response.data.winner}`);
    
    // Realiza o replace com os nomes dos jogadores
    const resultadoComNomes = response.data.winner
      .replace('Player 1', jogadores[0])
      .replace('Player 2', jogadores[1]);

    console.log(resultadoComNomes);
    
    io.to(roomId).emit("fim-partida", resultadoComNomes); // Emitir a mensagem de fim de partida
  } catch (error) {
    io.to(roomId).emit("fim-partida", error.response.status);
    console.log(error.response.status)
  }
};

  // Enviar e retransmitir mensagens na sala de chat
  socket.on("message", ({ roomId, content }) => {
    console.log(`usuarios conectados: ${Object.keys(onlineUsers)}`)
    const username = onlineUsers[socket.id];
    if (username) {
      console.log(`Mensagem recebida na sala ${roomId} de ${username}: ${content}`);
      io.to(roomId).emit("message", { content, from: username });
    } else {
      console.log(`Nome de usuário não encontrado para o socket ID: ${socket.id}`);
    }
  });

  // Reconectando
  socket.on("reconnect", (username) => {
    onlineUsers[socket.id] = username;
    io.emit("online-users", onlineUsers);
  });

  // Quando um usuário desconectar
  socket.on("disconnect", () => {
    console.log('usuario desconectado', onlineUsers)
    delete onlineUsers[socket.id];
    io.emit("online-users", onlineUsers);
  });
});

server.listen(3005, () => {
  console.log("Servidor Socket.IO rodando na porta 3005");
});
