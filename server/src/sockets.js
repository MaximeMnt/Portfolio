/* eslint-disable linebreak-style */
const socketIO = require('socket.io');

function init(server) {
  // TODO FIX DIT
  const io = socketIO(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    }
  });
  io.on('connection', (socket) => {
    io.emit('message-client-connected', socket.id);
    socket.on('mousemove', (event) => {
      event.id = socket.id;
      io.emit('mousemove', event);
    });

    socket.on('disconnect', () => {
      io.emit('message-client-disconnected', socket.id);
    });
  });
}

module.exports = {
  init
};
