// chat/server.js
const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const path = require('node:path');

const app = express();
const server = createServer(app);
const io = new Server(server);

// Array para armazenar o histórico das últimas mensagens
const messagesHistory = [];
const MAX_HISTORY_SIZE = 50; // Limite de mensagens no histórico

// Serve arquivos estáticos da raiz do projeto (como assets/)
app.use(express.static(path.join(__dirname, '..')));

// Rota principal para servir o arquivo index.html do chat
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Evento de conexão do Socket.IO: quando um novo cliente se conecta
io.on('connection', (socket) => {
  console.log(`Um usuário conectado: ${socket.id}`); // Loga o ID do socket

  // Envia o histórico de mensagens para o novo usuário recém-conectado
  socket.emit('history', messagesHistory);

  // Evento quando o cliente se desconecta
  socket.on('disconnect', () => {
    console.log(`Um usuário desconectado: ${socket.id}`);
  });

  // Evento para receber mensagens de chat do cliente
  socket.on('chat message', (data) => {
    // 'data' agora é um objeto { text: '...', user: '...', id: '...' }
    console.log(`Mensagem de ${data.user} (ID: ${data.id}): ${data.text}`);

    // Adiciona a nova mensagem ao histórico
    messagesHistory.push(data);
    // Remove a mensagem mais antiga se o histórico exceder o limite
    if (messagesHistory.length > MAX_HISTORY_SIZE) {
        messagesHistory.shift();
    }

    // Envia a mensagem (com nome de usuário e ID do socket) para TODOS os clientes conectados (broadcast)
    io.emit('chat message', data);
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Servidor de chat rodando em http://localhost:${PORT}`);
});