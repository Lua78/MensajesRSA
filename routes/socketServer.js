const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Configura la conexión de Socket.io
io.on('connection', (socket) => {
  console.log('Nuevo usuario conectado');

  // Maneja los mensajes del cliente
  socket.on('mensaje', (mensaje) => {
    console.log('Mensaje del cliente:', mensaje);

    // Envia el mensaje a todos los clientes conectados
    io.emit('mensaje', mensaje);
  });

  // Maneja la desconexión del cliente
  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${PORT}`);
});

module.exports = app