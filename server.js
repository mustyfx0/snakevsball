const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

// Serve static files from the current directory
app.use(express.static(__dirname));

// When user visits '/', serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Socket.IO logic
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('playerMove', (data) => {
    socket.broadcast.emit('playerMove', data);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start server
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
