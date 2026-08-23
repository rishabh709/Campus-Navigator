require('dotenv').config();
const express = require('express');
const http = require('http');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: true }
});

const JWT_SECRET = process.env.JWT_SECRET || 'replace_this_secret';
const PORT = process.env.PORT || 3000;

// In-memory last-known positions (room -> {lon, lat, ts})
const lastPositions = new Map();

// Simple API to create a share (returns sender + viewer tokens + room id)
app.post('/create-share', (req, res) => {
  const room = crypto.randomBytes(6).toString('hex');
  const senderToken = jwt.sign({ room, role: 'sender' }, JWT_SECRET, { expiresIn: '1h' });
  const viewerToken = jwt.sign({ room, role: 'viewer' }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ room, senderToken, viewerToken });
});

// Optional: endpoint to revoke a room (not implemented fully)
app.post('/revoke', (req, res) => {
  // You can implement revocation logic here (store revoked rooms)
  res.json({ ok: true });
});

// Socket auth middleware
io.use((socket, next) => {
  const token = socket.handshake.auth && socket.handshake.auth.token;
  if (!token) return next(new Error('Authentication error: token missing'));
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) return next(new Error('Authentication error: invalid token'));
    socket.user = payload;
    return next();
  });
});

io.on('connection', (socket) => {
  const { room, role } = socket.user;
  socket.join(room);

  // If there is a last-known position, send it to the newly connected viewer
  if (role === 'viewer' && lastPositions.has(room)) {
    socket.emit('position', lastPositions.get(room));
  }

  socket.on('position', (data) => {
    // validate a bit
    if (!data || typeof data.lon !== 'number' || typeof data.lat !== 'number') return;
    const pkt = { lon: data.lon, lat: data.lat, ts: Date.now() };
    // store last-known
    lastPositions.set(room, pkt);
    // broadcast to other sockets in room
    socket.to(room).emit('position', pkt);
  });

  socket.on('disconnect', () => {
    // cleanup if needed
  });
});

server.listen(PORT, () => {
  console.log(`Socket share server listening on port ${PORT}`);
});
