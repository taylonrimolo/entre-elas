// chat/server.js
require('dotenv').config();
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const DBSOURCE = path.join(__dirname, 'db.sqlite');

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// --- Configuração ---
const JWT_SECRET = process.env.JWT_SECRET || 'segredo_super_secreto';
const PORT = process.env.PORT || 3000;
const users = {}; // { username: { passwordHash } }
const messagesHistory = [];
const MAX_HISTORY_SIZE = 50;

// --- Middlewares ---
app.use(cors());
app.use(bodyParser.json());
// Rotas amigáveis para páginas (antes do express.static)
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/login.html'));
});
app.get('/cadastro', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/cadastro.html'));
});
app.get('/alterar-senha', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/alterar-senha.html'));
});
app.get('/pagina-principal', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/pagina-principal.html'));
});
app.get('/chat', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/chat/desabafo.html'));
});
app.get('/vagas', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/vagas.html'));
});
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});
app.use(express.static(path.join(__dirname, '../public')));

// --- Rotas RESTful ---
app.post('/cadastro', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Usuária e senha obrigatórios.' });
  if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password)) {
    return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres, incluindo letra e número.' });
  }
  db.get('SELECT username FROM users WHERE username = ?', [username], async (err, row) => {
    if (row) return res.status(409).json({ error: 'Usuária já existe.' });
    const passwordHash = await bcrypt.hash(password, 10);
    db.run('INSERT INTO users (username, passwordHash) VALUES (?, ?)', [username, passwordHash], (err) => {
      if (err) return res.status(500).json({ error: 'Erro ao cadastrar.' });
      return res.status(201).json({ message: 'Usuária cadastrada com sucesso!' });
    });
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (!user) return res.status(401).json({ error: 'Usuária ou senha inválidos.' });
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Usuária ou senha inválidos.' });
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '2h' });
    return res.json({ message: 'Login realizado com sucesso!', token });
  });
});

app.post('/alterar-senha', (req, res) => {
  const { username, oldPassword, newPassword } = req.body;
  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (!user) return res.status(404).json({ error: 'Usuária não encontrada.' });
    const valid = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Senha antiga incorreta.' });
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(newPassword)) {
      return res.status(400).json({ error: 'A nova senha deve ter pelo menos 6 caracteres, incluindo letra e número.' });
    }
    const newHash = await bcrypt.hash(newPassword, 10);
    db.run('UPDATE users SET passwordHash = ? WHERE username = ?', [newHash, username], (err) => {
      if (err) return res.status(500).json({ error: 'Erro ao alterar senha.' });
      return res.json({ message: 'Senha alterada com sucesso!' });
    });
  });
});

// --- Chat (Socket.io) ---
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Token ausente.'));
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return next(new Error('Token inválido ou expirado.'));
    socket.username = decoded.username;
    next();
  });
});

io.on('connection', (socket) => {
  socket.emit('history', messagesHistory);
  socket.on('chat message', (data) => {
    // Garante que só usuários autenticados enviem mensagens
    if (!socket.username) return;
    messagesHistory.push({ ...data, user: socket.username });
    if (messagesHistory.length > MAX_HISTORY_SIZE) messagesHistory.shift();
    io.emit('chat message', { ...data, user: socket.username });
  });
});

const db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) throw err;
  db.run(`CREATE TABLE IF NOT EXISTS users (
    username TEXT PRIMARY KEY,
    passwordHash TEXT NOT NULL
  )`);
});

// Fallback para 404 (deve ser a última rota)
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '../public/404.html'));
});

server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});