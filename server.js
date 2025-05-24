// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

let players = {};

io.on("connection", (socket) => {
  console.log("New connection:", socket.id);

  // Assign role
  const role = Object.values(players).some(p => p.role === "snake") ? "ball" : "snake";
  players[socket.id] = { role };
  socket.emit("assignRole", role);
  console.log(`Assigned ${role} to ${socket.id}`);

  // Broadcast movements
  socket.on("move", (data) => {
    socket.broadcast.emit("playerMove", { id: socket.id, ...data });
  });

  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);
    delete players[socket.id];
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Server listening on port", PORT);
});
