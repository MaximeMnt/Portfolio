const socketIO = require('socket.io');

function init(server) {
  const io = socketIO(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      // allowedHeaders: ["my-custom-header"],
      // credentials: true
    }
  });
  console.log('Socket server is listening for connections!');
  io.on('connection', (socket) => {
    io.emit('message-client-connected', socket.id);
    socket.on('mousemove', (event) => {
      event.id = socket.id;
      io.emit('mousemove', event);
    });

    socket.on('disconnect', (event) => {
      io.emit('message-client-disconnected', socket.id);
    });
  });
}

module.exports = {
  init
};
